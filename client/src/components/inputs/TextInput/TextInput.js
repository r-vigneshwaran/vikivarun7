import { useContext } from 'react';
import { Form, Row, Col } from '@themesberg/react-bootstrap';
import { FormContext } from '../../Home';

const FormInput = ({
  id,
  label,
  value,
  required,
  placeholder,
  warningText,
  type,
  validation
}) => {
  const { handleChange } = useContext(FormContext);

  const handleChangeWithValidation = (id, value) => {
    handleChange(id, value);
    
  };
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={label}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          value={value}
          onChange={(e) => handleChangeWithValidation(id, e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      </Form.Group>
    </Col>
  );
};
export default FormInput;
