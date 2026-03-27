from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.hashers import make_password
from django.db import transaction
from .serializers import (
    LoginSerializers, SignupWithOTPSerializer, VerifySignupOTPSerializer, 
    ForgotPasswordSerializer, ResetPasswordSerializer, LogoutSerializer, UserPreferenceSerializer,
    ContactSerializer, TemplateSerializer, CampaignListSerializer, CampaignDetailSerializer,
    MessageSerializer, CourseSerializer, CompanySerializer, StudentEnrollmentSerializer,
    CompanyContactSerializer, MessageTemplateSerializer
)
from .models import User, Contact, Template, Campaign, Message, Course, Company, StudentEnrollment, CompanyContact, MessageTemplate
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


# Contact ViewSet
class ContactViewSet(viewsets.ModelViewSet):
    """ViewSet for managing contacts"""
    permission_classes = [IsAuthenticated]
    serializer_class = ContactSerializer
    
    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def b2b(self, request):
        """Get all B2B contacts"""
        contacts = self.get_queryset().filter(category='B2B')
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def b2c(self, request):
        """Get all B2C contacts"""
        contacts = self.get_queryset().filter(category='B2C')
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)


# Template ViewSet
class TemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing message templates"""
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateSerializer
    
    def get_queryset(self):
        return Template.objects.filter(created_by=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def approved(self, request):
        """Get only approved templates"""
        templates = self.get_queryset().filter(status='APPROVED')
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)


# Campaign ViewSet
class CampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for managing campaigns"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Campaign.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CampaignDetailSerializer
        return CampaignListSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def running(self, request):
        """Get all running campaigns"""
        campaigns = self.get_queryset().filter(status='RUNNING')
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def launch(self, request, pk=None):
        """Launch a campaign"""
        campaign = self.get_object()
        if campaign.status != 'DRAFT':
            return Response(
                {"error": "Only draft campaigns can be launched"},
                status=status.HTTP_400_BAD_REQUEST
            )
        campaign.status = 'RUNNING'
        campaign.save()
        return Response({"message": "Campaign launched successfully", "status": campaign.status})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a campaign as completed"""
        campaign = self.get_object()
        campaign.status = 'COMPLETED'
        campaign.save()
        return Response({"message": "Campaign completed", "status": campaign.status})


# Message ViewSet
class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing messages"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        # Get all messages from contacts owned by the user
        return Message.objects.filter(contact__user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def contact_messages(self, request):
        """Get all messages for a specific contact"""
        contact_id = request.query_params.get('contact_id')
        if not contact_id:
            return Response(
                {"error": "contact_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            contact = Contact.objects.get(id=contact_id, user=request.user)
            messages = Message.objects.filter(contact=contact).order_by('created_at')
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
        except Contact.DoesNotExist:
            return Response(
                {"error": "Contact not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# Course ViewSet
class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for managing courses"""
    permission_classes = [IsAuthenticated]
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        return Course.objects.all()


# Company ViewSet
class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for managing B2B companies"""
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySerializer
    
    def get_queryset(self):
        return Company.objects.all()
    
    @action(detail=False, methods=['get'])
    def my_companies(self, request):
        """Get companies managed by current user"""
        companies = Company.objects.filter(account_manager=request.user)
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active companies"""
        companies = Company.objects.filter(status='ACTIVE')
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)


# StudentEnrollment ViewSet
class StudentEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing student course enrollments"""
    permission_classes = [IsAuthenticated]
    serializer_class = StudentEnrollmentSerializer
    
    def get_queryset(self):
        return StudentEnrollment.objects.filter(student__user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def course_students(self, request):
        """Get all students enrolled in a course"""
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response(
                {"error": "course_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            course = Course.objects.get(id=course_id)
            enrollments = StudentEnrollment.objects.filter(course=course)
            serializer = self.get_serializer(enrollments, many=True)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# CompanyContact ViewSet
class CompanyContactViewSet(viewsets.ModelViewSet):
    """ViewSet for managing company-contact relationships"""
    permission_classes = [IsAuthenticated]
    serializer_class = CompanyContactSerializer
    
    def get_queryset(self):
        return CompanyContact.objects.filter(contact__user=self.request.user)


# MessageTemplate ViewSet
class MessageTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing pre-built message templates"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageTemplateSerializer
    
    def get_queryset(self):
        return MessageTemplate.objects.filter(created_by=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)