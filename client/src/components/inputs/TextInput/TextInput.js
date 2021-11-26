import React from 'react';
import { Form, Col, Input, DatePicker, InputNumber } from 'antd';

const { TextArea } = Input;

const FormInput = ({
  id,
  label,
  value,
  required,
  placeholder,
  ipIndex,
  type
}) => {
  const RenderBasedOnType = (type) => {
    switch (type) {
      case 'textarea':
        return (
          <Form.Item
            label={label}
            name={ipIndex}
            rules={[
              {
                required: required,
                message: placeholder
              }
            ]}
          >
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
        );
      case 'date':
        return (
          <Form.Item
            label={label}
            name={ipIndex}
            rules={[
              {
                required: required,
                message: placeholder
              }
            ]}
          >
            <DatePicker />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item
            label={label}
            name={ipIndex}
            rules={[
              {
                required: required,
                message: placeholder
              }
            ]}
          >
            <InputNumber className="w-300" type="number" placeholder="00" />
          </Form.Item>
        );
      case 'email':
        return (
          <Form.Item
            label={label}
            name={ipIndex}
            rules={[
              {
                type: 'email',
                required: required,
                message: placeholder
              }
            ]}
          >
            <Input />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            label={label}
            name={ipIndex}
            rules={[
              {
                required: required,
                message: placeholder
              }
            ]}
          >
            <Input />
          </Form.Item>
        );
    }
  };
  return (
    <Col key={id} className="mt-4">
      {RenderBasedOnType(type)}
    </Col>
  );
};
export default FormInput;
