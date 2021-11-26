import { Select, Form } from 'antd';
import React from 'react';

const FormMultiSelect = ({
  id,
  label,
  required,
  options,
  ipIndex,
  placeholder
}) => {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <div>
      <>
        <Form.Item
          name={ipIndex}
          label={label}
          rules={[{ required: required }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={placeholder}
            onChange={handleChange}
          >
            {options.length > 0 &&
              options.map((value, index) => (
                <Select.Option key={index} value={value}>
                  {value}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </>
    </div>
  );
};

export default FormMultiSelect;
