import { useAuth } from 'AuthContext';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, logOut } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <section className="hero">
            <nav>
              <h2>Welcome {currentUser.email}</h2>
              <button onClick={logOut}>Logout</button>
            </nav>
            <Component {...props} />
          </section>
        ) : (
          <Redirect to="/authentication" />
        );
      }}
    ></Route>
  );
}
export function AdminRoute({ component: Component, ...rest }) {
  const { currentUser, admin } = useAuth();
  console.log(admin);
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser && admin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    ></Route>
  );
}
