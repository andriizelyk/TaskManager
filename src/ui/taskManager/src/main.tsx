import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <GoogleOAuthProvider clientId={'436450483464-h3i7rdk8h4ndlfg861sougtfshltvu67.apps.googleusercontent.com'} >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
)
