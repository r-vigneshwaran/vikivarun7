import { Form, Col } from '@themesberg/react-bootstrap';

const FormCheckbox = ({ id, label, options, type, ipIndex }) => {
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={`checkbox ${ipIndex}`} className="input-group">
        <Form.Label>{label}</Form.Label>
        <div className="options">
          {options.map((item) => (
            <Form.Check
              key={item.id}
              inline
              label={item.label}
              value={item.value}
              name="radio-check"
              type={type}
            />
          ))}
        </div>
      </Form.Group>
    </Col>
  );
};
export default FormCheckbox;
