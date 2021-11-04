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
  const { currentUser } = useAuth();
  const [loader, setLoader] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getUserRole();
  }, []);

  async function getUserRole() {
    const res = await getAuth().currentUser.getIdTokenResult();
    setIsAdmin(res.claims.admin);
    setLoader(false);
  }

  if (!loader) {
    return (
      <Route
        {...rest}
        render={(props) => {
          return currentUser && isAdmin ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          );
        }}
      ></Route>
    );
  } else {
    return <>Loading</>;
  }
}
