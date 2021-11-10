import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from 'fire';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { notification } from 'antd';
import { setForms, setNotification, setUser, setUserRole } from 'actions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLoading } from 'actions';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();

  const { show, message, title } = useSelector((state) => state.notification);
  const loading = useSelector((state) => state.loading);

  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState();

  const batch = writeBatch(db);

  const openNotification = (title, message) => {
    notification.open({
      message: title,
      description: message,
      duration: 5,
      onClose: () => dispatch(setNotification(false, '', 'Notification'))
    });
  };

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (cred) => {
        const userDetailsRef = doc(db, cred.user.email, 'user-details');
        const document = {
          uid: cred.user.uid,
          email: email,
          admin: false
        };
        batch.set(userDetailsRef, document);
        const formRef = doc(db, cred.user.email, 'forms');
        const formData = { formsCount: 0 };
        batch.set(formRef, formData);
        batch
          .commit()
          .then(() => {
            dispatch(setUser(document));
            dispatch(setForms(formData));
          })
          .catch((err) => {
            console.warn('error occured', err);
          });
      }
    );
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        getDocs(collection(db, email)).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id === 'forms') {
              dispatch(setForms(doc.data()));
            } else if (doc.id === 'user-details') {
              dispatch(setUser(doc.data()));
            }
            // doc.id === 'forms' && dispatch(setForms(doc.data()));
            // doc.id === 'user-details' && dispatch(setUser(doc.data()));
          });
        });
      })
      .catch((err) => {});
  };

  const logOut = () => {
    return signOut(auth);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, provider).then((cred) => {
      const userDetailsRef = doc(db, cred.user.email, 'user-details');
      const document = {
        uid: cred.user.uid,
        email: cred.user.email,
        admin: false
      };
      batch.set(userDetailsRef, document);
      const formRef = doc(db, cred.user.email, 'forms');
      const formData = { formsCount: 0 };
      batch.set(formRef, formData);
      batch
        .commit()
        .then(() => {
          dispatch(setUser(document));
          dispatch(setForms(formData));
        })
        .catch((err) => {
          console.warn('error occured', err);
        });
    });
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin) {
          console.log('Hi Admin');
          setIsAdmin(true);
        } else {
          console.log('Hi Normal User');
          setIsAdmin(false);
        }
      }
      dispatch(setLoading(false)); // this line is saving the whole application and grinding my head for long time
    });
    return unSubscribe;
  }, []);

  useEffect(() => {
    if (show) {
      openNotification(title, message);
    }
  }, [message, show, title]);

  // useEffect(() => {
  //   if (currentUser) {
  //     getUserRole();
  //   }
  // }, [currentUser]);

  // async function getUserRole() {
  //   const res = await getAuth().currentUser.getIdTokenResult();
  //   setIsAdmin(res.claims.admin);
  // }

  const value = {
    currentUser,
    signUp,
    signIn,
    logOut,
    signInWithGoogle,
    isAdmin
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
