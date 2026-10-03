from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "brand", "price", "stock", "featured")
    list_filter = ("category", "brand", "featured")
    search_fields = ("name", "brand")
    prepopulated_fields = {"slug": ("name",)}