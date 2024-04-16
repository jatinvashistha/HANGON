import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, Divider, message } from 'antd';
import { LockOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import './AccountModal.css';
import { changePassword, loadUser } from '../../Redux/Actions/User';
import axios from 'axios';

const AccountModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const changePasswor = async (e) => {
    e.preventDefault();
    try {
      const formValues = await form.validateFields();

      if (formValues.newPassword !== formValues.confirmNewPassword) {
        throw new Error('The two passwords do not match');
      }

      if (formValues.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      await axios.put(
        "http://localhost:4000/api/v1/update/password",
        {
          oldPassword: formValues.oldPassword,
          newPassword: formValues.newPassword,
        },
        {
          withCredentials: true,
        }
      ).then((res) => {
        message.success("Password changed Successfully");
        setShowPasswordFields(false); // Hide password fields
      }).catch((e) => {
        message.error("Old password is wrong");
      })
    } catch (error) {
      console.error('Validation failed:', error.message);
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordFields(!showPasswordFields);
    form.resetFields(); // Reset form fields
  };

  const handleDeleteAccount = () => {
    // Implement delete account action here
  };

  const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const logout = () => {
    Modal.confirm({
      title: 'Are you sure to logout?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteCookie('token');
        dispatch(loadUser());
        navigate("/")
      },
      onCancel() {
      },
    });
  };

  return (
    <Modal
      visible={visible}
      title="Account Settings"
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        {showPasswordFields ? (
          <>
            <Form.Item
              label="Old Password"
              name="oldPassword"
              rules={[{ required: true, message: 'Please enter your old password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Old Password"
                style={{ width: "100%" }}
                className='loginInput'
              />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters long' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="New Password"
                className='loginInput'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Confirm New Password"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm New Password"
                style={{ width: "100%" }}
                className='loginInput'
              />
            </Form.Item>
            <Space style={{ marginTop: "20px", display: 'flex', justifyContent: "flex-end", width: "100%" }}>
              <Button
                onClick={changePasswor}
                className='loginButton'
                type="primary">Change Password</Button>

              <Button
                className='loginButton'
                style={{ backgroundColor: "white", width: '130px' }}
                onClick={handlePasswordChange}
              >Cancel </Button>
            </Space>
          </>
        ) : (
          <>
            <Divider />
            <div className='arrow' onClick={handlePasswordChange}>
              <span>
                Change Password </span> <span> <IoIosArrowForward /> </span>
            </div>
            <Divider />
            <div className='arrow' onClick={() => { navigate("/likedposts") }}>
              <span>
                Liked Post </span>
              <span> <IoIosArrowForward /> </span>
            </div>
            <Divider />
            <div className='arrow' onClick={() => { navigate("/commentedposts") }}>
              <span>
                Commented Post
              </span>
              <span> <IoIosArrowForward /> </span>
            </div>
            <Divider />
            <div className='arrow' onClick={() => { navigate("/blockeduser") }}>
              <span>
                Blocked User
              </span>
              <span> <IoIosArrowForward /> </span>
            </div>
            <Divider />
            <Button
              style={{
                width: "auto"
              }}
              className='loginButton logoutButton' type="danger" onClick={logout} >
              Log Out
            </Button>
            {/* <Button type="danger" onClick={handleDeleteAccount} icon={<DeleteOutlined />}>
              Delete Account
            </Button> */}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AccountModal;
