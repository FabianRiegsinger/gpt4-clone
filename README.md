# Example Project: GPT-4o and GPT-4o-mini Clone

```
NOTE: For this application to work an AzureOpenAI endpoint and an API key needs to be pasted at the right spot.

In backend/openaiapi/views.py please provide necessary information in line 6 and 7!

GPT4o_API_KEY = ""
GPT4o_DEPLOYMENT_ENDPOINT = ""
```

```
NOTE: If downloading files/software in your environment causes problems, often a (company) proxy hinders the communication.
If this is the case, please refer to your IT Support
```

## General Information
This project contains two main folders:

* ./backend - Django backend to handle the REST API calls from the frontend and the OpenAi API
* ./electron-react-front - electron application with react ui framework (+typescriptsupport)to handle user input and OpenAI API responses
* .DOCKERFILE - Contains necessary configuration to start frontend and backend (under construction)

```
NOTE: If using Docker does not work on the users hardware, there is a second possibility to start the backend and frontend manually.
For further information on how to proceed manually, please refer to respective README files.
```

## Start Application via Docker

During the development the following software has been used. For backend and frontend specific dependencies please refer to respective README files:
* Docker Desktop: 4.34.2
* Visual Studio Code (latest version) with Docker Extension plus Dev Containers
  * More information regarding docker containers in VS Code can be found here [Link to VSCode Homepage](https://code.visualstudio.com/docs/containers/overview)
  * [VSCode Extension - Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
  * [VSCode Extension - Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
* [Readme Backend](backend/README.md)
* [Readme Frontend](electron-react-frontend/README.md)

### Startup process broken down into steps (with VSCode + Extensions)

1. Start you Docker instance (in my case Docker Desktop to get the daemon running)
2. Download the git repository [Git Repo Link](https://github.com/FabianRiegsinger/gpt4-clone) on you local system via `git clone https://github.com/FabianRiegsinger/gpt4-clone.git` or copy the repository if available
3. Open VSCode and open the git repository as a folder.
4. Press `Shift + Command + P (Mac) / Ctrl + Shift + P (Windows/Linux).` to open the command pallette and etder `Dev Containers: Rebuild and Reopen in Dev Containers`
5. The VSCode Extension should now take over and create a Docker container in addition to starting the backend and frontend
