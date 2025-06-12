import { Navigate } from "react-router-dom";
import { selectLoggedInUser } from '../authSlice';
import { useAppSelector } from '../../../hooks';

interface ProtectedProps {
  children: React.ReactNode;
}

function Protected({ children }: ProtectedProps): React.JSX.Element {
  const user = useAppSelector(selectLoggedInUser);

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default Protected;
