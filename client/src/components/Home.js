import React, { useCallback, useEffect, useRef, useState } from 'react';
import { columns } from 'data/userTableConfig';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import {
  Space,
  Row,
  Col,
  AutoComplete,
  Popconfirm,
  Image,
  Select,
  Table,
  Divider
} from 'antd';
import {
  FilePdfTwoTone,
  PrinterTwoTone,
  MailTwoTone,
  FormOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import CustomForm from './CustomForm';
import { jsPDF } from 'jspdf';
import { useAuth } from 'AuthContext';
import { getForm, sendMail, setNotification } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { mapKeyToArray } from 'utility';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Option } = Select;

const Home = () => {
  const dispatch = useDispatch();
  const noFormAvailable = useSelector((state) => state.noFormAvailable);
  const [tableData, setTableDate] = useState([]);
  const [formName, setFormName] = useState('');
  const [dynamicForm, setDynamicForm] = useState([]);
  const userFormDetails = useSelector((state) => state.userFormData);
  const emailRef = useRef();
  const [options, setOptions] = useState([]);
  const [columnData, setcolumnData] = useState([]);
  const [bannerImage, setBannerImage] = useState('');
  const [initialTableData, setInitialTableData] = useState([]);
  const [rowSize, setRowSize] = useState(5);
  const [isShowTable, setIsShowTable] = useState(true);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (tableData.length) {
      const data = tableData
        .map((item) => ({ value: item.formName }))
        .filter((_, index) => index < 5);
      setOptions(data);
    }
  }, [tableData]);

  const RenderEmail = useCallback(() => {
    return (
      <div>
        <input
          type="text"
          ref={emailRef}
          placeholder="Enter recipient email Address"
        />
      </div>
    );
  }, [emailRef]);

  useEffect(() => {
    if (!userFormDetails) {
      dispatch(getForm(currentUser.email, isAdmin));
    } else {
      setInitialTableData(userFormDetails);
      setTableDate(userFormDetails);
    }
  }, [dispatch, userFormDetails]);

  const handleClickDownload = (record) => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const document = {
      content: [{ text: 'Employees', fontStyle: 15, lineHeight: 2 }]
    };
    Object.keys(record).forEach((item) => {
      if (item === 'accessibleUsers') {
        document.content.push({
          columns: [
            { text: item, width: 100 },
            { text: ':', width: 10 },
            {
              columns: record[item].map((item) => ({
                text: item,
                width: 100
              })),
              width: 150
            }
          ],
          lineHeight: 2
        });
      } else if (item === 'dyanmicFormData') {
      } else if (item === 'imageUrl') {
      } else {
        document.content.push({
          columns: [
            { text: item, width: 60 },
            { text: ':', width: 10 },
            { text: record[item], width: 'auto' }
          ],
          lineHeight: 2
        });
      }
    });
    pdfMake.createPdf(document).download();
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
              <span
                className="pointer"
                onClick={() => handleClickDownload(record)}
              >
                <FilePdfTwoTone />
              </span>
              <span className="pointer">
                <PrinterTwoTone />
              </span>
              <Popconfirm
                placement="topLeft"
                title={RenderEmail()}
                onConfirm={() => confirm(record)}
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
    const today = moment().format('YYYY-MM-DD  HH MM');
    const validity = moment(record.validity).format('YYYY-MM-DD HH MM');

    if (validity < today)
      return dispatch(
        setNotification(true, `${record.formName} Form Expired`, 'Message')
      );
    if (record.status === 'inactive')
      return dispatch(
        setNotification(true, 'Form is not temporarily active', 'Message')
      );
    setBannerImage(record.imageUrl);
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
      } else if (item.options.length === 0) {
        return {
          type: item.fieldType,
          label: item.fieldName,
          ipIndex: item.fieldName,
          value: '',
          placeholder: '',
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

  const handleChangeFilter = (value) => {
    setRowSize(parseInt(value));
  };

  const filter = (inputValue, option) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  function confirm(record) {
    dispatch(sendMail(currentUser.email, emailRef.current.value, record));
    emailRef.current.value = '';
  }

  const onChangeFilter = (value) => {
    if (value) {
      setTableDate(
        tableData.filter((person) =>
          person.formName.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setTableDate(initialTableData);
    }
  };

  return (
    <div className="forms">
      {noFormAvailable ? (
        <div>
          {' '}
          <div className="form-title">
            <h1>No Form is Alloted for you</h1>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="form-title">
            <h1>Available Forms</h1>
            <span className="route">Home &gt; Forms</span>
          </div>
          <Divider plain orientation="right">
            {isAdmin && (
              <Link to="/admin/dashboard" className="switch">
                <UserSwitchOutlined /> Switch to Admin
              </Link>
            )}
          </Divider>
          {isShowTable ? (
            <div className="tableContainer">
              <div className="tools">
                <div className="filter">
                  <Select
                    defaultValue="5"
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
                    onChange={onChangeFilter}
                    placeholder="input here"
                    filterOption={filter}
                  />
                </div>
              </div>
              {tableData.length > 0 && (
                <Table
                  dataSource={tableData}
                  pagination={{ pageSize: rowSize }}
                  bordered
                  columns={columnData}
                />
              )}
            </div>
          ) : (
            <>
              {' '}
              <Row className="form">
                <Col span={12} className="banner">
                  {bannerImage && (
                    <div className="imgContainer">
                      <Image
                        preview={false}
                        width="100%"
                        height="100%"
                        src={bannerImage}
                      />
                    </div>
                  )}
                </Col>
                <Col span={12} className="form-side">
                  <h1>{formName && formName}</h1>
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
        </React.Fragment>
      )}
    </div>
  );
};

export default Home;
