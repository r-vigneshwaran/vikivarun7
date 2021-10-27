import { useContext } from 'react';
import { Form, Col } from '@themesberg/react-bootstrap';
import { FormContext } from '../../Home';

const FormCheckbox = ({ id, label, value, required, options }) => {
  const { handleChange } = useContext(FormContext);
  return (
    <Col key={id} className="mt-3">
      <Form.Group controlId={label}>
        <Form.Label> {label}</Form.Label>
        {options.map((item) => (
          <Form.Check
            inline
            label={item.label}
            name="group1"
            type="checkbox"
            id={`checkbox-1`}
            value={value}
            onChange={(event) =>
              console.log(
                event.target.checked,
                event.target.name,
                event.target.value
              )
            }
          />
        ))}
      </Form.Group>
    </Col>
  );
};
export default FormCheckbox;
