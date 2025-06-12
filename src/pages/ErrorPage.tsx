import { useRouteError } from 'react-router-dom';

interface RouteError {
  statusText?: string;
  message?: string;
}

const ErrorPage = () => {
  const error = useRouteError() as RouteError;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops!</h1>
      <p>Sorry, an error occurred</p>
      <pre>{error.statusText || error.message || 'Unknown Error'}</pre>
    </div>
  );
};

export default ErrorPage;
