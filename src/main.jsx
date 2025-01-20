import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider, createBrowserRouter, createRoutesFromElements,Route} from "react-router"
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import Layout from './pages/Layout.jsx'
import Home from './pages/Home.jsx'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import Protected from './features/auth/components/Protected.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </StrictMode>,
)
