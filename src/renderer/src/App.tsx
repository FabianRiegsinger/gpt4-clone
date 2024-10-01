import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { BiPlus, BiUser, BiSend, BiSolidUserCircle } from 'react-icons/bi'
import { MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md'

import ZeissLogo from '../../../resources/zeiss-logo.png'

/**
 * Parent APP
 * @returns all the code
 */
function App(): JSX.Element {
  /*const [text, setText] = useState('')
  const [message, setMessage] = useState<string>('')
  const [previousChats, setPreviousChats] = useState<[]>([])
  const [localChats, setLocalChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState<string>('')
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [isShowSidebar, setIsShowSidebar] = useState(false)
  const scrollToLastItem = useRef(null)
*/
  const [text, setText] = useState('')
  const [gptVersion, setGptVersion] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [localChats, setLocalChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [isShowSidebar, setIsShowSidebar] = useState(false)
  const scrollToLastItem = useRef(null)

  const createNewChat = (): void => {
    setMessage(null)
    setText('')
    setCurrentTitle(null)
  }

  /*const backToHistoryPrompt = (uniqueTitle): void => {
    setCurrentTitle(uniqueTitle)
    setMessage('')
    setText('')
  }*/

  const chooseVersion1 = (): any => {
    setGptVersion('GPT 4o')
  }

  const chooseVersion2 = (): any => {
    setGptVersion('GPT 4o mini')
  }

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev)
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    return setErrorText('My billing plan is gone because of many requests.')
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

  useEffect(() => {
    const storedChats = localStorage.getItem('previousChats')

    if (storedChats) {
      setLocalChats(JSON.parse(storedChats))
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
        content: message.content
      }

      setPreviousChats((prevChats) => [...prevChats, newChat, responseMessage])
      setLocalChats((prevChats) => [...prevChats, newChat, responseMessage])

      const updatedChats = [...localChats, newChat, responseMessage]
      localStorage.setItem('previousChats', JSON.stringify(updatedChats))
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
      {gptVersion == '' && <ChooseGptVersion />}
      <section className={`sidebar ${isShowSidebar ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={createNewChat} role="button">
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
      <section className="main">
        {!currentTitle && (
          <div className="empty-chat-container">
            <img src={ZeissLogo} width={45} height={45} alt="ChatGPT" />
            <h1>Chat {gptVersion} Clone</h1>
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
    </div>
  )

  function ChooseGptVersion(): JSX.Element {
    return (
      <div className="popup-container">
        <div className="popup-window">
          <p className="popup-p">Choose GPT Version</p>
          <button className="popup-button" onClick={chooseVersion1}>
            GPT 4o
          </button>
          <button className="popup-button" onClick={chooseVersion2}>
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
          <div className="sidebar-header" onClick={createNewChat} role="button">
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
