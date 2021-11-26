import { useAuth } from 'AuthContext';
import React, { useState, useEffect } from 'react';
import { setNotification } from 'actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Input } from 'antd';
const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const { signUp, logOut, signIn, currentUser, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (currentUser) {
      return history.push('/');
    }
  }, [currentUser, history]);

  const handleSumbitUserLogin = async (e) => {
    e.preventDefault();
    if (!password || !email) return;
    if (!hasAccount && password !== confirmPassword)
      return setError('password should match with confirm password');
    if (!hasAccount) {
      // register
      setError('');
      try {
        setError('');
        setLoading(true);
        await signUp(email, password);
        history.push('/');
      } catch (err) {
        dispatch(setNotification(true, err.message, 'Registration Failed'));
      }
      setLoading(false);
    } else {
      // login
      setError('');
      try {
        setError('');
        setLoading(true);
        await signIn(email, password);
        history.push('/');
      } catch (err) {
        dispatch(setNotification(true, err.message, 'Login Failed'));
      }
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      history.push('/');
    } catch (err) {
      dispatch(
        setNotification(true, err.message, 'Google Authentication Failed')
      );
    }
  };
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      dispatch(setNotification(true, err.message, 'Logout Failed'));
    }
  };
  return (
    <section className="login">
      <span className="pointer toggler" onClick={handleLogout}>
        Admin Login <br /> username : admin@admin.com
        <br /> password: admin@123
      </span>
      <form onSubmit={handleSumbitUserLogin} className="loginContainer">
        <label style={{ textAlign: 'center' }}>User Login</label>
        <label htmlFor="">Username</label>
        <Input
          type="text"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="">Password</label>
        <Input.Password
          type="password"
          autoFocus
          required
          value={password}
          color="#000"
          className="pass"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <span className="white">{error}</span>}
        {!hasAccount && (
          <>
            {' '}
            <label htmlFor="">Confirm Password</label>
            <Input.Password
              type="password"
              autoFocus
              required
              value={confirmPassword}
              color="#000"
              visibilityToggle={false}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />{' '}
          </>
        )}
        <div className="btnContainer">
          {hasAccount ? (
            <>
              <button className="btn-primary-custom">Login</button>
              <p>
                Don't have an Account
                <span onClick={() => setHasAccount(!hasAccount)}>Sign Up</span>
              </p>
            </>
          ) : (
            <>
              <button className="btn-primary-custom">Register</button>
              <p>
                Already have an Account{' '}
                <span onClick={() => setHasAccount(!hasAccount)}>Sign In</span>
              </p>
            </>
          )}
        </div>
        <button
          onClick={handleGoogleAuth}
          className="btn-primary-custom btn-google"
        >
          Sign {hasAccount ? 'In' : 'Up'} with Google
        </button>
      </form>
    </section>
  );
};

export default Login;
