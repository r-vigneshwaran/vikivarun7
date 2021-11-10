import { doc, getDoc, deleteDoc } from '@firebase/firestore';
import { Col, Row } from 'antd';
import { db } from 'fire';
import { actionTypes } from '../constants';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { mapKeyToArray } from 'utility';
const {
  SET_USER_DATA,
  SET_USER_ROLE,
  SET_NOTIFICATION,
  SET_LOADING,
  SET_FORMS,
  SET_FORM_DATA,
  SET_FORM_FEEDBACK,
  SET_NO_FORM_AVAILABLE
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

export const getForm =
  (email, admin = false) =>
  async (dispatch) => {
    const docRef = doc(db, `admin@admin.com/forms`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (admin) {
        const forms = mapKeyToArray(docSnap.data().forms);
        dispatch({
          type: SET_FORM_DATA,
          payload: forms
        });
      } else {
        const res = [];
        const forms = mapKeyToArray(docSnap.data().forms);
        forms.forEach((key) => {
          if (key.accessibleUsers.includes(email)) res.push(key);
        });
        dispatch({ type: SET_FORM_DATA, payload: res });
        if (docSnap.data().forms.length === 0) {
          dispatch({ type: SET_NO_FORM_AVAILABLE, payload: true });
        }
      }
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
export const sendMail = (from, to, record) => async (dispatch) => {
  const templateParams = {
    to_name: to.split('@')[0],
    from_name: from.split('@')[0],
    message: JSON.stringify(record, null, 10),
    to_address: to
  };
  emailjs
    .send(
      'service_bqtmt23',
      'template_2s90qms',
      templateParams,
      'user_ULq5jdtayYaWPj34ZQVUc'
    )
    .then(
      function (response) {
        dispatch({
          type: SET_NOTIFICATION,
          payload: {
            show: true,
            message: `Email Send Successfully to ${to}`,
            title: 'Success'
          }
        });
      },
      function (error) {
        dispatch({
          type: SET_NOTIFICATION,
          payload: {
            show: true,
            message: `Email not send to ${to} `,
            title: 'Failure'
          }
        });
      }
    );
};
const deleteForm = (col, doc) => async (dispatch) => {
  const docRef = doc(db, col, doc);
  await deleteDoc(docRef);
};
