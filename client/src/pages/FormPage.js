import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popconfirm, Space, Table } from 'antd';
import { jsPDF } from 'jspdf';
import {
  FilePdfTwoTone,
  PrinterTwoTone,
  MailTwoTone,
  FormOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { setNotification } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const FormPage = () => {
  const history = useHistory();
  const doc = new jsPDF();
  const FormFeedbackData = useSelector((state) => state.FormFeedbackData);
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
    if (FormFeedbackData) {
      setColumnData([
        ...FormFeedbackData.config,
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
      ]);
    } else {
      history.push('/admin/dashboard');
    }
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
      {FormFeedbackData && (
        <div className="tableContainer form">
          <Table
            dataSource={FormFeedbackData.data}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15']
            }}
            columns={columnData}
            scroll={{ y: 1000 }}
          />
        </div>
      )}
    </div>
  );
};

export default FormPage;
