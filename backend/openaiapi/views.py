from django.shortcuts import render

# import view sets from the REST framework
from rest_framework import viewsets

# import the OpenAiApi from the serializer file
from .serializers import OpenAiApi

# import the OpenAiApi model from the models file
from .models import OpenAiApi

# create a class for the OpenAiApi model viewsets
class OpenAiApiView(viewsets.ModelViewSet):

    # create a serializer class and
    # assign it to the OpenAiApi class
    serializer_class = OpenAiApi

    # define a variable and populate it
    # with the OpenAiApi list objects
    queryset = OpenAiApi.objects.all()