from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    LoginViewSet,
    SignupViewSet,
    VerifySignupViewSet,
    ForgotPasswordViewSet,
    ResetPasswordViewSet,
    LogoutViewSet,
    UserPreferencesViewSet,
)

router = DefaultRouter()
router.register('users', UserPreferencesViewSet, basename='users')

urlpatterns = [
    path('auth/login/', LoginViewSet.as_view({'post': 'create'}), name='auth-login'),
    path('auth/logout/', LogoutViewSet.as_view({'post': 'create'}), name='auth-logout'),
    path('auth/signup/', SignupViewSet.as_view({'post': 'create'}), name='auth-signup'),
    path('auth/signup/verify/', VerifySignupViewSet.as_view({'post': 'create'}), name='auth-signup-verify'),
    path('auth/forgot-password/', ForgotPasswordViewSet.as_view({'post': 'create'}), name='auth-forgot-password'),
    path('auth/reset-password/', ResetPasswordViewSet.as_view({'post': 'create'}), name='auth-reset-password'),
]

urlpatterns += router.urls
