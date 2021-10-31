export const formConfig = [
  {
    id: 1,
    type: 'text',
    label: 'First Name',
    ipIndex: 'firstName',
    value: '',
    placeholder: 'Enter First Name',
    required: true,
    isPrintable: true,
    isPublic: true
  },
  {
    id: 2,
    type: 'text',
    label: 'Middle Name',
    ipIndex: 'middleName',
    value: '',
    placeholder: 'Enter Middle Name',
    isPrintable: true,
    isPublic: true
  },
  {
    id: 3,
    type: 'text',
    label: 'Last Name',
    ipIndex: 'lastName',
    value: '',
    placeholder: 'Enter Last Name',
    required: true
  },
  {
    id: 4,
    type: 'email',
    label: 'Email',
    ipIndex: 'email',
    value: '',
    placeholder: 'Enter Email',
    required: true
  },
  {
    id: 5,
    type: 'select',
    label: 'Gender',
    ipIndex: 'gender',
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
    type: 'checkbox',
    label: 'Location',
    ipIndex: 'location',
    required: true,
    value: '',
    options: [
      { id: 1, value: 'CHENNAI', label: 'Chennai' },
      { id: 2, value: 'MUMBAI', label: 'Mumbai' },
      { id: 3, value: 'PUNE', label: 'Pune' }
    ]
  },
  {
    id: 7,
    type: 'radio',
    label: 'Degree',
    ipIndex: 'Degree',
    required: true,
    value: '',
    options: [
      { id: 1, value: 'B.E', label: 'B.E' },
      { id: 2, value: 'ARTS', label: 'Arts' },
      { id: 3, value: 'OTHERs', label: 'Others' }
    ]
  },
  {
    id: 8,
    type: 'date',
    label: 'Date Of Birth',
    ipIndex: 'dateOfBirth',
    validation: 'dob',
    value: '',
    required: true,
    warningText: 'Date of Birth should not be greater than todays date'
  },
  {
    id: 9,
    type: 'number',
    label: 'Mobile Number',
    ipIndex: 'mobile',
    validation: 'mobile',
    value: '',
    required: true,
    warningText: 'Please enter a valid mobile number'
  },
  {
    id: 10,
    type: 'textarea',
    label: 'Description',
    ipIndex: 'description',
    validation: 'mobile',
    value: '',
    required: true,
    warningText: 'Please enter a valid mobile number'
  }
];
