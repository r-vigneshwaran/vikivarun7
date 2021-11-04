import { doc, getDoc } from '@firebase/firestore';
import { Col, Row } from 'antd';
import { db } from 'fire';
import { actionTypes } from '../constants';
import axios from 'axios';
const {
  SET_USER_DATA,
  SET_USER_ROLE,
  SET_NOTIFICATION,
  SET_LOADING,
  SET_FORMS,
  SET_FORM_DATA,
  SET_FORM_FEEDBACK
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
  }
};

export const setFormFeedback = (record, history) => async (dispatch) => {
  const adminFeedbackRef = doc(db, 'admin@admin.com', 'feedback');
  const docSnap = await getDoc(adminFeedbackRef);
  if (docSnap.exists()) {
    const document = docSnap.data()[record.formName];
    let fields = [];
    fields.push({
      id: 0,
      title: 'Submitted User & Date-time',
      dataIndex: 'submittedUser',
      key: 'submittedUser',
      render: (text, row) => (
        <Col>
          <Row>{text}</Row>
          <Row>{row.date}</Row>
        </Col>
      )
    });
    record.dyanmicFormData.forEach((item) => {
      fields.push({
        id: item.id,
        title: item.fieldName,
        dataIndex: item.fieldName,
        key: item.fieldName
      });
    });
    dispatch({
      type: SET_FORM_FEEDBACK,
      payload: { config: fields, data: document }
    });
    history.push(`/form/${record.key}`);
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
};

export const setAdmin = (uid) => async (dispatch) => {
  const data = { uid };
  axios
    .post('http://localhost:5000/set-admin', data)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
