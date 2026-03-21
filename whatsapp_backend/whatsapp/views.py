from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.hashers import make_password
from django.db import transaction
from .serializers import (LoginSerializers, SignupWithOTPSerializer, VerifySignupOTPSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, LogoutSerializer, UserPreferenceSerializer)
from .models import User
from .utils import (
    create_otp_record,
    send_signup_otp_to_admin,
    verify_otp,
    send_account_approval_email,
    send_password_reset_otp,
    send_password_reset_confirmation,
)

class LoginViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializers
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_id": user.id,
            "role": user.role,
            "email": user.email,
            "theme_preference": user.theme_preference
        })
    

class SignupViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = SignupWithOTPSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_user_data = {
            'email': serializer.validated_data['email'],
            'password_hash': make_password(serializer.validated_data['password']),
            'role': serializer.validated_data.get('role', 'EMPLOYEE'),
        }
        otp_record = create_otp_record(
            email=serializer.validated_data['email'],
            otp_type='signup',
            user_data=otp_user_data
        )
        send_signup_otp_to_admin(
            email=serializer.validated_data['email'],
            role=serializer.validated_data['role'],
            otp=otp_record.otp
        )
        return Response({
            "message": "Signup request sent to admin. Please get the OTP from admin and enter it to complete signup.",
            "email": serializer.validated_data['email']
        })

    
class VerifySignupViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = VerifySignupOTPSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_record = verify_otp(serializer.validated_data['email'], serializer.validated_data['otp'], 'signup')
        if not otp_record:
            return Response({"error": "Invalid or expired OTP. Please request a new signup."}, status=status.HTTP_400_BAD_REQUEST)

        user_data = otp_record.user_data
        if not user_data or 'password_hash' not in user_data:
            return Response(
                {"error": "Signup data is invalid. Please request a new signup."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            user = User(
                email=user_data['email'],
                role=user_data.get('role', 'EMPLOYEE')
            )
            user.password = user_data['password_hash']
            user.save()
            otp_record.is_verified = True
            otp_record.save(update_fields=['is_verified'])

        send_account_approval_email(user_data['email'])
        return Response({
            "message": "Signup completed successfully! You can now login with your credentials.",
            "email": user_data['email'],
            "role": user_data.get('role', 'EMPLOYEE')
        }, status=status.HTTP_201_CREATED)
    

class ForgotPasswordViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_record = create_otp_record(email=serializer.validated_data['email'], otp_type='forgot_password')
        send_password_reset_otp(serializer.validated_data['email'], otp_record.otp)
        return Response({"message": "OTP sent to email"})

class ResetPasswordViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_record = verify_otp(serializer.validated_data['email'], serializer.validated_data['otp'], 'forgot_password')
        if not otp_record:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.get(email=serializer.validated_data['email'])
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        otp_record.is_verified = True
        otp_record.save()
        send_password_reset_confirmation(user.email)
        return Response({"message": "Password reset successful"})


class LogoutViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
        except TokenError:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"message": "Logged out successfully"})


class UserPreferencesViewSet(viewsets.GenericViewSet):
    """ViewSet for managing user preferences like theme"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile and preferences"""
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'role': user.role,
            'phone_number': user.phone_number or '',
            'theme_preference': user.theme_preference
        })
    
    @action(detail=True, methods=['get'], url_path='profile')
    def user_profile(self, request, pk=None):
        """Get specific user profile by ID"""
        try:
            user = User.objects.get(pk=pk)
            return Response({
                'id': user.id,
                'name': user.email.split('@')[0].replace('.', ' ').title(),
                'email': user.email,
                'role': user.role,
                'role_display': user.get_role_display(),
                'phone_number': user.phone_number or '',
                'is_active': user.is_active
            })
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['patch'])
    def theme(self, request):
        """Update theme preference"""
        serializer = UserPreferenceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.theme_preference = serializer.validated_data['theme_preference']
        user.save(update_fields=['theme_preference'])
        
        return Response({
            "message": "Theme preference updated",
            "theme_preference": user.theme_preference
        })