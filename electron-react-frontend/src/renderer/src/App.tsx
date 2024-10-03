import { useState, useEffect, useRef, useCallback } from 'react'
import { BiUser, BiSend, BiSolidUserCircle } from 'react-icons/bi'
import { MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md'
import { RxReload, RxCopy, RxCode } from 'react-icons/rx'

import { AxiosRequestHandler } from './components/AxiosRequestHandler'
import ZeissLogo from '../../../resources/zeiss-logo.png'

/**
 * Parent APP
 * @returns all the code
 */
function App(): JSX.Element {
  const [text, setText] = useState('')
  const [gptVersion, setGptVersion] = useState('')
  const [modelTemp, setModelTemp] = useState(1.0)
  const [message, setMessage] = useState('') // was null before
  const [previousChats, setPreviousChats] = useState([])
  const [localChats, setLocalChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState('') // was null before
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  //const [errorText, setErrorText] = useState('')
  const [isShowSidebar, setIsShowSidebar] = useState(false)
  const scrollToLastItem = useRef(null)

  /**
   * Deletes content of chat window. Basically resets everything
   */
  const deleteChatContent = (): void => {
    setMessage('')
    setText('')
    window.localStorage.setItem('lastRequest', '')
    setCurrentTitle('')
  }

  /**
   * function which gets called when gpt-4o button got pressed at the beginning
   * Uses Rest API to set gpt model type to gpt-4o
   */
  const chooseGpt4o = (): any => {
    AxiosRequestHandler('gpt-4o', 'set_model')
    setGptVersion('gpt-4o')
  }

  /**
   * function which gets called when gpt-4o button got pressed at the beginning
   * Uses Rest API to set gpt model type to gpt-4o-mini
   */
  const chooseGpt4Mini = (): any => {
    AxiosRequestHandler('gpt-4o-mini', 'set_model')
    setGptVersion('gpt-4o-mini')
  }

  /**
   * Just a toggle to show or hide the sidebar
   */
  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev)
  }, [])

  /**
   * Asynchronous function which checks if the users input is correct and uses the
   * REST API to set the models temperature to the users desired value.
   * @param msg Should look like setModelsTemp=0.2
   */
  async function changeModelsTemperature(msg: string): Promise<string> {
    // Regex to match numbers
    const match = msg.match(/[-+]?[0-9]*\.?[0-9]+/)
    // Convert extracted number to floating point if possible. Otherwise, return null
    const temp_number = match ? match[0] : null
    if (temp_number) {
      console.log(`Temperature set for ${gptVersion} to ${temp_number}`)
      AxiosRequestHandler(temp_number, 'set_temperature')
    } else {
      console.log('Invalid input! Please try again')
    }
  }

  /**
   * Main entry point for the users request.
   * First check if request is empty. If so, cancel further process.
   * Secondly: Check if string is only known configuration string to configure model temperature.
   * @param e event variable
   * @returns nothing
   */
  const submitHandler = async (e) => {
    // safe text from input field in variable
    window.localStorage.setItem('lastRequest', e.target[0].value)
    // Check if request empty
    if (e.target[0].value === '') {
      return e.preventDefault()
    }

    // Check if parameter has been entered correctly by user
    // TODO: Error not catched when user spells setModelsTemp slightly wrong.
    if (e.target[0].value.substring(0, 13) === 'setModelsTemp' && e.target[0].value.length === 17) {
      changeModelsTemperature(e.target[0].value)
      return e.preventDefault()
    } else if (
      e.target[0].value.substring(0, 13) === 'setModelsTemp' &&
      e.target[0].value.length !== 17
    ) {
      console.log('Invalid parameter to set temperature. Please try again!')
      return e.preventDefault()
    }
    //Axios to send and receive HTTP requests
    e.preventDefault()

    setIsResponseLoading(true)
    const return_msg = await AxiosRequestHandler(e.target[0].value, 'openai_request')
    setMessage(return_msg.data.message)
    setIsResponseLoading(false)
    //return setErrorText('error')
    return
  }

  // Invoke useEffect hook when dependencies change aka message and/or currentTitle
  useEffect(() => {
    if (!currentTitle && text && message) {
      setCurrentTitle(text)
    }

    if (currentTitle && text && message) {
      const newChat = {
        title: currentTitle,
        role: 'user',
        content: text
      }

      const responseMessage = {
        title: currentTitle,
        role: message.role,
        content: message
      }

      //setPreviousChats((prevChats) => [...prevChats, newChat, responseMessage])
      setLocalChats((prevChats) => [...prevChats, newChat, responseMessage])

      //const updatedChats = [...localChats, newChat, responseMessage]
      //localStorage.setItem('previousChats', JSON.stringify(updatedChats))
    }
  }, [message, currentTitle])

  //TODO: Finalize multiple chat window attempt
  const currentChat = (localChats || previousChats).filter(
    (prevChat) => prevChat.title === currentTitle
  )

  // Returns UI of entire app
  return (
    <div className="container">
      {/* This only shows the first time the app gets called.
          User needs to choose between two gpt versions */}
      {gptVersion == '' && <ChooseGptVersionPopup />}
      <section className={`sidebar ${isShowSidebar ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={deleteChatContent} role="button">
          <button className="sidebar-header-button">Empty Chat</button>
        </div>
        <div className="sidebar-info">
          <div className="sidebar-info-upgrade">
            <BiUser size={20} />
            <p>Upgrade plan</p>
          </div>
          <div className="sidebar-info-user">
            <BiSolidUserCircle size={20} />
            <p>User</p>
          </div>
        </div>
      </section>
      <section className="main">
        {!currentTitle && (
          <div className="empty-chat-container">
            <img src={ZeissLogo} width={100} height={100} alt={gptVersion} />
            <h1>Chat {gptVersion} Clone</h1>
            <h3>Default temperature: {modelTemp}</h3>
            <div style={{ display: 'flex' }}>
              <h3>In order to change model temperature type (i.e.)</h3>{' '}
              <p className="code">setModelsTemp=0.1</p>
            </div>
            <h3>Valid range for setting the temperature: [0.1 ... 1.0]</h3>
          </div>
        )}

        {isShowSidebar ? (
          <MdOutlineArrowRight className="burger" size={28.8} onClick={toggleSidebar} />
        ) : (
          <MdOutlineArrowLeft className="burger" size={28.8} onClick={toggleSidebar} />
        )}
        <div className="main-header">
          <ul>
            {currentChat?.map((chatMsg, idx) => {
              const isUser = chatMsg.role === 'user'

              return (
                <li key={idx} ref={scrollToLastItem}>
                  {isUser ? (
                    <div>
                      <BiSolidUserCircle size={28.8} />
                    </div>
                  ) : (
                    <div style={{ display: 'block' }}>
                      <img src={ZeissLogo} alt="ChatGPT" />
                      <RespawnUserRequest />
                      <CopyLastResponseToClipboard />
                      <CopyCodeOfLastResponseToClipboard />
                    </div>
                  )}
                  {isUser ? (
                    <div>
                      <p className="role-title">User Request</p>
                      <p>{chatMsg.content}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="role-title">{gptVersion}</p>
                      <div id="response">
                        <p className="gpt-response">{chatMsg.content}</p>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="main-bottom">
          <form className="form-container" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Send a message."
              spellCheck="false"
              value={isResponseLoading ? 'Processing...' : text}
              onChange={(e) => {
                setText(e.target.value)
              }}
              readOnly={isResponseLoading}
            />
            {!isResponseLoading && (
              <button type="submit">
                <BiSend size={20} />
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  )

  /**
   * Copyies the div's content to the users clipboard
   * @returns void
   */
  function CopyLastResponseToClipboard(): JSX.Element {
    return (
      <div
        title="copy to clipboard"
        className="refresh-request"
        id={'containerDiv'}
        onClick={() => {
          const content = document.getElementById('response')?.innerText
          // Copy the text to the clipboard
          navigator.clipboard
            .writeText(content?.trim())
            .then(() => {
              alert('Text copied to clipboard!')
            })
            .catch((err) => {
              console.error('Failed to copy text: ', err)
            })
        }}
      >
        <RxCopy />
      </div>
    )
  }

  /**
   * Copyies only the code of the div's content to the users clipboard
   * @returns void
   */
  function CopyCodeOfLastResponseToClipboard(): JSX.Element {
    return (
      <div
        title="copy only code to clipboard"
        className="refresh-request"
        id={'containerDiv'}
        onClick={() => {
          const content = document.getElementById('response')?.innerText
          console.log(content)
          // Regular expression to match content inside triple backticks
          const codeBlocks = content.match(/```(\w+)([\s\S]*?)```/g)

          // Join all found code blocks, or return an empty string if none found
          const code = codeBlocks ? codeBlocks.join('\n') : ''
          // Copy the text to the clipboard
          navigator.clipboard
            .writeText(code)
            .then(() => {
              alert('Code copied to clipboard!')
            })
            .catch((err) => {
              console.error('Failed to copy text: ', err)
            })
        }}
      >
        <RxCode />
      </div>
    )
  }

  /**
   * Uses the users last request and sends its back to the backend for another round
   * Maybe this time the output is more useful.
   * @returns void
   */
  function RespawnUserRequest(): JSX.Element {
    return (
      <div
        title="regenerate request"
        className="refresh-request"
        onClick={async () => {
          if (window.localStorage.getItem('lastRequest') !== '') {
            setIsResponseLoading(true)
            const return_msg = await AxiosRequestHandler(
              window.localStorage.getItem('lastRequest'),
              'openai_request'
            )
            setMessage(return_msg.data.message)
            setIsResponseLoading(false)
          }
        }}
      >
        <RxReload />
      </div>
    )
  }

  /**
   *
   * @returns
   */
  function ChooseGptVersionPopup(): JSX.Element {
    return (
      <div className="popup-container">
        <div className="popup-window">
          <p className="popup-p">Choose GPT Version</p>
          <button className="popup-button" onClick={chooseGpt4o}>
            GPT 4o
          </button>
          <button className="popup-button" onClick={chooseGpt4Mini}>
            GPT 4o mini
          </button>
        </div>
      </div>
    )
  }
}

export default App
