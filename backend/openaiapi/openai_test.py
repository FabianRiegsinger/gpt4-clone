from openai import AzureOpenAI

GPT4o_API_KEY = "" #os.getenv("GPT4o_API_KEY")
GPT4o_DEPLOYMENT_ENDPOINT = "" #os.getenv("GPT4o_DEPLOYMENT_ENDPOINT")
GPT4o_DEPLOYMENT_NAME = "gpt-4o"#os.getenv("GPT4o_DEPLOYMENT_NAME")

client = AzureOpenAI(
  azure_endpoint = GPT4o_DEPLOYMENT_ENDPOINT,
  api_key=GPT4o_API_KEY,
  api_version="2024-02-01"

)
response = client.chat.completions.create(
    model="gpt-4o", # model = "deployment_name".
    messages=[
        #{"role": "system", "content": "You are a helpful assistant."},
        #{"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        #{"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Please tell me the weather in Ingolstadt today."}
    ]
)

print(response.choices[0].message.content)