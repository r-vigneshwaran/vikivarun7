import React, { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from './fire';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import './app.css';
import Login from './components/Login';
import Home from './components/Home';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setUserRole } from './actions';

const provider = new GoogleAuthProvider();

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };
  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  };
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };
  const signIn = () => {
    clearErrors();
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        const docRef = doc(db, 'users', cred.user.uid);
        return getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            dispatch(setUserRole(docSnap.data().admin));
          }
        });
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found':
            setEmailError(err.message);
            break;
          case 'auth/wrong-password':
            setPasswordError(err.message);
            break;
          default:
            console.warn(err.message);
        }
      });
  };
  const signUp = () => {
    clearErrors();
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        const data = doc(db, `users/${cred.user.uid}`);
        const writeDoc = () => {
          const document = {
            uid: cred.user.uid,
            email: email,
            admin: false
          };
          setDoc(data, document);
          dispatch(setUserRole(false));
        };
        return writeDoc();
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            setEmailError(err.message);
            break;
          case 'auth/weak-password':
            setPasswordError(err.message);
            break;
          default:
            console.warn(err.message);
        }
      });
  };
  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('user');
        dispatch(setUser(''));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const userDetails = JSON.parse(localStorage.getItem('user'));
  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        clearInputs();
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setUser(user));
      } else {
        localStorage.removeItem('user');
        dispatch(setUser(''));
      }
    });
  };
  useEffect(() => {
    authListener();
  }, []);
  
  return (
    <div>
      {userDetails ? (
        <Home logout={logout} />
      ) : (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          signIn={signIn}
          signUp={signUp}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
          signInWithGoogle={signInWithGoogle}
        />
      )}
    </div>
  );
}

export default App;
