from rest_framework import serializers
from .models import User, Contact, Template, Campaign, Message, Course, Company, StudentEnrollment, CompanyContact, MessageTemplate
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


# Contact Serializer
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone_number', 'language', 'category', 'user', 'company', 'broadcast', 'sms', 'attributes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# Template Serializer
class TemplateSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Template
        fields = ['id', 'name', 'body', 'category', 'status', 'created_by', 'created_by_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# Campaign Serializer
class CampaignListSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Campaign
        fields = ['id', 'name', 'template', 'template_name', 'audience_type', 'status', 'created_by', 'created_by_email', 'contact_count', 'sent_count', 'failed_count', 'delivered_count', 'read_count', 'created_at']
        read_only_fields = ['id', 'created_at']


class CampaignDetailSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    contact_list = ContactSerializer(source='contacts', many=True, read_only=True)
    
    class Meta:
        model = Campaign
        fields = ['id', 'name', 'template', 'template_name', 'audience_type', 'status', 'created_by', 'created_by_email', 'contacts', 'contact_list', 'contact_count', 'sent_count', 'failed_count', 'delivered_count', 'read_count', 'created_at', 'started_at', 'completed_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'started_at', 'completed_at', 'updated_at']


# Message Serializer
class MessageSerializer(serializers.ModelSerializer):
    contact_name = serializers.CharField(source='contact.name', read_only=True)
    contact_phone = serializers.CharField(source='contact.phone_number', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'contact', 'contact_name', 'contact_phone', 'campaign', 'text', 'sender', 'read', 'created_at']
        read_only_fields = ['id', 'created_at']


# Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'category', 'instructor', 'duration_hours', 'students_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# Company Serializer
class CompanySerializer(serializers.ModelSerializer):
    account_manager_email = serializers.EmailField(source='account_manager.email', read_only=True, allow_null=True)
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'domain', 'phone', 'email', 'status', 'account_manager', 'account_manager_email', 'employees_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# StudentEnrollment Serializer
class StudentEnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = StudentEnrollment
        fields = ['id', 'student', 'student_name', 'course', 'course_name', 'enrolled_date', 'completion_percentage', 'status', 'last_accessed']
        read_only_fields = ['id', 'enrolled_date']


# CompanyContact Serializer
class CompanyContactSerializer(serializers.ModelSerializer):
    contact_name = serializers.CharField(source='contact.name', read_only=True)
    contact_phone = serializers.CharField(source='contact.phone_number', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = CompanyContact
        fields = ['id', 'contact', 'contact_name', 'contact_phone', 'company', 'company_name', 'role', 'added_date']
        read_only_fields = ['id', 'added_date']


# MessageTemplate Serializer
class MessageTemplateSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = MessageTemplate
        fields = ['id', 'name', 'content', 'category', 'variables', 'created_by', 'created_by_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']