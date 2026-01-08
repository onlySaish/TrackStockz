import './App.css';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Layout from './pages/Layout';
import Protected from './features/auth/components/Protected';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks'; 
import {
  checkAuthAsync,
  // selectLoggedInUser,
  selectUserChecked
} from './features/auth/authSlice';
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
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/forgotpassword" element={<AuthPage />} />
      <Route path="/resetpassword/:token" element={<AuthPage />} />
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
