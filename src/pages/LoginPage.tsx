import Login from '../features/auth/components/Login'
import PopupBar from '../features/PopupBar'
import Loader from '../features/Loader'

function LoginPage(): React.JSX.Element {

  return (
    <>
      <PopupBar/>
      <Loader/>
      <Login/>
    </>
  )
}

export default LoginPage