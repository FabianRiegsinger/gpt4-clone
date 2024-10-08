import { useState, useEffect, useRef } from 'react'
import { BiUser, BiSend, BiSolidUserCircle } from 'react-icons/bi'
import { RxReload, RxCopy, RxCode } from 'react-icons/rx'
import ReactMarkdown from 'react-markdown'

import { AxiosRequestHandler } from './components/AxiosRequestHandler'
import ZeissLogo from '../../../resources/zeiss-logo.png'

/**
 * @function App
 * @param {empty}
 * @returns {ReactNode} Renders entire app code
 */
function App(): JSX.Element {
  const [text, setText] = useState('')
  const [gptVersion, setGptVersion] = useState('')
  const [modelTemp] = useState(1.0)
  const [message, setMessage] = useState('') // was null before
  const [localChats, setLocalChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState('') // was null before
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const scrollToLastItem = useRef(null)

  /**
   * @function deleteChatContent
   * @param {empty}
   * @return {empty} Deletes content of chat window. Basically resets everything
   */
  const deleteChatContent = (): void => {
    setMessage('')
    setText('')
    window.localStorage.setItem('lastRequest', '')
    setCurrentTitle('')
    setLocalChats([])
  }

  /**
   * @function chooseGpt4o
   * @param {empty}
   * @return {empty} function which gets called when gpt-4o button got pressed at the beginning.
   *                 Uses Rest API to set gpt model type to gpt-4o.
   */
  const chooseGpt4o = (): any => {
    const retMsg = AxiosRequestHandler('gpt-4o', 'set_model')
    retMsg.then((result: string) => {
      console.log(result)
      if (result.includes('Error')) {
        alert('Please start backend. Not running!')
      } else {
        setGptVersion('gpt-4o')
      }
    })
  }

  /**
   * @function chooseGpt4Mini
   * @param {empty}
   * @return {empty} Function which gets called when gpt-4o button got pressed at the beginning.
   *                 Uses Rest API to set gpt model type to gpt-4o-mini
   */
  const chooseGpt4Mini = (): any => {
    const retMsg = AxiosRequestHandler('gpt-4o-mini', 'set_model')
    retMsg.then((result: string) => {
      if (result.includes('Error')) {
        alert('Please start backend. Not running!')
      } else {
        setGptVersion('gpt-4o')
      }
    })
  }

  /**
   * @function changeModelsTemperature
   * @param {string} msg Specific message for changing the temperature of the model (i.e. setModelsTemp=0.2)
   * @return {empty} Asynchronous function which checks if the users input is correct and uses the
   *                 REST API to set the models temperature to the users desired value.
   */
  async function changeModelsTemperature(msg: string): Promise<string> {
    // Regex to match numbers
    const match = msg.match(/[-+]?[0-9]*\.?[0-9]+/)
    // Convert extracted number to floating point if possible. Otherwise, return null
    const temp_number = match ? match[0] : null
    if (temp_number) {
      console.log(`Temperature set for ${gptVersion} to ${temp_number}`)
      const return_msg = await AxiosRequestHandler(temp_number, 'set_temperature')
      // display message to user
      setMessage(return_msg)
    } else {
      console.log('Invalid input! Please try again')
    }
  }

  /**
   * @function submitUserRequest
   * @param {any} e event type
   * @return {empty} Main entry point for the users request.
   *                 First check if request is empty. If so, cancel further process.
   *                 Secondly: Check if string is only known configuration string to configure model temperature.
   */
  const submitUserRequest = async (e) => {
    // safe text from input field in local browser storage
    window.localStorage.setItem('lastRequest', e.target[0].value)

    // Check if the word markdown has been used in the users request.
    e.target[0].value.toLowerCase().includes('markdown')
      ? window.localStorage.setItem('renderMarkdown', 'true')
      : window.localStorage.setItem('renderMarkdown', 'false')

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

    // Trigger loading/processing text in input field
    setIsResponseLoading(true)

    // Send request to openai api
    const return_msg = await AxiosRequestHandler(e.target[0].value, 'openai_request')

    // display message to user
    setMessage(return_msg)

    // Stop loading/processing text in input field
    setIsResponseLoading(false)
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

      if (scrollToLastItem.current) {
        scrollToLastItem.current.scrollTop = scrollToLastItem.current.scrollHeight // Scroll to the bottom
      }
    }
  }, [message, currentTitle])

  //TODO: Finalize multiple chat window attempt
  const currentChat = localChats.filter((prevChat) => prevChat.title === currentTitle)

  // Returns UI of entire app
  return (
    <div className="container">
      {/* Only shown once at startup to let user choose between gpt versions*/}
      {gptVersion == '' && <ChooseGptVersionPopup />}
      {/* Sidebar content */}
      <SideBar />
      <section className="main">
        <EmptyChatInfo />
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
                      <div>
                        <RenderOrNotToRenderMarkdown text={chatMsg.content} />
                        <div className="copy-options">
                          <RespawnUserRequest />
                          <CopyLastResponseToClipboard text={chatMsg.content} />
                          <CopyCodeOfLastResponseToClipboard text={chatMsg.content} />
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="main-bottom">
          <form className="form-container" onSubmit={submitUserRequest}>
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
   * @function CopyLastResponseToClipboard
   * @param {empty}
   * @returns {ReactNode} Renders a button in the chat response window so that the user may copy
   *                      the div's entire content to the users clipboard
   */
  function CopyLastResponseToClipboard(text): JSX.Element {
    return (
      <div
        title="copy entire response to clipboard"
        className="refresh-request"
        id={'containerDiv'}
        onClick={() => {
          // Copy the text to the clipboard
          navigator.clipboard
            .writeText(text.text?.trim())
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
   * @function CopyCodeOfLastResponseToClipboard
   * @param {empty}
   * @returns {ReactNode} Renders a button in the chat response window so that the user may copy
   *                      only the code of the div's content to the users clipboard
   */
  function CopyCodeOfLastResponseToClipboard(text): JSX.Element {
    return (
      <div
        title="copy only code to clipboard"
        className="refresh-request"
        id={'containerDiv'}
        onClick={() => {
          // Regular expression to match content inside triple backticks
          const codeBlocks = text.text.match(/```(\w+)([\s\S]*?)```/g)

          // Join all found code blocks, or return an empty string if none found
          const code = codeBlocks ? codeBlocks.join('\n') : ''

          // Regex to match lines that start with three backticks
          // Replace all lines that start with three backticks
          const onlyCode = code.replace(/^```.*$/gm, '')
          // Copy the text to the clipboard
          navigator.clipboard
            .writeText(onlyCode.replace(/^\s*[\r\n]+/gm, ''))
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
   * @function RespawnUserRequest
   * @param {empty}
   * @returns {ReactNode} Renders a button in the chat response window so that the user may re-send
   *                      the last request to the backend for recalculation
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
   * @function ChooseGptVersionPopup
   * @param {empty}
   * @returns {ReactNode} Renders popup at app startup to let the user choose between two gpt verrsions
   */
  function ChooseGptVersionPopup(): JSX.Element {
    return (
      <div className="popup-container">
        <div className="popup-window">
          <p className="popup-p">Choose GPT Version:</p>
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

  /**
   * @function SideBar
   * @param {empty}
   * @returns {ReactNode} Renders sidebar content
   */
  function SideBar(): JSX.Element {
    return (
      <section className={'sidebar'}>
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
    )
  }

  /**
   * @function EmptyChatInfo
   * @param {empty}
   * @returns {ReactNode} React element which displays text on the chat window for further infomation
   */
  function EmptyChatInfo(): JSX.Element {
    return (
      <>
        {!currentTitle && (
          <div className="empty-chat-container">
            <img src={ZeissLogo} width={100} height={100} alt={gptVersion} />
            <h1>Chat {gptVersion} Clone</h1>
            <h3>Default temperature: {modelTemp.toFixed(1)}</h3>
            <div style={{ display: 'flex' }}>
              <h3>In order to change model temperature, type (i.e.): </h3>{' '}
              <p className="code">setModelsTemp=0.1</p>
            </div>
            <h3>Valid range for setting the temperature: [0.1 ... 1.0]</h3>
          </div>
        )}
      </>
    )
  }

  /**
   * @function RenderOrNotToRenderMarkdown
   * @param {text}
   * @returns {ReactNode} Depending on boolean 'renderMarkdown' either normal text gets rendered, or Markodown style
   */
  function RenderOrNotToRenderMarkdown(text): JSX.Element {
    const renderMarkdown = window.localStorage.getItem('renderMarkdown')
    if (renderMarkdown) {
      return <ReactMarkdown>{text.text}</ReactMarkdown>
    }
    return <p className="gpt-response">{text.text}</p>
  }
}

export default App
