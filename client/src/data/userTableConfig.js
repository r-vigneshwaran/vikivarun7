
import moment from 'moment';

export const dataSource = [
  {
    key: '1',
    name: 'Basic Details',
    created: '08 June 2021',
    updated: '08 June 2021'
  },
  {
    key: '2',
    name: 'Contact Details',
    created: '09 June 2021',
    updated: '08 June 2021'
  },
  {
    key: '3',
    name: 'Family Details',
    created: '10 June 2021',
    updated: '08 June 2021'
  },
  {
    key: '4',
    name: 'Educational Details',
    created: '11 June 2021',
    updated: '08 June 2021'
  },
  {
    key: '5',
    name: 'Employment Details',
    created: '12 June 2021',
    updated: '08 June 2021'
  }
];

export const columns = [
  {
    title: 'Form Name',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'Form Created',
    dataIndex: 'created',
    key: 'created',
    sorter: (a, b) => moment(a.created).unix() - moment(b.created).unix()
  },
  {
    title: 'Form Last Updated',
    dataIndex: 'updated',
    key: 'updated',
    sorter: (a, b) => moment(a.updated).unix() - moment(b.updated).unix()
  },
  
];