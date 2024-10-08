from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from openai import AzureOpenAI

import requests
import os
import logging
import json

#TODO: Don't initialize logger globally
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
    __init__():
        initialises varialbes which are necessary for the gpt api to work.

    set_deployment_name():
        setter method to define which model to use. Possible options: gpt-4o and gpt-4o-mini.

    set_temperature():
        sets temperature of model between 0.1 and 1.0. Lower value makes output more deterministic and focused.

    get_private_info():
        returns member variables. Normally, considered unsafe. Remove in production code.

    generate_response(new_year):
        uses request from react frontend to generate a response via openAi's chat gpt api.

    get_wethear(location):
        tries to scaffold weather information about given location since gpt api does not have access to live data
    """

    functions = [{
        "name": "get_weather",
        "description": "Get the current weather for a specified location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The name of the city or location to get the weather for."
                }
            },
            "required": ["location"]
        }
    }]


    def __init__(self, depl_name='gpt-4o', temperature=1.0):
        logging.info(f"Initializing {depl_name} CLONE...")
        self.api_key = os.getenv("GPT4o_API_KEY")
        self.depl_endpnt = os.getenv("GPT4o_DEPLOYMENT_ENDPOINT")
        self.depl_name = depl_name
        self.temperature = temperature

    def generate_response(self, message) -> str:
        client = AzureOpenAI(
            azure_endpoint = self.depl_endpnt,
            api_key=self.api_key,
            api_version="2024-02-01"
        )
        logging.info("Generating response...")
        response = client.chat.completions.create(
            model=self.depl_name,
            # Function calling example with weather information
            functions=self.functions,
            # Let the model decide to call a function
            function_call="auto",
            temperature=float(self.temperature),
            messages=[{"role": "user", "content": message}]
        )
        logging.info("Response generated!")
        return(response.choices[0].message)
        #return(response.choices[0].message.content)

    def set_deployment_name(self, new_name):
        """Setter method to set the classes private variable for the model version/name"""
        self.depl_name = new_name

    def set_temperature(self, new_temp):
        """Setter method to set the classes private variable for the temperature"""
        self.temperature = new_temp

    def get_private_info(self):
        """Normally, this should be prohibited. Only done here for debugging purposes."""
        logging.info(f"API_KEY: {self.api_key}, \
                DEPLOYMENT_ENDPOINT: {self.depl_endpnt}, \
                DEPLOYMENT_NAME: {self.depl_name}, \
                TEMPERATURE OF RESP: {self.temperature}")

    def get_weather(self, location):
        """
        Fetches current weather data for the specified location using OpenWeatherMap API.
        Method is used as an example for function calling

        Args:
            location (str): The name of the city or location.

        Returns:
            dict: A dictionary containing weather information.
        """
        api_key = os.getenv('OPENWEATHERMAP_API_KEY')

        if not api_key:
            logger.error("OpenWeatherMap API key not found in environment variables.")

        #TODO: Get API key and uncomment below to get a real response
        #base_url = "http://api.openweathermap.org/data/2.5/weather"

        #params = {
        #    'q': location,
        #    'appid': api_key,
        #    'units': 'metric'  # Use 'imperial' for Fahrenheit
        #}

        #response = requests.get(base_url, params=params)

        #if response.status_code != 200:
        #    logger.error(f"Failed to get weather data: {response.text}")

        #data = response.json()
        # Just an example.
        weather_info = {
            "location": "Ingolstadt",
            "temperature": "10 degrees",
            "description": "partially cloudy",
            "humidity": "no humidity",
            "wind_speed": "small gusts"
        }

        return weather_info

# Init GptClone class so that the responses may be generated as soon as the frontend requests one.
#TODO: Do not use global instantiation
logger.info("Instantiating class Gpt4Clone")
gpt_instance = Gpt4Clone()

#TODO Also wrap this in a class
@api_view(['POST'])
def openai_request(request):
    """
    API method to get user input from frontend to forward it to the OpenAI API

    Parameters
    ----------
    request : str
        Users input/request
    """
    logger.info("openai_request got called")
    # Get the string from the request data
    fe_msg = request.data.get('data')

    if fe_msg:
        gpt_response = gpt_instance.generate_response(fe_msg)

        if gpt_response.function_call:
            function_name = gpt_response.function_call.name
            arguments = json.loads(gpt_response.function_call.arguments)
            if function_name == "get_weather":
                location = arguments.get("location")
                weather_info = gpt_instance.get_weather(location)

                if "error" in weather_info:
                    return weather_info["error"]

                weather_summary = (
                    f"Current weather in {weather_info['location']}:\n"
                    f"Temperature: {weather_info['temperature']}°C\n"
                    f"Condition: {weather_info['description'].capitalize()}\n"
                    f"Humidity: {weather_info['humidity']}\n"
                    f"Wind Speed: {weather_info['wind_speed']} m/s"
                )

                # Send "manipulated message"
                return Response({"message": f"{weather_summary}"}, status=status.HTTP_200_OK)
        else:
            # Process the string or save it
            return Response({"message": f"{gpt_response.content}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No input_string provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def set_temperature(request):
    """
    API method to set the temperature for the chosen model via the frontend

    Parameters
    ----------
    request : str
        Temperature value
    """
    logger.info("set_temperature got called")
    # Get the string from the request
    input_string = request.data.get('data')

    if input_string:
        gpt_instance.set_temperature(input_string)
        logging.info(f"Successfully set temperature of model to {input_string}")
        # Process the string or save it
        return Response({"message": f"Temperature of model has been set successfully to: {input_string}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Something went wrong while trying to read the desired temperature of the model. Debugging \
                                   the django backend may be needed."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def set_model(request):
    """
    API method to set model type via frontend

    Parameters
    ----------
    request : str
        Model name as string
    """
    logger.info("set_model got called")
    # Get the string from the request
    deployment_name = request.data.get('data')

    if deployment_name:
        # Set the deployment name in class Gpt4Clone
        gpt_instance.set_deployment_name(deployment_name)
        return Response({"message": f"Set model name to: {deployment_name}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Something went wrong while trying to read the models deployment name. Debugging \
                                   the django backend may be needed."}, status=status.HTTP_400_BAD_REQUEST)