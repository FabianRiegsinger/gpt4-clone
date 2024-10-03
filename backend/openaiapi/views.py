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

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def receive_string(request):
    # Get the string from the request data
    input_string = request.data.get('data')

    if input_string:
        # Process the string or save it
        return Response({"message": f"Received: {input_string}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No input_string provided"}, status=status.HTTP_400_BAD_REQUEST)