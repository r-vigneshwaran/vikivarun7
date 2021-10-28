import React, { useState } from 'react';

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  signIn,
  signUp,
  hasAccount,
  setHasAccount,
  emailError,
  passwordError,
  signInWithGoogle
}) => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  return (
    <section className="login">
      <span onClick={() => setIsAdminLogin(!isAdminLogin)}>Admin Login</span>
      {isAdminLogin ? (
        <div className="loginContainer">
          <label style={{ textAlign: 'center' }}>Admin Login</label>
          <label htmlFor="">Username</label>
          <input
            type="text"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p>{emailError}</p>}
          <label htmlFor="">Password</label>
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p>{passwordError}</p>}
          <div className="btnContainer">
            <button className="btn-primary" onClick={signIn}>
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="loginContainer">
          <label style={{ textAlign: 'center' }}>User Login</label>
          <label htmlFor="">Username</label>
          <input
            type="text"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p>{emailError}</p>}
          <label htmlFor="">Password</label>
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p>{passwordError}</p>}
          <div className="btnContainer">
            {hasAccount ? (
              <>
                <button className="btn-primary" onClick={signIn}>
                  Login
                </button>
                <p>
                  Don't have an Account
                  <span onClick={() => setHasAccount(!hasAccount)}>
                    Sign Up
                  </span>
                </p>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={signUp}>
                  Register
                </button>
                <p>
                  Already have an Account{' '}
                  <span onClick={() => setHasAccount(!hasAccount)}>
                    Sign In
                  </span>
                </p>
              </>
            )}
          </div>
          <button className="btn-google" onClick={signInWithGoogle}>
            Sign {hasAccount ? 'In' : 'Up'} with Google
          </button>
        </div>
      )}
    </section>
  );
};

export default Login;
