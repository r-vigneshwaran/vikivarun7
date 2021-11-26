import React from 'react';
import { Form, Col, Select } from 'antd';
const { Option } = Select;

const FormSelect = ({ id, label, required, options, ipIndex, placeholder }) => {
  return (
    <Col key={id} className="mt-3">
      <Form.Item name={ipIndex} label={label} rules={[{ required: required }]}>
        <Select placeholder={placeholder} allowClear>
          {options.length > 0 &&
            options.map((value, index) => (
              <Option key={index} value={value}>
                {value}
              </Option>
            ))}
        </Select>
      </Form.Item>
    </Col>
  );
};
export default FormSelect;
