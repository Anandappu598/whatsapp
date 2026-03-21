from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    team_lead_email = serializers.EmailField(source='team_lead.email', read_only=True, allow_null=True)
    team_lead_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'team_lead', 'team_lead_email', 'team_lead_name', 'is_active', 'phone_number', 'theme_preference']
        read_only_fields = ['id']
    
    def get_team_lead_name(self, obj):
        if obj.team_lead:
            return obj.team_lead.email.split('@')[0]
        return None


class UserPreferenceSerializer(serializers.Serializer):
    """Serializer for updating user preferences"""
    theme_preference = serializers.ChoiceField(
        choices=['light', 'dark', 'auto'],
        required=True
    )


class SignupWithOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='EMPLOYEE')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value

class VerifySignupOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    
class LoginSerializers(serializers.Serializer):
      email = serializers.EmailField()
      password = serializers.CharField(write_only=True)


      def validate(self, data):
         user = authenticate(email=data["email"], password=data["password"])
         if not user:
            raise serializers.ValidationError("Invalid email or password")
         data["user"] = user
         return data
      
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return value


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=6)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)