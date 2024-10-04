"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from openaiapi.views import openai_request, set_temperature, set_model

#TODO: Probably not using django as intended!!!
#      More research on that needed!!!

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/openai_request/', openai_request, name='openai_request'),
    path('api/set_temperature/', set_temperature, name='set_temperature'),
    path('api/set_model/', set_model, name='set_model'),
]