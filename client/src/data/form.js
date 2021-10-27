export const formConfig = [
  {
    id: 1,
    type: 'text',
    label: 'firstName',
    value: '',
    placeholder: 'enterFirstName',
    required: true
  },
  {
    id: 2,
    type: 'text',
    label: 'middleName',
    value: '',
    placeholder: 'enterMiddleName'
  },
  {
    id: 3,
    type: 'text',
    label: 'lastName',
    value: '',
    placeholder: 'enter Last Name',
    required: true
  },
  {
    id: 4,
    type: 'email',
    label: 'email',
    value: '',
    placeholder: 'enter Email',
    required: true
  },
  {
    id: 5,
    type: 'select',
    label: 'gender',
    required: true,
    value: '',
    options: [
      { id: 1, value: 'MALE', label: 'male' },
      { id: 2, value: 'FEMALE', label: 'female' },
      { id: 3, value: 'THEY', label: 'they' }
    ]
  },
  {
    id: 6,
    type: 'date',
    label: 'dob',
    validation: 'dob',
    value: '',
    required: true,
    warningText: 'Date of Birth should not be greater than todays date'
  },
  {
    id: 7,
    type: 'number',
    label: 'mobileNumber',
    validation: 'mobile',
    value: '',
    required: true,
    warningText: 'Please enter a valid mobile number'
  }
];
