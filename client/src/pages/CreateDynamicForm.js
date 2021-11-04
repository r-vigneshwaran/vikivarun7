import React, { useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Checkbox,
  Input,
  Row,
  Select,
  InputNumber,
  Button,
  Progress,
  Image
} from 'antd';
import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  writeBatch
} from '@firebase/firestore';
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

const CreateDynamicForm = ({ onClickBack, selectedFormData = {} }) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [formName, setFormName] = useState('');
  const [progress, setProgress] = useState(0);
  const [formValidity, setFormValidity] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [accessibleUsers, setAccessibleUsers] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [userFormDetails, setuserFormDetails] = useState({});
  const [image, setImage] = useState(null);
  const [dynamicForm, setDynamicForm] = useState([]);
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

  useEffect(() => {
    if (progress === 100) {
      setInterval(() => {
        setProgress(0);
      }, 15000);
    }
  }, [progress]);

  useEffect(() => {
    if (selectedFormData) {
      setFormName(selectedFormData.formName);
      setFormValidity(selectedFormData.validity);
      setFormStatus(selectedFormData.status);
      setImage(selectedFormData.imageUrl);
      setAccessibleUsers(selectedFormData.accessibleUsers.join(', '));
      setData(selectedFormData.dyanmicFormData);
    }
  }, [selectedFormData]);

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
          querySnapshot.docs.forEach((item) => {
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
    const batch = writeBatch(db);
    Object.keys(userFormDetails).map(async (email) => {
      const { forms = {} } = userFormDetails[email];
      forms[formName] = data;
      const newFinalData = {
        formsCount: Object.keys(forms).length,
        forms: forms
      };
      const formRef = doc(db, email, 'forms');
      batch.update(formRef, newFinalData);
      const adminFormRef = doc(db, 'admin@admin.com', 'forms');
      batch.update(adminFormRef, newFinalData);
      await batch.commit();
    });
  };

  const handleUploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const imageUid = `${formName}-${file.name}`;
      const storageRef = ref(storage, `images/${imageUid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          dispatch(setNotification(true, error, 'Error Uploading Image'));
        },
        async () => {
          const res = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(res);
        }
      );
    });
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile)
      return dispatch(
        setNotification(true, 'Upload an banner', 'No Image Found')
      );
    setProgress(10);
    window.scrollTo(0, 0);
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
      createdAt: moment().format('DD MM YYYY'),
      updatedAt: moment().format('DD MM YYYY')
    };
    const imageURL = await handleUploadImage(selectedFile);
    finalData['imageUrl'] = imageURL;
    const response = await checkEmail(trimmedEmails);
    if (response) {
      await uploadForms(finalData);
      dispatch(setNotification(true, 'Form Uploaded Successfully', 'Message'));
    }
  };

  function onChangeDate(date, dateString) {
    setFormValidity(dateString);
  }

  const onClickReset = () => {};

  const handleChangeUpload = (event) => {
    const imageFile = event.target.files[0];
    setFileName(imageFile.name);
    setSelectedFile(imageFile);
    setImage(URL.createObjectURL(imageFile));
  };

  return (
    <form onSubmit={onClickSubmit}>
      {progress > 0 && (
        <div>
          <Progress
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068'
            }}
            style={{
              position: 'absolute',
              left: `calc(50% - 250px)`,
              top: '7.5%',
              width: 500
            }}
            percent={progress}
          />
        </div>
      )}
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
          <input
            type="datetime-local"
            value={formValidity}
            onChange={(e) => setFormValidity(e.target.value)}
            required
            style={{ width: 200, color: 'black' }}
          />
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
                </div>
              </div>
              {image && <Image src={image} alt="preview image" />}
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
                      value={fieldName}
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
                      value={fieldType}
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
                      <Option value="number">Number</Option>
                      <Option value="email">Email</Option>
                      <Option value="password">Password</Option>
                    </Select>
                  </td>
                  <td>
                    <TextArea
                      name="options"
                      value={options.length ? options.join(', ') : ''}
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
                      checked={isRequired}
                      value={isRequired}
                      onChange={(event) =>
                        handleChangeForm(id, 'isRequired', event.target.checked)
                      }
                    ></Checkbox>
                  </td>
                  <td>
                    <Checkbox
                      checked={isPublic}
                      value={isPublic}
                      onChange={(event) =>
                        handleChangeForm(id, 'isPublic', event.target.checked)
                      }
                    ></Checkbox>
                  </td>
                  <td>
                    <Checkbox
                      checked={isPrintable}
                      value={isPrintable}
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
                      value={parseInt(sortOrder)}
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
