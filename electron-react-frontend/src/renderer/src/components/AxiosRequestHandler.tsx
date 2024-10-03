import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function AxiosRequestHandler(msg: string, api_key: string): Promise<string> {
  try {
    const response = await axios.post(`http://localhost:8000/api/${api_key}/`, {
      data: msg
    })
    // If successful return response of api
    return response
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      return `Error: ${error.response.data.error}`
    } else if (error.request) {
      // Request was made but no response received
      return 'Error: No response from server'
    } else {
      // Other errors
      return `Error: ${error.message}`
    }
  }
}
