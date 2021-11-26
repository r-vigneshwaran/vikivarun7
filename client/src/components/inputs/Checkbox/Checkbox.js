import { Form, Col, Checkbox, Row } from 'antd';

const FormCheckbox = ({ id, label, options, type, ipIndex }) => {
  return (
    <Col key={id} className="mt-3">
      <Form.Item name={ipIndex} label={label}>
        <Checkbox.Group>
          <Row>
            <Col span={8}>
              {options.map((check, index) => (
                <Checkbox
                  key={index}
                  value={check}
                  style={{ lineHeight: '32px' }}
                >
                  {check}
                </Checkbox>
              ))}
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};
export default FormCheckbox;
