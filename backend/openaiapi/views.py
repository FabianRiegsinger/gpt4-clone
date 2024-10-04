from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from openai import AzureOpenAI

GPT4o_API_KEY = "" #os.getenv("GPT4o_API_KEY")
GPT4o_DEPLOYMENT_ENDPOINT = "" #os.getenv("GPT4o_DEPLOYMENT_ENDPOINT")

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
    """
    def __init__(self, api_key='secret', depl_endpnt='also_secret', depl_name='gpt-4o', temperature=1.0):
        print(f"INFO: Initializing {depl_name} CLONE...")
        self.api_key = api_key
        self.depl_endpnt = depl_endpnt
        self.depl_name = depl_name
        self.temperature = temperature

    def generate_response(self, message) -> str:
        client = AzureOpenAI(
            azure_endpoint = self.depl_endpnt,
            api_key=self.api_key,
            api_version="2024-02-01"
        )
        print("INFO: Generating response...")
        response = client.chat.completions.create(
            model=self.depl_name,
            temperature=self.temperature,
            messages=[{"role": "user", "content": message}]
        )
        print("INFO: Response generated!")
        return(response.choices[0].message.content)

    def set_deployment_name(self, new_name):
        print(f"INFO: Successfully set deployment name of model to: {new_name}")
        self.depl_name = new_name

    def set_temperature(self, new_temp):
        self.temperature = new_temp

    def get_private_info(self):
        """Normally, this should be prohibited. Only done for debugging purposes."""
        print(f"API_KEY: {self.api_key}, \
                DEPLOYMENT_ENDPOINT: {self.depl_endpnt}, \
                DEPLOYMENT_NAME: {self.depl_name}, \
                TEMPERATURE OF RESP: {self.temperature}")

# Init GptClone class so that the responses may be generated as soon as the frontend requests one.
#TODO: Do not use global instantiation
gpt_instance = Gpt4Clone(GPT4o_API_KEY, GPT4o_DEPLOYMENT_ENDPOINT)

@api_view(['POST'])
def openai_request(request):
    # Get the string from the request data
    fe_msg = request.data.get('data')

    if fe_msg:
        #gpt_response = gpt_instance.generate_response(fe_msg)
        gpt_response = """
Sure! Here's a simple "Hello, World!" program in Python:

```python
print("Hello, World!")
```

To run this program, you can save it in a file named `hello.py` and execute it with Python:

```bash
python hello.py
```

This will output:

```
Hello, World!
```

Feel free to ask if you have any further questions!
        """
        # Process the string or save it
        return Response({"message": f"{gpt_response}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No input_string provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def set_temperature(request):
    # Get the string from the request data
    input_string = request.data.get('data')

    if input_string:
        gpt_instance.set_temperature(input_string)
        print(f"INFO: Successfully set temperature of model to {input_string}")
        # Process the string or save it
        return Response({"message": f"Received: Temperature of model has been set successfully to: {input_string}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Something went wrong while trying to read the desired temperature of the model. Debugging \
                                   the django backend may be needed."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def set_model(request):
    # Get the string from the request data
    deployment_name = request.data.get('data')

    if deployment_name:
        gpt_instance.set_deployment_name(deployment_name)
        return Response({"message": f"Set model name to: {deployment_name}"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Something went wrong while trying to read the models deployment name. Debugging \
                                   the django backend may be needed."}, status=status.HTTP_400_BAD_REQUEST)