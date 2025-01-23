import './App.css'
import {RouterProvider, createBrowserRouter, createRoutesFromElements,Route} from "react-router"
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import Layout from './pages/Layout.jsx'
// import Home from './pages/Content.jsx'
import Protected from './features/auth/components/Protected.jsx'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuthAsync,
  selectLoggedInUser,
  selectUserChecked
} from './features/auth/authSlice.js';
import Popup from './features/Popup.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* <Route path='/' element={<Layout/>}> */}
        <Route path='/' element={
          <Protected>
            <Popup/>
            <Layout/>
            {/* <Home/>  */}
          </Protected>
        }/>
      {/* </Route> */}
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
    </Route>
  )
)

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return (
    <>
      <div className="App">
        {userChecked && (
            <RouterProvider router={router} />
        )}
      </div>
    </>
  )
}

export default App
