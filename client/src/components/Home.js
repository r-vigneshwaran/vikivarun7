import React, { useCallback, useEffect, useRef, useState } from 'react';
import { dataSource, columns } from 'data/userTableConfig';
import {
  Space,
  Row,
  Col,
  AutoComplete,
  Popconfirm,
  message,
  Image,
  Select,
  Table
} from 'antd';
import {
  FilePdfTwoTone,
  PrinterTwoTone,
  MailTwoTone,
  FormOutlined
} from '@ant-design/icons';
import { formConfig } from 'data/formConfig';
import CustomForm from './CustomForm';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { useAuth } from 'AuthContext';
import { getForm } from 'actions';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;

const Home = () => {
  const dispatch = useDispatch();
  const [tableData, setTableDate] = useState([]);
  const [formName, setFormName] = useState('');
  const [dynamicForm, setDynamicForm] = useState([]);
  const userFormDetails = useSelector((state) => state.userFormData);
  const emailRef = useRef();
  const [options, setOptions] = useState([]);
  const [columnData, setcolumnData] = useState([]);
  const [isShowTable, setIsShowTable] = useState(true);
  const { currentUser } = useAuth();
  const doc = new jsPDF();
  var employees = [
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Anna', lastName: 'Smith' },
    { firstName: 'Peter', lastName: 'Jones' }
  ];
  employees.forEach(function (employee, i) {
    doc.text(
      20,
      10 + i * 10,
      'First Name: ' + employee.firstName + 'Last Name: ' + employee.lastName
    );
  });

  useEffect(() => {
    if (!options.length) {
      // for autocomplete feature
      const data = dataSource.map((item) => ({ value: item.name }));
      setOptions(data);
    }
  }, [options.length]);

  const RenderEmail = useCallback(() => {
    return (
      <div>
        <input type="text" ref={emailRef} />
      </div>
    );
  }, [emailRef]);

  useEffect(() => {
    if (!userFormDetails) {
      dispatch(getForm(currentUser.email));
    } else {
      const { forms } = userFormDetails;
      setTableDate(forms);
    }
  }, [currentUser.email, userFormDetails]);

  const handleClickDownload = () => {
    doc.save('Test.pdf');
  };
  useEffect(() => {
    setcolumnData(
      [
        ...columns,
        {
          title: 'Actions',
          render: (text, record) => (
            <Space size="middle">
              <span
                className="pointer"
                onClick={() => handleClickOpenForm(text, record)}
              >
                <FormOutlined />
              </span>
              <span className="pointer" onClick={handleClickDownload}>
                <FilePdfTwoTone />
              </span>
              <span className="pointer">
                <PrinterTwoTone />
              </span>
              <Popconfirm
                placement="topLeft"
                title={RenderEmail()}
                onConfirm={confirm}
                icon={<></>}
                okText="Yes"
                cancelText="No"
                className="pointer"
              >
                <MailTwoTone />
              </Popconfirm>
            </Space>
          ),
          key: 'address'
        }
      ],
      'column'
    );
  }, []);

  const handleClickOpenForm = (text, record) => {
    const data = record.dyanmicFormData.map((item) => {
      if (item.options.length === 1) {
        return {
          type: item.fieldType,
          label: item.fieldName,
          ipIndex: item.fieldName,
          value: '',
          placeholder: item.options[0],
          required: item.isRequired,
          isPrintable: item.isPrintable,
          isPublic: item.isPublic
        };
      } else if (item.options.length > 1) {
        return {
          type: item.fieldType,
          label: item.fieldName,
          ipIndex: item.fieldName,
          value: '',
          options: item.options,
          required: item.isRequired,
          isPrintable: item.isPrintable,
          isPublic: item.isPublic
        };
      }
    });
    setDynamicForm(data);
    setFormName(record.formName);
    setIsShowTable(!isShowTable);
  };
  const handleCloseForm = () => {
    setIsShowTable(!isShowTable);
  };
  console.log(dynamicForm);
  const handleChangeFilter = (value) => {};

  const onSelectSearch = (data) => {};

  const filter = (inputValue, option) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  function confirm() {
    message.info(emailRef.current.value);
    sentEmail(emailRef.current.value);
  }
  const sentEmail = async (toAddress) => {
    const data = {
      to: toAddress,
      subject: 'New Email',
      message: 'hello world'
    };
    const response = await axios.post('http://localhost:5000/sent-email', data);
    // console.log(response);
  };
  return (
    <div className="forms">
      <div className="form-title">
        <h1>Available Forms</h1>
        <span className="route">Home &gt; Forms</span>
      </div>
      {isShowTable ? (
        <div className="tableContainer">
          <div className="tools">
            <div className="filter">
              <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                onChange={handleChangeFilter}
              >
                <Option value="5">5 Results</Option>
                <Option value="10">10 Results</Option>
                <Option value="15">15 Results</Option>
              </Select>
            </div>
            <div className="search">
              <AutoComplete
                options={options}
                style={{ width: 200 }}
                onSelect={onSelectSearch}
                placeholder="input here"
                filterOption={filter}
              />
            </div>
          </div>
          {tableData.length > 0 && (
            <Table
              dataSource={tableData}
              columns={columnData}
              scroll={{ y: 1000 }}
            />
          )}
        </div>
      ) : (
        <>
          {' '}
          <Row className="form">
            <Col span={12} className="banner">
              <div className="imgContainer">
                <Image
                  preview={false}
                  width="100%"
                  height="100%"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </div>
            </Col>
            <Col span={12} className="form-side">
              <h1>Custom Dynamic Form</h1>
              {dynamicForm.length > 0 && (
                <CustomForm
                  config={dynamicForm}
                  formName={formName}
                  handleClickBack={handleCloseForm}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
