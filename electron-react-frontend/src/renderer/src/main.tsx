import './assets/main.css'
import './assets/popup.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // StrictMode double renders double renders app
  // This makes it easier to detect bugs in the code earliere hidden
  // in rendering loops or similar
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
