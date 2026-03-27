from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from datetime import timedelta
import random

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role='EMPLOYEE', **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(email=self.normalize_email(email), role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        return self.create_user(
            email=email,
            password=password,
            role="ADMIN",
            is_staff=True,
            is_superuser=True,
        )
   
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('EMPLOYEE', 'Employee'),
        ('MANAGER', 'Manager'),
    )

    THEME_CHOICES = (
        ('light', 'Light Mode'),
        ('dark', 'Dark Mode'),
        ('auto', 'Auto/System Default')
    )

    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='EMPLOYEE')
    team_lead = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='team_members', help_text='Team Lead for this user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    theme_preference = models.CharField(max_length=10, choices=THEME_CHOICES, default='auto')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
   

class OTPVerification(models.Model):
    OTP_TYPE_CHOICES = (
        ('signup', 'Signup'),
        ('forgot_password', 'Forgot Password'),
    )
    
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    otp_type = models.CharField(max_length=20, choices=OTP_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    user_data = models.JSONField(null=True, blank=True)  # To store signup data temporarily
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))
    
    def is_valid(self):
        return not self.is_verified and timezone.now() < self.expires_at
    
    def __str__(self):
        return f"{self.email} - {self.otp_type} - {self.otp}"
    
class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

class Contact(models.Model):
    CATEGORY_CHOICES = (
        ('B2B', 'Business to Business'),
        ('B2C', 'Business to Consumer'),
    )
    
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='B2C')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    company = models.CharField(max_length=255, blank=True, null=True)  # For B2B contacts
    broadcast = models.BooleanField(default=True)
    sms = models.BooleanField(default=True)
    attributes = models.JSONField(default=dict, blank=True)  # Custom contact attributes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.phone_number})"


class Template(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
    
    name = models.CharField(max_length=255)
    body = models.TextField()
    category = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Campaign(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SCHEDULED', 'Scheduled'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )
    
    AUDIENCE_CHOICES = (
        ('B2B', 'Business to Business'),
        ('B2C', 'Business to Consumer'),
        ('MIXED', 'Mixed'),
    )
    
    name = models.CharField(max_length=255)
    template = models.ForeignKey(Template, on_delete=models.CASCADE, related_name='campaigns')
    audience_type = models.CharField(max_length=20, choices=AUDIENCE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    contacts = models.ManyToManyField(Contact, related_name='campaigns')
    contact_count = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    delivered_count = models.IntegerField(default=0)
    read_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Message(models.Model):
    SENDER_CHOICES = (
        ('sent', 'Sent'),
        ('received', 'Received'),
    )
    
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='messages')
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True, related_name='messages')
    text = models.TextField()
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.contact.name} - {self.sender}"


class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    instructor = models.CharField(max_length=255, blank=True, null=True)
    duration_hours = models.IntegerField(default=0)
    students_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Company(models.Model):
    STATUS_CHOICES = (
        ('PROSPECT', 'Prospect'),
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )
    
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROSPECT')
    account_manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_companies')
    employees_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class StudentEnrollment(models.Model):
    STATUS_CHOICES = (
        ('ENROLLED', 'Enrolled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('DROPPED', 'Dropped'),
    )
    
    student = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_date = models.DateTimeField(auto_now_add=True)
    completion_percentage = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ENROLLED')
    last_accessed = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-enrolled_date']
    
    def __str__(self):
        return f"{self.student.name} - {self.course.name}"


class CompanyContact(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='company_relations')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contacts')
    role = models.CharField(max_length=255, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('contact', 'company')
    
    def __str__(self):
        return f"{self.contact.name} at {self.company.name}"


class MessageTemplate(models.Model):
    CATEGORY_CHOICES = (
        ('WELCOME', 'Welcome'),
        ('PROMOTIONAL', 'Promotional'),
        ('TRANSACTIONAL', 'Transactional'),
        ('REMINDER', 'Reminder'),
        ('SUPPORT', 'Support'),
    )
    
    name = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    variables = models.JSONField(default=list, blank=True)  # List of variable names like ["{name}", "{course}"]
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
