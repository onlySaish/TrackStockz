import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider, createBrowserRouter, createRoutesFromElements,Route} from "react-router"
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
