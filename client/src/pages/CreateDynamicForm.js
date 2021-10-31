import React, { useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Checkbox,
  Input,
  Row,
  Select,
  InputNumber,
  Button
} from 'antd';
import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { collection, doc, getDocs, updateDoc } from '@firebase/firestore';
import { db } from 'fire';
import { setNotification } from 'actions';
import { useDispatch } from 'react-redux';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import moment from 'moment';

const CreateDynamicForm = ({ onClickBack }) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [formName, setFormName] = useState('');
  const [formValidity, setFormValidity] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [accessibleUsers, setAccessibleUsers] = useState('');
  // const [isInvalid, setIsInvalid] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [userFormDetails, setuserFormDetails] = useState({});
  const [data, setData] = useState([
    {
      id: 1,
      fieldName: '',
      fieldType: '',
      options: '',
      isRequired: false,
      isPublic: false,
      isPrintable: false,
      sortOrder: ''
    }
  ]);

  const addField = () => {
    const newData = {
      id: 1,
      fieldName: '',
      fieldType: '',
      options: '',
      isRequired: false,
      isPublic: false,
      isPrintable: false,
      sortOrder: ''
    };
    const newId = data[data.length - 1].id + 1;
    if (newId > 10) return;
    newData['id'] = newId;
    setData((prev) => [...prev, newData]);
  };
  const handleRemoveRow = (id) => {
    if (data.length === 1) return;
    const filtered = data.filter((item) => item.id !== id);
    setData(filtered);
  };
  const handleChangeForm = (id, name, value) => {
    const newData = [...data];
    const filtered = data.find((item) => item.id === id);
    filtered[name] = value;
    const indexOf = data.findIndex((item) => item.id === id);
    newData[indexOf] = filtered;
    setData(newData);
  };
  const checkEmail = async (trimmedEmails = []) => {
    const emails = [];
    await Promise.all(
      trimmedEmails.map(async (email) => {
        const querySnapshot = await getDocs(collection(db, email));
        if (querySnapshot.docs.length === 0) {
          dispatch(
            setNotification(
              true,
              `There is no user with ${email} id please check it again`,
              'No user Found'
            )
          );
          emails.push(false);
        } else {
          querySnapshot.docs.map((item) => {
            if (item.id === 'forms') {
              setuserFormDetails((prev) => ({ ...prev, [email]: item.data() }));
            }
          });
          emails.push(true);
        }
      })
    );
    return !emails.includes(false);
  };

  const uploadForms = async (data) => {
    Object.keys(userFormDetails).map(async (email) => {
      const { forms = [] } = userFormDetails[email];
      const newForm = [...forms, data];
      const newCount = newForm.length;
      const newFinalData = { formsCount: newCount, forms: newForm };
      const formRef = doc(db, email, 'forms');
      await updateDoc(formRef, newFinalData);
    });
  };

  const handleUploadImage = (file) => {
    // await new Promise(
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const imageUid = `${formName}-${file.name}`;
      const storageRef = ref(storage, `images/${imageUid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // return new Promise(
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          dispatch(setNotification(true, error, 'Error Uploading Image'));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
      // );
    });
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile)
      return dispatch(
        setNotification(true, 'Upload an banner', 'No Image Found')
      );
    const file = new FormData();
    if (selectedFile) {
      file.append('file', selectedFile);
      file.append('id', selectedFile.lastModified);
    }
    const trimmedEmails = accessibleUsers.split(',').map((item) => item.trim());
    const finalData = {
      formName,
      validity: formValidity,
      status: formStatus,
      imageUrl: '',
      accessibleUsers: trimmedEmails,
      dyanmicFormData: data,
      createdAt: moment(),
      updatedAt: moment()
    };
    const response = await checkEmail(trimmedEmails);
    if (response) {
      uploadForms(finalData);
    }
    handleUploadImage(selectedFile).then((res) => {
      finalData['imageUrl'] = res;
      console.log(res, 'Download URL');
    });
  };

  function onChangeDate(date, dateString) {
    setFormValidity(dateString);
  }

  const onClickReset = () => {};

  const handleChangeUpload = (event) => {
    setFileName(event.target.files[0].name);
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  return (
    <form onSubmit={onClickSubmit}>
      <div className="flex-row between form-header">
        <div className="flex-row ip-group">
          <span>Form Name</span>
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            placeholder="Field Name"
            style={{ width: 200 }}
          />
        </div>
        <div className="flex-row ip-group">
          <span>Validity</span>
          <DatePicker onChange={onChangeDate} required style={{ width: 200 }} />
        </div>
        <div className="flex-row ip-group">
          <span>Form Status</span>{' '}
          <Select
            required
            style={{ width: 200 }}
            value={formStatus}
            onChange={(value) => setFormStatus(value)}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">InActive</Option>
          </Select>
        </div>
      </div>
      <Row>
        <Col span={10}>
          <div className="flex-row">
            <div className="flex-column banner">
              <p>Banner Image</p>
              <p>( click the image to select, crop, rotate & resize )</p>
            </div>
            <div className="formImgContainer">
              <div className="upload-img">
                <div className="upload ">
                  <input
                    type="file"
                    id="doc"
                    className="d-none"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleChangeUpload(e)}
                  />
                  <div className="input-box p-1 ps-2">
                    {fileName
                      ? `Chosen File : ${fileName}`
                      : 'Please Select a File'}
                  </div>
                  {/* <label htmlFor="doc" className="browse">
                    {t('documents:browse')}
                  </label> */}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={14}>
          <div className="flex-row">
            <div className="flex-column access">
              <p>Accessible Users</p>
              <p>( comma separated email addresses to access this form )</p>
            </div>
            <TextArea
              value={accessibleUsers}
              onChange={(e) => setAccessibleUsers(e.target.value)}
              rows={4}
            />
          </div>
        </Col>
      </Row>
      <table style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>Fields</th>
            <th>Field Name </th>
            <th>Field Type</th>
            <th>Options | Decription</th>
            <th>Is Required? </th>
            <th>IsPublic? </th>
            <th>Is Printable </th>
            <th>Sort Order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (
              {
                id,
                fieldName,
                fieldType,
                options,
                isRequired,
                isPublic,
                isPrintable,
                sortOrder
              },
              index
            ) => {
              return (
                <tr key={id}>
                  <td></td>
                  <td>
                    <Input
                      style={{ width: 200 }}
                      placeholder="enter field type"
                      required
                      onChange={(event) =>
                        handleChangeForm(id, 'fieldName', event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Select
                      name="fieldType"
                      style={{ width: 150 }}
                      required
                      onChange={(value) =>
                        handleChangeForm(id, 'fieldType', value)
                      }
                    >
                      <Option value="text">Text</Option>
                      <Option value="select">Select</Option>
                      <Option value="textarea">Textarea</Option>
                      <Option value="date">Date</Option>
                      <Option value="radio">Radio</Option>
                      <Option value="checkbox">Checkbox</Option>
                      <Option value="multiselect">MultiSelect</Option>
                    </Select>
                  </td>
                  <td>
                    <TextArea
                      name="options"
                      required
                      onChange={(event) =>
                        handleChangeForm(
                          id,
                          'options',
                          event.target.value
                            .split(',')
                            .map((item) => item.trim())
                        )
                      }
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </td>
                  <td>
                    <Checkbox
                      onChange={(event) =>
                        handleChangeForm(id, 'isRequired', event.target.checked)
                      }
                    ></Checkbox>
                  </td>
                  <td>
                    <Checkbox
                      onChange={(event) =>
                        handleChangeForm(id, 'isPublic', event.target.checked)
                      }
                    ></Checkbox>
                  </td>
                  <td>
                    <Checkbox
                      onChange={(event) =>
                        handleChangeForm(
                          id,
                          'isPrintable',
                          event.target.checked
                        )
                      }
                    ></Checkbox>
                  </td>
                  <td>
                    <InputNumber
                      name="sortOrder"
                      min={1}
                      max={10}
                      required
                      onChange={(value) =>
                        handleChangeForm(id, 'sortOrder', value)
                      }
                    />
                  </td>
                  <td className="pointer">
                    <MinusCircleTwoTone
                      onClick={() => handleRemoveRow(id)}
                      style={{ fontSize: '20px' }}
                    />
                  </td>
                  {index === data.length - 1 && (
                    <td className="pointer">
                      <PlusCircleTwoTone
                        onClick={addField}
                        style={{ fontSize: '20px' }}
                      />
                    </td>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <div className="btnContainer">
        <Button onClick={onClickBack}>Back</Button>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
        <Button onClick={onClickReset}>Reset</Button>
      </div>
    </form>
  );
};

export default CreateDynamicForm;
