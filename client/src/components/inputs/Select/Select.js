import React from 'react';
import { Form, Col } from '@themesberg/react-bootstrap';

const FormSelect = ({ id, label, required, options, ipIndex }) => {
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={ipIndex} className="input-group">
        <Form.Label> {label}</Form.Label>
        <Form.Control as="select" required={required}>
          <option value="" hidden>
            Select One
          </option>
          {options.length > 0 &&
            options.map(({ id, value, label }) => (
              <option key={id} value={value}>
                {label}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
    </Col>
  );
};
export default FormSelect;
