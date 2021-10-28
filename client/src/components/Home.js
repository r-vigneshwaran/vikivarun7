import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { Image, Select, Table } from 'antd';
import { dataSource, columns } from '../data/userTableConfig';
import { Space, Row, Col, AutoComplete, Popconfirm, message } from 'antd';
import {
  EditTwoTone,
  FilePdfTwoTone,
  PrinterTwoTone,
  MailTwoTone
} from '@ant-design/icons';
import { formConfig } from '../data/form';
import CustomForm from './CustomForm';
import { jsPDF } from 'jspdf';
import axios from 'axios';

export const FormContext = createContext(null);

const { Option } = Select;

const Home = ({ logout }) => {
  const [userEmail, setUserEmail] = useState('');
  const emailRef = useRef();
  const [options, setOptions] = useState([]);
  const [columnData, setcolumnData] = useState([]);
  const [isShowTable, setIsShowTable] = useState(true);
  const user = useSelector((state) => state.user);
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
    if (user) {
      setUserEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!options.length) {
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
                <EditTwoTone />
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
    setIsShowTable(!isShowTable);
  };
  const handleChangeFilter = (value) => {
    console.log(`selected ${value}`);
  };

  const onSelectSearch = (data) => {
    console.log('onSelect', data);
  };

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
    console.log(response);
  };
  return (
    <section className="hero">
      <nav>
        <h2>Welcome {userEmail && userEmail}</h2>
        <button onClick={logout}>Logout</button>
      </nav>
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
            <Table
              dataSource={dataSource}
              columns={columnData}
              scroll={{ y: 1000 }}
            />
          </div>
        ) : (
          <>
            {' '}
            <Row className="form">
              <Col span={12} className="banner">
                <div className="imgContainer">
                  <Image
                    width="100%"
                    height="100%"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                </div>
              </Col>
              <Col span={12} className="form-side">
                <h1>Custom Dynamic Form</h1>
                <CustomForm
                  config={formConfig}
                  handleClickBack={handleClickOpenForm}
                />
              </Col>
            </Row>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
