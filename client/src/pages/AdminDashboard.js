import React, { useState, useEffect } from 'react';
import { AutoComplete, Select, Table, Space } from 'antd';
import { adminColumns, adminDataSource } from 'data/adminTableConfig';
import { FormOutlined, DeleteFilled, TableOutlined } from '@ant-design/icons';
import CreateDynamicForm from './CreateDynamicForm';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getForm, setFormFeedback } from 'actions';
import { useHistory } from 'react-router';

const { Option } = Select;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const formsList = useSelector((state) => state.userFormData);
  const [options, setOptions] = useState([]);
  const [columnData, setcolumnData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedFormData, setSelectedFormData] = useState({});
  const [isShowTable, setIsShowTable] = useState(true);
  const handleChangeFilter = (value) => {};

  useEffect(() => {
    if (!options.length) {
      const data = adminDataSource.map((item) => ({ value: item.name }));
      setOptions(data);
    }
  }, [options]);

  useEffect(() => {
    if (!formsList) {
      dispatch(getForm('admin@admin.com'));
    } else {
      const data = Object.keys(formsList.forms).map((item, index) => ({
        ...formsList.forms[item],
        key: index + 1
      }));
      setTableData(data);
    }
  }, [dispatch, formsList]);

  const setFormDetails = (record) => {
    dispatch(setFormFeedback(record, history));
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
              <span className="pointer">
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
    setIsShowTable(!isShowTable);
    setSelectedFormData(record);
  };

  const filter = (inputValue, option) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  const onSelectSearch = (data) => {};

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
        <div className="tableContainer">
          <CreateDynamicForm
            selectedFormData={selectedFormData}
            onClickBack={handleClickOpenForm}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
