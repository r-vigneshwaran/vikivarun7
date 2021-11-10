import { Form, Col } from '@themesberg/react-bootstrap';

const FormCheckbox = ({ id, label, options, type, ipIndex }) => {
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={`checkbox ${ipIndex}`} className="input-group">
        <Form.Label>{label}</Form.Label>
        <div className="options">
          {options.map((item, index) => (
            <Form.Check
              key={index}
              inline
              label={item}
              value={item}
              type={type}
            />
          ))}
        </div>
      </Form.Group>
    </Col>
  );
};
export default FormCheckbox;
