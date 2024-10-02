# import serializers from the REST framework
from rest_framework import serializers

# import the todo data model
from .models import OpenAiApi

# create a serializer class
class Serializer(serializers.ModelSerializer):
    # create a meta class
    class Meta:
        model = OpenAiApi
        #fields = ('id', 'title','description','completed')
        fields = ('title','description','completed')