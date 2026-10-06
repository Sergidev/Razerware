from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import DEMO_EMAIL, DEMO_USERNAME, RegisterSerializer, UserSerializer

User = get_user_model()


class AuthThrottle(AnonRateThrottle):
    scope = "auth"


def auth_response(user, status=200):
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        },
        status=status,
    )


class PublicAuthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AuthThrottle]


class RegisterView(PublicAuthView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.create_user(**serializer.validated_data)
        return auth_response(user, status=201)


class LoginView(PublicAuthView):
    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))

        user = User.objects.filter(email__iexact=email).first()
        if user is None or not user.is_active or not user.check_password(password):
            return Response({"detail": "Invalid email or password."}, status=401)
        return auth_response(user)


class DemoLoginView(PublicAuthView):
    """One-click account for recruiters. It has no password and no privileges."""

    def post(self, request):
        user, created = User.objects.get_or_create(
            username=DEMO_USERNAME, defaults={"email": DEMO_EMAIL}
        )
        if created:
            user.set_unusable_password()
            user.save()
        return auth_response(user)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)