import moment from 'moment';
import { Tag } from 'antd';

export const adminColumns = [
  {
    title: 'Form Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'Form Created',
    dataIndex: 'created',
    key: 'created',
    sorter: (a, b) => moment(a.created).unix() - moment(b.created).unix()
  },
  {
    title: 'Banner',
    dataIndex: 'banner',
    key: 'banner',
    render: (text) => (
      <>
        <a href="#basic">View</a>
      </>
    )
  },
  {
    title: 'Form Feilds',
    dataIndex: 'feilds',
    key: 'feilds',
    render: (tags) => (
      <>
        {tags.map((tag, index) => (
          <div key={index} className="flex-column">
            <Tag key={tag}>{tag}</Tag>
          </div>
        ))}
      </>
    )
  },
  {
    title: 'Accessible Mails',
    dataIndex: 'accessiblemails',
    key: 'accessiblemails',
    render: (mails) => (
      <>
        {mails.map((mail, index) => (
          <div key={index} className="column">
            <Tag key={mail}>{mail}</Tag>
          </div>
        ))}
      </>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Validity',
    dataIndex: 'validity',
    key: 'validity'
  }
];

export const adminDataSource = [
  {
    id: 1,
    name: 'Basic Details',
    created: '08 June 2021',
    feilds: [
      'Name',
      'Gender',
      'D.O.B',
      'Designation',
      'Experience',
      'Preferred Location',
      'Brief',
      'Username',
      'Password'
    ],
    accessiblemails: [
      'devteam@skpts.com',
      'username@gmail.com',
      'santhosh@gmail.com'
    ],
    status: 'Active',
    validity: '08 Aug 2021'
  },
  {
    id: 2,
    name: 'Contact Details',
    created: '08 June 2021',
    feilds: [
      'Name',
      'Gender',
      'D.O.B',
      'Designation',
      'Experience',
      'Preferred Location',
      'Brief'
    ],
    accessiblemails: [
      'devteam@skpts.com',
      'username@gmail.com',
      'santhosh@gmail.com'
    ],
    status: 'Active',
    validity: '08 Aug 2021'
  },
  {
    id: 3,
    name: 'Family Details',
    created: '08 June 2021',
    feilds: ['Name', 'Gender'],
    accessiblemails: ['devteam@skpts.com'],
    status: 'Active',
    validity: '08 Aug 2021'
  },
  {
    id: 4,
    name: 'Educational Details',
    created: '08 June 2021',
    feilds: ['Name', 'Gender'],
    accessiblemails: ['devteam@skpts.com'],
    status: 'Active',
    validity: '08 Aug 2021'
  },
  {
    id: 5,
    name: 'Employment Details',
    created: '08 June 2021',
    feilds: ['Name', 'Gender'],
    accessiblemails: ['devteam@skpts.com'],
    status: 'Active',
    validity: '08 Aug 2021'
  }
];
