import { doc, getDoc } from '@firebase/firestore';
import { db } from 'fire';
import { actionTypes } from '../constants';

const {
  SET_USER_DATA,
  SET_USER_ROLE,
  SET_NOTIFICATION,
  SET_LOADING,
  SET_FORMS,
  SET_FORM_DATA
} = actionTypes;

export const setUser = (payload) => ({ type: SET_USER_DATA, payload });

export const setLoading = (payload) => ({ type: SET_LOADING, payload });

export const setUserRole = (payload) => ({ type: SET_USER_ROLE, payload });

export const setForms = (payload) => ({ type: SET_FORMS, payload });

export const setNotification = (show, message, title) => ({
  type: SET_NOTIFICATION,
  payload: {
    show,
    message,
    title
  }
});

export const getForm = (email) => async (dispatch) => {
  const docRef = doc(db, `${email}/forms`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    dispatch({ type: SET_FORM_DATA, payload: docSnap.data() });
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
};
