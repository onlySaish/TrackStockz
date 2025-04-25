// pages/ErrorPage.jsx
import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops!</h1>
      <p>Sorry, an error occurred</p>
      <pre>{error.statusText || error.message}</pre>
    </div>
  );
};

export default ErrorPage;
