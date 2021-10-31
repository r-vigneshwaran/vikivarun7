import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popconfirm, Space, Table } from 'antd';
import { jsPDF } from 'jspdf';
import {
  FilePdfTwoTone,
  PrinterTwoTone,
  MailTwoTone,
  FormOutlined
} from '@ant-design/icons';
import { formDataSource, formColumn } from 'data/submissionFormConfig';
import axios from 'axios';
import { setNotification } from 'actions';
import { useDispatch } from 'react-redux';

const FormPage = () => {
  const doc = new jsPDF();
  const dispatch = useDispatch();
  const emailRef = useRef();
  const [columnData, setColumnData] = useState([]);

  const RenderEmail = useCallback(() => {
    return (
      <div>
        <input type="text" ref={emailRef} />
      </div>
    );
  }, [emailRef]);

  useEffect(() => {
    setColumnData(
      [
        ...formColumn,
        {
          title: 'Actions',
          render: (text, record) => (
            <Space size="middle">
              <span
                className="pointer"
                // onClick={() => handleClickOpenForm(text, record)}
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
  const handleClickDownload = () => {
    doc.save('Test.pdf');
  };
  const sentEmail = async (toAddress) => {
    const data = {
      to: toAddress,
      subject: 'New Email',
      message: 'hello world'
    };
    const response = await axios.post('http://localhost:5000/sent-email', data);
    console.log(response);
  };
  function confirm() {
    dispatch(
      setNotification(true, emailRef.current.value, 'Email Sent Successfully')
    );
    sentEmail(emailRef.current.value);
  }
  return (
    <div className="forms">
      <div className="tableContainer form">
        <Table
          dataSource={formDataSource}
          columns={columnData}
          scroll={{ y: 1000 }}
        />
      </div>
    </div>
  );
};

export default FormPage;
