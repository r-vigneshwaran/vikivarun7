import moment from 'moment';
import { Tag } from 'antd';

export const adminColumns = [
  {
    title: 'Form Name',
    dataIndex: 'formName',
    key: 'formName',
    sorter: (a, b) => a.formName.localeCompare(b.formName)
  },
  {
    title: 'Form Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()
  },
  {
    title: 'Banner',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    render: (imageUrl) => (
      <>
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          View
        </a>
      </>
    )
  },
  {
    title: 'Form Feilds',
    dataIndex: 'dyanmicFormData',
    key: 'dyanmicFormData',
    render: (tags) => (
      <>
        {tags.map((tag, index) => (
          <div key={index} className="flex-column">
            <Tag key={tag.fieldName}>{tag.fieldName}</Tag>
          </div>
        ))}
      </>
    )
  },
  {
    title: 'Accessible Mails',
    dataIndex: 'accessibleUsers',
    key: 'accessibleUsers',
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
    key: 'status',
    render: (tags) => (
      <>
        <Tag color={tags === 'active' ? 'green' : 'red'}>
          {tags.toUpperCase()}
        </Tag>
      </>
    )
  },
  {
    title: 'Validity',
    dataIndex: 'validity',
    key: 'validity',
    render: (time) => <small>{moment(time).format('DD MM YYYY HH:MMA')}</small>
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
