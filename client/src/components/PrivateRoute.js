import { getAuth } from '@firebase/auth';
import { useAuth } from 'AuthContext';
import React, { useEffect, useState } from 'react';
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
              <h2>Welcome {currentUser.email.split('@')[0]}</h2>
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
  const { currentUser, logOut, isAdmin } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser && isAdmin ? (
          <section className="hero">
            <nav>
              <h2>Welcome {currentUser.email.split('@')[0]}</h2>
              <button>Admin Dashboard</button>
              <button onClick={logOut}>Logout</button>
            </nav>
            <Component {...props} />
          </section>
        ) : (
          <Redirect to="/" />
        );
      }}
    ></Route>
  );
}
