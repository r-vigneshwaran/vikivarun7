import React from 'react';
import { Form, Col } from '@themesberg/react-bootstrap';

const FormInput = ({
  id,
  label,
  value,
  required,
  placeholder,
  ipIndex,
  type
}) => {
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={ipIndex} className="input-group">
        <Form.Label>{label}</Form.Label>
        {type === 'textarea' ? (
          <Form.Control as="textarea" value={value} required={required} />
        ) : (
          <Form.Control
            type={type}
            value={value}
            placeholder={placeholder}
            required={required}
          />
        )}
      </Form.Group>
    </Col>
  );
};
export default FormInput;
