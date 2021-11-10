import React, { useState, useEffect } from 'react';
import { AutoComplete, Table, Space, Button, Select, Divider } from 'antd';
import { adminColumns } from 'data/adminTableConfig';
import { FormOutlined, DeleteFilled, TableOutlined } from '@ant-design/icons';
import CreateDynamicForm from './CreateDynamicForm';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getForm, setFormFeedback, setNotification } from 'actions';
import { useHistory } from 'react-router';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from 'fire';
import { useAuth } from 'AuthContext';

const AdminDashboard = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUser, isAdmin } = useAuth();
  const formsList = useSelector((state) => state.userFormData);
  const [options, setOptions] = useState([]);
  const [columnData, setcolumnData] = useState([]);
  const [initialTableData, setInitialTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedFormData, setSelectedFormData] = useState({});
  const [formUid, setFormUid] = useState();
  const [isShowTable, setIsShowTable] = useState(true);
  const [rowSize, setRowSize] = useState(5);

  useEffect(() => {
    if (initialTableData.length) {
      const data = initialTableData.map((item) => ({ value: item.formName }));
      setOptions(data);
    }
  }, [initialTableData]);

  useEffect(() => {
    if (!formsList) {
      dispatch(getForm('admin@admin.com', true));
    } else {
      setInitialTableData(formsList);
      setTableData(formsList);
    }
  }, [dispatch, formsList]);

  const setFormDetails = (record) => {
    dispatch(setFormFeedback(record, history));
  };

  const handleClickDeleteForm = async (record) => {
    const updatedForms = formsList.filter((item) => item.key !== record.key);
    const adminFormRef = doc(db, 'admin@admin.com', 'forms');
    await updateDoc(adminFormRef, { forms: updatedForms });
    dispatch(
      setNotification(
        true,
        'Message',
        `${record.formName} deleted successfully`
      )
    );
    dispatch(getForm(currentUser.email, isAdmin));
  };

  useEffect(() => {
    setcolumnData(
      [
        ...adminColumns,
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
              <div onClick={() => setFormDetails(record)} className="pointer">
                <TableOutlined />
              </div>
              <span
                onClick={() => handleClickDeleteForm(record)}
                className="pointer"
              >
                <DeleteFilled />
              </span>
            </Space>
          ),
          key: 'address'
        }
      ],
      'column'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOpenForm = (text, record) => {
    setFormUid(record.key);
    setSelectedFormData(record);
    setIsShowTable(!isShowTable);
  };
  const handleCreateForm = () => {
    setFormUid();
    setSelectedFormData(null);
    setIsShowTable(!isShowTable);
  };

  const filter = (inputValue, option) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  const onChangeFilter = (value) => {
    if (value) {
      setTableData(
        tableData.filter((person) =>
          person.formName.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setTableData(initialTableData);
    }
  };
  const handleChangeFilter = (value) => {
    setRowSize(parseInt(value));
  };
  return (
    <div className="forms">
      <div className="form-title">
        <h1>Available Forms</h1>
        <span className="route">Home &gt; Forms</span>
      </div>
      <Divider plain></Divider>
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
            <div className="btn">
              <Button onClick={handleCreateForm}>Create New Form</Button>
            </div>
          </div>
          {tableData.length > 0 && (
            <Table
              bordered
              pagination={{ pageSize: rowSize }}
              dataSource={tableData}
              columns={columnData}
            />
          )}
        </div>
      ) : (
        <div className="tableContainer">
          <CreateDynamicForm
            formUid={formUid}
            selectedFormData={selectedFormData}
            onClickBack={() => setIsShowTable(!isShowTable)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
