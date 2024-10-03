import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { BiPlus, BiUser, BiSend, BiSolidUserCircle } from 'react-icons/bi'
import { MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md'
import axios from 'axios'

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
    setGptVersion('gpt-4o')
  }

  const chooseGpt4Mini = (): any => {
    setGptVersion('gpt-4o-mini')
  }

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev)
  }, [])

  const checkChangeInTemperature = async (msg: string): any => {
    // Regex to match numbers
    const match = msg.match(/[-+]?[0-9]*\.?[0-9]+/)
    // Convert extracted number to floating point if possible. Otherwise, return null
    const temp_number = match ? parseFloat(match[0]) : null
    if (temp_number) {
      // Send request to backend to change temperature of model
      try {
        await axios.post('http://localhost:8000/api/set_temperature/', {
          data: temp_number
        })
        setMessage(`Sucessfully changed temperature of model ${gptVersion} to ${temp_number}`)
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 200 range
          console.log(`Error: ${error.response.data.error}`)
        } else if (error.request) {
          // Request was made but no response received
          console.log('Error: No response from server')
        } else {
          // Other errors
          console.log(`Error: ${error.message}`)
        }
      }
    } else {
      console.log('not a number')
      setMessage('Invalid input! Please try again')
      return
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
    //checkChangeInTemperature(e.target[0].value)
    //console.log(e.target[0].value)
    //Axios to send and receive HTTP requests
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:8000/api/openai_request/', {
        data: e.target[0].value
      })

      // Handle the response
      console.log(response.data.message)
      // Empty input field
      //setText('')
      setMessage(response.data.message)
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.log(`Error: ${error.response.data.error}`)
      } else if (error.request) {
        // Request was made but no response received
        console.log('Error: No response from server')
      } else {
        // Other errors
        console.log(`Error: ${error.message}`)
      }
    }
    return setErrorText('error')
    if (!text) return

    setIsResponseLoading(true)
    setErrorText('')

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: import.meta.env.VITE_AUTH_TOKEN
      },
      body: JSON.stringify({
        message: text
      })
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/completions`, options)

      if (response.status === 429) {
        return setErrorText('Too many requests, please try again later.')
      }

      const data = await response.json()

      if (data.error) {
        setErrorText(data.error.message)
        setText('')
      } else {
        setErrorText(false)
      }

      if (!data.error) {
        setErrorText('')
        setMessage(data.choices[0].message)
        setTimeout(() => {
          scrollToLastItem.current?.lastElementChild?.scrollIntoView({
            behavior: 'smooth'
          })
        }, 1)
        setTimeout(() => {
          setText('')
        }, 2)
      }
    } catch (e) {
      setErrorText(e.message)
      console.error(e)
    } finally {
      setIsResponseLoading(false)
    }
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

  //useEffect(() => {
  //  const storedChats = localStorage.getItem('previousChats')
  //  if (storedChats) {
  //    setLocalChats(JSON.parse(storedChats))
  //  }
  //}, [])

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

  /*const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title).reverse())
  )*/

  /*const localUniqueTitles = Array.from(
    new Set(localChats.map((prevChat) => prevChat.title).reverse())
  ).filter((title) => !uniqueTitles.includes(title))
  */

  return (
    <div className="container">
      {/* This only shows the first time the app gets called.
          User needs to choose between two gpt versions */}
      {gptVersion == '' && <ChooseGptVersion />}
      <section className={`sidebar ${isShowSidebar ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={deleteChatContent} role="button">
          <button className="sidebar-header-button">Empty Chat</button>
        </div>
        {/*<div className="sidebar-history">
            {uniqueTitles.length > 0 && previousChats.length !== 0 && (
              <>
                <p>Ongoing</p>
                <ul>
                  {uniqueTitles?.map((uniqueTitle, idx) => {
                    const listItems = document.querySelectorAll('li')

                    listItems.forEach((item) => {
                      if (item.scrollWidth > item.clientWidth) {
                        item.classList.add('li-overflow-shadow')
                      }
                    })
                    return (
                      <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                        {uniqueTitle}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
            {localUniqueTitles.length > 0 && localChats.length !== 0 && (
              <>
                <p>Previous</p>
                <ul>
                  {localUniqueTitles?.map((uniqueTitle, idx) => {
                    const listItems = document.querySelectorAll('li')

                    listItems.forEach((item) => {
                      if (item.scrollWidth > item.clientWidth) {
                        item.classList.add('li-overflow-shadow')
                      }
                    })

                    return (
                      <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                        {uniqueTitle}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>*/}
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
            <h3>In order to change model temperature type (i.e.): temp=0.1</h3>
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

  function ChooseGptVersion(): JSX.Element {
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

  /**
   * SideBarNotUsable
   * Method returns html code for the main windows sidebar
   * Currently, no functional code implemented.
   * @returns JSX.Element
   */
  function SideBarNotUsable(): JSX.Element {
    return (
      <>
        <section className={`sidebar ${isShowSidebar ? 'open' : ''}`}>
          <div className="sidebar-header" onClick={deleteChatContent} role="button">
            <BiPlus size={20} />
            <button className="sidebar-header-button">New Chat</button>
          </div>
          {/*<div className="sidebar-history">
            {uniqueTitles.length > 0 && previousChats.length !== 0 && (
              <>
                <p>Ongoing</p>
                <ul>
                  {uniqueTitles?.map((uniqueTitle, idx) => {
                    const listItems = document.querySelectorAll('li')

                    listItems.forEach((item) => {
                      if (item.scrollWidth > item.clientWidth) {
                        item.classList.add('li-overflow-shadow')
                      }
                    })
                    return (
                      <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                        {uniqueTitle}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
            {localUniqueTitles.length > 0 && localChats.length !== 0 && (
              <>
                <p>Previous</p>
                <ul>
                  {localUniqueTitles?.map((uniqueTitle, idx) => {
                    const listItems = document.querySelectorAll('li')

                    listItems.forEach((item) => {
                      if (item.scrollWidth > item.clientWidth) {
                        item.classList.add('li-overflow-shadow')
                      }
                    })

                    return (
                      <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                        {uniqueTitle}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>*/}
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
      </>
    )
  }

  /**
   * MainChatWindow
   * Method returns code to be able to interact with ChatGPT API
   * Text field to send message to API and a field to display
   * it's response.
   * @returns JSX.Element
   */
  function MainChatWindow(): JSX.Element {
    return (
      <>
        <section className="main">
          {!currentTitle && (
            <div className="empty-chat-container">
              <img src={ZeissLogo} width={45} height={45} alt="ChatGPT" />
              <h1>Chat GPT 4o (mini) Clone</h1>
              <h3>How can I help you today?</h3>
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
                        <p className="role-title">You</p>
                        <p>{chatMsg.content}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="role-title">ChatGPT</p>
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
      </>
    )
  }
}

export default App
