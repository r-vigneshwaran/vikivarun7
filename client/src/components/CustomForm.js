import React, { useCallback } from 'react';
import { Form, Row } from '@themesberg/react-bootstrap';
import FormInput from '../components/inputs/TextInput/TextInput';
import FormSelect from '../components/inputs/Select/Select';
import FormCheckbox from './inputs/Checkbox/Checkbox';
import { Button } from 'antd';
import { db } from 'fire';
import { useAuth } from 'AuthContext';
import moment from 'moment';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc
} from '@firebase/firestore';

const CustomForm = ({ config, handleClickBack, formName }) => {
  const { currentUser } = useAuth();
  const FormElement = useCallback(
    ({
      element: {
        type,
        id,
        label,
        placeholder,
        options,
        required,
        validation,
        warningText,
        ipIndex
      }
    }) => {
      switch (type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
        case 'password':
        case 'textarea':
          return (
            <FormInput
              id={id}
              label={label}
              type={type}
              required={required}
              placeholder={placeholder}
              validation={validation}
              warningText={warningText}
              ipIndex={ipIndex}
            />
          );
        case 'select':
          return (
            <FormSelect
              id={id}
              label={label}
              options={options}
              ipIndex={ipIndex}
            />
          );
        case 'checkbox':
        case 'radio':
          return (
            <FormCheckbox
              type={type}
              id={id}
              label={label}
              options={options}
              ipIndex={ipIndex}
            />
          );

        default:
          return null;
      }
    },
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    Object.keys(e.target.elements).forEach((item) => {
      if (isNaN(item)) {
        if (item.split(' ')[0] === 'checkbox') {
          const selected = [];
          Object.keys(e.target.elements[item]).forEach((opt) => {
            e.target.elements[item][opt].checked &&
              selected.push(e.target.elements[item][opt].value);
          });
          data[item.split(' ')[1]] = selected;
        } else {
          if (e.target.elements[item].type !== 'checkbox')
            data[item] = e.target.elements[item].value;
        }
      }
    });
    const newFinalData = {
      [formName]: {
        ...data,

        submittedUser: currentUser.email,
        date: moment().format('DD MM YYYY')
      }
    };
    await setDoc(doc(db, 'admin@admin.com', 'forms'), newFinalData);

    // console.log(newFinalData);
    // const formRef = doc(db, 'admin@admin.com', 'forms');
    // await updateDoc(formRef, newFinalData);
  };
  const handleReset = () => {
    document.getElementById('dynamic-form').reset();
  };
  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit} id="dynamic-form">
        <Row className="row-cols-sm-3 row-cols-md-3 row-cols-lg-4">
          {config.map((element, index) => (
            <FormElement key={index} element={element} />
          ))}
        </Row>
        <div className="formBtnContainer">
          <Button value="btn" htmlType="primary" type="primary">
            submit
          </Button>
          <Button
            value="btn"
            onClick={handleReset}
            style={{ color: '#fff' }}
            type="ghost"
          >
            Reset
          </Button>
          <Button value="btn" type="primary" danger onClick={handleClickBack}>
            Cancel
          </Button>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default CustomForm;
