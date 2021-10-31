import React, { useState, useEffect } from 'react';
import { useAuth } from 'AuthContext';
import { AutoComplete, Select, Table, Space } from 'antd';
import { adminColumns, adminDataSource } from 'data/adminTableConfig';
import { FormOutlined, DeleteFilled, TableOutlined } from '@ant-design/icons';
import CreateDynamicForm from './CreateDynamicForm';
import { Link } from 'react-router-dom';

const { Option } = Select;

const AdminDashboard = () => {
  const { currentUser, logOut } = useAuth();
  const [options, setOptions] = useState([]);
  const [columnData, setcolumnData] = useState([]);
  const [isShowTable, setIsShowTable] = useState(true);
  const handleChangeFilter = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    if (!options.length) {
      const data = adminDataSource.map((item) => ({ value: item.name }));
      setOptions(data);
    }
  }, [options]);

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
              <Link to={`/form/${record.id}`} className="pointer">
                <TableOutlined />
              </Link>
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
  }, []);

  const handleClickOpenForm = (text, record) => {
    setIsShowTable(!isShowTable);
  };

  const filter = (inputValue, option) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  const onSelectSearch = (data) => {
    console.log('onSelect', data);
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
          <Table
            dataSource={adminDataSource}
            columns={columnData}
            scroll={{ y: 1000 }}
          />
        </div>
      ) : (
        <div className="tableContainer">
          <CreateDynamicForm onClickBack={handleClickOpenForm} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
