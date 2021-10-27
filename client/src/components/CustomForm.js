import React, { useCallback } from 'react';
import { Form, Row } from '@themesberg/react-bootstrap';
import FormInput from '../components/inputs/TextInput/TextInput';
import FormSelect from '../components/inputs/Select/Select';
import FormCheckbox from './inputs/Checkbox/Checkbox';
const CustomForm = ({ config, handleSubmit }) => {
  const FormElement = useCallback(
    ({
      element: {
        type,
        id,
        label,
        placeholder,
        value,
        options,
        required,
        validation,
        warningText,
        selectedValues,
        displayValue,
        showCheckbox
      }
    }) => {
      switch (type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
        case 'password':
          return (
            <FormInput
              id={id}
              label={label}
              value={value}
              type={type}
              required={required}
              placeholder={placeholder}
              validation={validation}
              warningText={warningText}
            />
          );
        case 'select':
          return (
            <FormSelect id={id} label={label} value={value} options={options} />
          );
        case 'checkbox':
          return (
            <FormCheckbox
              id={id}
              label={label}
              value={value}
              options={options}
            />
          );

        default:
          return null;
      }
    },
    []
  );

  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit}>
        <Row className="row-cols-sm-3 row-cols-md-3 row-cols-lg-4">
          {config.map((element) => (
            <FormElement key={element.id} element={element} />
          ))}
        </Row>
        <button type="submit"> submit</button>
      </Form>
    </React.Fragment>
  );
};

export default CustomForm;
