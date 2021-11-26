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
  Image,
  Upload,
  Divider
} from 'antd';
import {
  DeleteTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone
} from '@ant-design/icons';
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch
} from '@firebase/firestore';
import { db } from 'fire';
import { setNotification, getForm } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import moment from 'moment';
import { useAuth } from 'AuthContext';
import ImgCrop from 'antd-img-crop';

const CreateDynamicForm = ({ onClickBack, selectedFormData, formUid }) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const { currentUser, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const [formName, setFormName] = useState('');
  const [progress, setProgress] = useState(0);
  const [formValidity, setFormValidity] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [accessibleUsers, setAccessibleUsers] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const forms = useSelector((state) => state.userFormData);
  const [image, setImage] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      fieldName: '',
      fieldType: '',
      options: '',
      isRequired: false,
      isPublic: false,
      isPrintable: false,
      sortOrder: 1
    }
  ]);

  useEffect(() => {
    if (progress === 100) {
      return setInterval(() => {
        setProgress(0);
      }, 15000);
    }
  }, [progress]);

  useEffect(() => {
    if (!forms) {
      dispatch(getForm('admin@admin.com', true));
    }
  }, [dispatch, forms]);

  useEffect(() => {
    if (formUid) {
      setFormName(selectedFormData.formName);
      setFormValidity(selectedFormData.validity);
      setFormStatus(selectedFormData.status);
      setImage(selectedFormData.imageUrl);
      setSelectedFile(selectedFormData.imageUrl);
      setAccessibleUsers(selectedFormData.accessibleUsers.join(', '));
      setData(selectedFormData.dyanmicFormData);
    } else {
      setFormName('');
      setFormValidity('');
      setFormStatus('');
      setImage('');
      setAccessibleUsers('');
      setData([
        {
          id: 1,
          fieldName: '',
          fieldType: '',
          options: '',
          isRequired: false,
          isPublic: false,
          isPrintable: false,
          sortOrder: 1
        }
      ]);
    }
  }, [formUid]);

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
    const newSortOrder = data[data.length - 1].sortOrder + 1;
    if (newId > 10) return;
    newData['id'] = newId;
    newData['sortOrder'] = newSortOrder;
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

  const uploadForms = async (data) => {
    if (formUid) {
      // update form
      const updatedForms = forms.map((item) =>
        item.key === formUid ? data : item
      );
      const adminFormRef = doc(db, 'admin@admin.com', 'forms');
      await updateDoc(adminFormRef, { forms: updatedForms });
    } else {
      // create form
      const cityRef = doc(db, 'admin@admin.com', 'forms');
      await setDoc(cityRef, { forms: arrayUnion(data) }, { merge: true });
    }
    dispatch(getForm(currentUser.email, isAdmin));
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
      dyanmicFormData: data
    };
    if (formUid) {
      finalData['imageUrl'] = selectedFormData.imageUrl;
      finalData['updatedAt'] = moment().format('DD MM YYYY');
      finalData['createdAt'] = selectedFormData.createdAt;
    } else {
      const imageURL = await handleUploadImage(selectedFile);
      finalData['createdAt'] = moment().format('DD MM YYYY');
      finalData['imageUrl'] = imageURL;
      finalData['updatedAt'] = moment().format('DD MM YYYY');
    }
    await uploadForms(finalData);
    dispatch(setNotification(true, 'Form Uploaded Successfully', 'Message'));
    onClickBack();
  };

  const onClickReset = () => {
    if (formUid) {
      setFormName(selectedFormData.formName);
      setFormValidity(selectedFormData.validity);
      setFormStatus(selectedFormData.status);
      setImage(selectedFormData.imageUrl);
      setAccessibleUsers(selectedFormData.accessibleUsers.join(', '));
      setData(selectedFormData.dyanmicFormData);
    } else {
      setFormName('');
      setFormValidity('');
      setFormStatus('');
      setImage('');
      setAccessibleUsers('');
      setData([
        {
          id: 1,
          fieldName: '',
          fieldType: '',
          options: '',
          isRequired: false,
          isPublic: false,
          isPrintable: false,
          sortOrder: 1
        }
      ]);
    }
  };

  const handleChangeUpload = (event) => {
    const imageFile = event.target.files[0];
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
      <Row>
        <Col span={8}>
          {' '}
          <Col className="center-input">
            <Row>
              {' '}
              <span className="form-label">Form Name</span>
            </Row>
            <Row>
              {' '}
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                placeholder="Field Name"
                style={{ width: 200 }}
              />
            </Row>
          </Col>
        </Col>
        <Col span={8}>
          {' '}
          <Col className="center-input">
            <Row>
              <span className="form-label">Validity</span>
            </Row>
            <Row>
              {' '}
              <input
                type="datetime-local"
                value={formValidity}
                onChange={(e) => setFormValidity(e.target.value)}
                required
                style={{ width: 200, color: 'black' }}
              />
            </Row>
          </Col>
        </Col>
        <Col span={8}>
          {' '}
          <Col className="center-input">
            <Row>
              {' '}
              <span className="form-label">Form Status</span>
            </Row>
            <Row>
              {' '}
              <Select
                required
                style={{ width: 200 }}
                value={formStatus}
                onChange={(value) => setFormStatus(value)}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">InActive</Option>
              </Select>
            </Row>
          </Col>
        </Col>
      </Row>
      <Divider plain />
      <Row>
        <Col span={8}>
          <Col>
            <Row className="center-row">
              <p className="form-label">Banner Image</p>
            </Row>
            <Row className="center-row">
              {image ? (
                <>
                  <span className="preview">
                    <span onClick={() => setImage('')} className="pointer">
                      <DeleteTwoTone />
                    </span>
                    <Image.PreviewGroup>
                      <Image
                        style={{
                          display: 'none',
                          top: 0,
                          left: 0,
                          position: 'absolute'
                        }}
                        width={200}
                        src={image}
                      />
                    </Image.PreviewGroup>
                  </span>
                </>
              ) : (
                <div className="upload-img">
                  <div className="upload">
                    <input
                      type="file"
                      id="doc"
                      className="upload-input"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleChangeUpload(e)}
                    />
                  </div>
                </div>
              )}
            </Row>
          </Col>
        </Col>
        <Col span={14}>
          <Col>
            <Row>
              <p className="form-label">Accessible Users</p>
            </Row>
            <Row>
              {' '}
              <TextArea
                value={accessibleUsers}
                onChange={(e) => setAccessibleUsers(e.target.value)}
                rows={5}
              />
            </Row>
          </Col>
        </Col>
      </Row>
      <Divider plain />
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
                options = [],
                isRequired,
                isPublic,
                isPrintable,
                sortOrder
              },
              index
            ) => {
              return (
                <tr key={id}>
                  <td>
                    <span className="white">{index + 1}</span>
                  </td>
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
                      <Option value="multi-select">MultiSelect</Option>
                      <Option value="number">Number</Option>
                      <Option value="email">Email</Option>
                      <Option value="password">Password</Option>
                    </Select>
                  </td>
                  <td>
                    <TextArea
                      name="options"
                      value={options.length ? options.join(',') : ''}
                      onChange={(event) =>
                        handleChangeForm(
                          id,
                          'options',
                          event.target.value.split(',')
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
                      defaultValue={parseInt(sortOrder)}
                      required
                      value={parseInt(sortOrder)}
                      onChange={(value) =>
                        handleChangeForm(id, 'sortOrder', value)
                      }
                    />
                  </td>
                  <td className="pointer">
                    {index !== 0 && (
                      <MinusCircleTwoTone
                        onClick={() => handleRemoveRow(id)}
                        style={{ fontSize: '20px' }}
                      />
                    )}
                  </td>
                  {index === data.length - 1 && index !== 9 && (
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
      <div className="btn-container">
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
