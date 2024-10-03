import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { BiUser, BiSend, BiSolidUserCircle } from 'react-icons/bi'
import { MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md'
//import axios from 'axios'

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
  const [errorText, setErrorText] = useState('')
  const [isShowSidebar, setIsShowSidebar] = useState(false)
  const scrollToLastItem = useRef(null)

  const deleteChatContent = (): void => {
    setMessage('')
    setText('')
    setCurrentTitle('')
  }

  /*const backToHistoryPrompt = (uniqueTitle): void => {
    setCurrentTitle(uniqueTitle)
    setMessage('')
    setText('')
  }*/

  const chooseGpt4o = (): any => {
    AxiosRequestHandler('gpt-4o', 'set_model')
    setGptVersion('gpt-4o')
  }

  const chooseGpt4Mini = (): any => {
    AxiosRequestHandler('gpt-4o-mini', 'set_model')
    setGptVersion('gpt-4o-mini')
  }

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev)
  }, [])

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

  // Main entry point for the users request.
  // First check if request empty. If so, cancel further process
  // Secondly: check if string is only known configuration string to configure model temperature
  // If first and second do not apply proceed with openai api request
  const submitHandler = async (e) => {
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

  useLayoutEffect(() => {
    const handleResize = (): void => {
      setIsShowSidebar(window.innerWidth <= 640)
    }
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const currentChat = (localChats || previousChats).filter(
    (prevChat) => prevChat.title === currentTitle
  )

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
                    <img src={ZeissLogo} alt="ChatGPT" />
                  )}
                  {isUser ? (
                    <div>
                      <p className="role-title">User Request</p>
                      <p>{chatMsg.content}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="role-title">{gptVersion}</p>
                      <p>{chatMsg.content}</p>
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
              onChange={(e) => setText(e.target.value)}
              readOnly={isResponseLoading}
            />
            {!isResponseLoading && (
              <button type="submit">
                <BiSend size={20} />
              </button>
            )}
          </form>
          <p>This clone does not actually represent the full functionality of ChatGpt.</p>
        </div>
      </section>
    </div>
  )

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
