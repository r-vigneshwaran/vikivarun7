import { Select, Form } from 'antd';
import React from 'react';

const FormMultiSelect = ({ id, label, required, options, ipIndex }) => {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <div>
      <Form>
        <Form.Item name={ipIndex}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
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
      </Form>
    </div>
  );
};

export default FormMultiSelect;
