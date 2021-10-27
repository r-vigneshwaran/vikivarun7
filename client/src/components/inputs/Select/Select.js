import { useContext } from 'react';
import { Form, Col } from '@themesberg/react-bootstrap';
import { FormContext } from '../../Home';

const FormSelect = ({ id, label, value, required, options }) => {
  const { handleChange } = useContext(FormContext);
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={label}>
        <Form.Label> {label}</Form.Label>
        <Form.Control
          as="select"
          required={required}
          onChange={(e) => handleChange(id, e.target.value)}
          value={value}
        >
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
