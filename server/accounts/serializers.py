from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password as django_validate_password
from rest_framework import serializers

User = get_user_model()

DEMO_USERNAME = "demo"
DEMO_EMAIL = "demo@razerware.dev"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.RegexField(
        r"^[\w.-]+$",
        min_length=3,
        max_length=30,
        error_messages={"invalid": "Use only letters, numbers, dots, dashes and underscores."},
    )
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, max_length=128)

    def validate_username(self, value):
        # "demo" is reserved so nobody can hijack the demo account
        if value.lower() == DEMO_USERNAME or User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        value = value.lower()
        if value == DEMO_EMAIL or User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        django_validate_password(value)  # min length, common passwords, numeric only
        return value