import moment from 'moment';

export const formDataSource = [
  {
    key: '1',
    submittedUser: 'Basic Details',
    date: '18 June 2021 12:05PM',
    name: 'Santhosh Kumar',
    gender: 'Male',
    dob: '25/05/189',
    designation: 'Senior Developer',
    experience: '3 Years',
    preferredLocation: ['chennai', 'pune'],
    brief: 'Text Message for html text',
    userName: 'my username',
    password: 'my password'
  }
];

export const formColumn = [
  {
    title: 'Submitted user (date and time)',
    dataIndex: 'submittedUser',
    key: 'submittedUser',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender'
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dob',
    key: 'dob'
  },
  {
    title: 'Designation',
    dataIndex: 'designation',
    key: 'designation'
  },
  {
    title: 'Experience',
    dataIndex: 'experience',
    key: 'experience'
  },
  {
    title: 'Preferred Location',
    dataIndex: 'preferredLocation',
    key: 'preferredLocation'
  },
  {
    title: 'brief',
    dataIndex: 'brief',
    key: 'brief'
  },
  {
    title: 'Username',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: 'password',
    dataIndex: 'password',
    key: 'password'
  }
];
