import './App.css';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Layout from './pages/Layout';
import Protected from './features/auth/components/Protected';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks'; 
import {
  checkAuthAsync,
  // selectLoggedInUser,
  selectUserChecked
} from './features/auth/authSlice';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ErrorPage from './pages/ErrorPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route
        index
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
    </Route>
  )
);  

function App() {
  const dispatch = useAppDispatch();
  // const user = useSelector((state: RootState) => selectLoggedInUser(state));
  const userChecked = useAppSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <div className="App">
        {userChecked && <RouterProvider router={router} />}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
