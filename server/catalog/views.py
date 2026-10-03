from rest_framework import filters, generics

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "brand", "description"]
    ordering_fields = ["price", "name", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        qs = Product.objects.select_related("category")
        params = self.request.query_params

        if category := params.get("category"):
            slugs = [s.strip() for s in category.split(",") if s.strip()]
            qs = qs.filter(category__slug__in=slugs)
        if brand := params.get("brand"):
            qs = qs.filter(brand__iexact=brand)
        if min_price := params.get("min_price"):
            qs = qs.filter(price__gte=min_price)
        if max_price := params.get("max_price"):
            qs = qs.filter(price__lte=max_price)
        if params.get("featured") == "true":
            qs = qs.filter(featured=True)
        if params.get("in_stock") == "true":
            qs = qs.filter(stock__gt=0)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related("category")
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"