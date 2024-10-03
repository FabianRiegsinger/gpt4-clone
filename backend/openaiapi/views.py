#from django.shortcuts import render

# import view sets from the REST framework
#from rest_framework import viewsets

# import the OpenAiApi from the serializer file
#from .serializers import OpenAiApi

# import the OpenAiApi model from the models file
#from .models import OpenAiApi

# create a class for the OpenAiApi model viewsets
#class OpenAiApiView(viewsets.ModelViewSet):
#    # create a serializer class and
#    # assign it to the OpenAiApi class
#    serializer_class = OpenAiApi

#    # define a variable and populate it
#    # with the OpenAiApi list objects
#    queryset = OpenAiApi.objects.all()

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from openai import AzureOpenAI

GPT4o_API_KEY = "" #os.getenv("GPT4o_API_KEY")
GPT4o_DEPLOYMENT_ENDPOINT = "" #os.getenv("GPT4o_DEPLOYMENT_ENDPOINT")
GPT4o_DEPLOYMENT_NAME = "gpt-4o"#os.getenv("GPT4o_DEPLOYMENT_NAME")

class Gpt4Clone:
    """
    Main Gpt4oClone class for generating responses for the React framework.
    Needs information like api_key and deployment_endpoint to work as expected.

    Attributes
    ----------
    api_key : str
        api key for the Azure OpenAi API
    depl_endpnt : str
        Deployment endpoint url for Aure OpenAI API
    depl_name : str
        Which verion of gpt 4o to: Either gpt-4o, or gtp-4o-mini
    temperature : int
        From 0 to 1. Determines diversity of api's responses. Constraints: 0 to 1.

    Methods
    -------
    display_info():
        Prints the car's details.

    update_year(new_year):
        Updates the year of the car.
    """
    def __init__(self, api_key='secret', depl_endpnt='also_secret', depl_name='gpt-4o', temperature=1.0):
        print("INFO: Initializing GPT4o-CLONE...")
        self.api_key = api_key
        self.depl_endpnt = depl_endpnt
        self.depl_name = depl_name
        self.temperature = temperature
        self.response = ''

        self.client = AzureOpenAI(
            azure_endpoint = self.depl_endpnt,
            api_key=self.api_key,
            api_version="2024-02-01"
        )
        print("INFO: Initialization done!\n")

    def generate_response(self, message) -> str:
        print("INFO: Generating response...")
        self.response = self.client.chat.completions.create(
            model=self.depl_name,
            messages=[{"role": "user", "content": message}]
        )
        print("INFO: Response generated!")
        return(self.response.choices[0].message.content)

    def set_deployment_name(self, new_name):
        self.depl_name = new_name

    def set_temperature(self, new_temp):
        self.temperature = new_temp

    def get_private_info(self):
        """
            Normally, this should be prohibited. Only done for debugging purposes
        """
        print(f"API_KEY: {self.api_key}, \
                DEPLOYMENT_ENDPOINT: {self.depl_endpnt}, \
                DEPLOYMENT_NAME: {self.depl_name}, \
                TEMPERATURE OF RESP: {self.temperature}")

# Init GptClone class so that the responses may be generated as soon as the frontend requests one.
gptcl = Gpt4Clone(GPT4o_API_KEY, GPT4o_DEPLOYMENT_ENDPOINT, GPT4o_DEPLOYMENT_NAME)

@api_view(['POST'])
def openai_request(request):
    # Get the string from the request data
    fe_msg = request.data.get('data')

    if fe_msg:
        gpt_response = gptcl.generate_response(fe_msg)
        # Process the string or save it
        return Response({"message": f"{gpt_response}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No input_string provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def set_temperature(request):
    # Get the string from the request data
    input_string = request.data.get('data')

    if input_string:
        # Process the string or save it
        return Response({"message": f"Received: Temperature of model has been set successfully to: {input_string}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Something went wrong while trying to set the temperature of the model. Debugging \
                                   the django backend may be needed."}, status=status.HTTP_400_BAD_REQUEST)