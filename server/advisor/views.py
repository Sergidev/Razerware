import logging

from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from catalog.models import Product
from catalog.serializers import ProductListSerializer

from .services import ask_advisor

log = logging.getLogger(__name__)

MAX_MESSAGES = 10
MAX_CHARS = 500


class MessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["user", "assistant"])
    content = serializers.CharField(max_length=MAX_CHARS)


class AdvisorRequestSerializer(serializers.Serializer):
    messages = MessageSerializer(many=True, allow_empty=False, max_length=MAX_MESSAGES)

    def validate_messages(self, value):
        if value[-1]["role"] != "user" or value[0]["role"] != "user":
            raise serializers.ValidationError("Conversation must start and end with a user message.")
        return value


class AdvisorThrottle(AnonRateThrottle):
    scope = "advisor"


class AdvisorView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AdvisorThrottle]

    def post(self, request):
        serializer = AdvisorRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = ask_advisor(serializer.validated_data["messages"])
        except Exception:
            log.exception("Advisor call failed")
            return Response(
                {"detail": "The advisor is unavailable right now. Please try again in a moment."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Anti-hallucination: keep only slugs that really exist in the database
        slugs = [r.slug for r in result.recommendations]
        by_slug = Product.objects.select_related("category").in_bulk(slugs, field_name="slug")

        products = []
        for rec in result.recommendations[:3]:
            product = by_slug.get(rec.slug)
            if product:
                products.append({**ProductListSerializer(product).data, "reason": rec.reason})

        return Response({"reply": result.reply, "products": products})