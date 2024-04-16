import React, { useState } from 'react';
import { Form, Input, Upload, Button, Avatar, Card, Col } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { imageUpload } from '../../Middleware';
import { loadUser, updateProfile } from '../../Redux/Actions/User';
import './EditProfile.css';
import { Navigate, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user);
  const [bio, setBio] = useState(user?.bio || '');
  const [charCount, setCharCount] = useState(200 - (user?.bio || '').length);
  const [image, setImage] = useState({
    public_id: user.avatar.public_id,
    url: user?.avatar?.url
  });

  const [formData, setFormData] = useState({
    name: user?.name,
    username: user?.username,
    bio: user?.bio,
    email: user?.email
  });

  const handleBioChange = (e) => {
    const bioText = e.target.value;
    if (bioText.length <= 200) {
      setBio(bioText);
      setCharCount(200 - bioText.length);
    }
  };

  const handleSubmit = async(values) => {
   await dispatch(updateProfile(values.name, values.email, values.username, values.bio, image));
    dispatch(loadUser())
    
    navigate(`/user/${user._id}`)
  };

  const handleImageChange = async (e) => {
    const { data } = await imageUpload(e);
    setImage(data);
  };
  const removePic = () => {
   setImage( {
      public_id:  '1234',
      url: 'http://res.cloudinary.com/dk2scs5jz/image/upload/v1707475411/knlq1pczakdrogedjj2g.png'
    })

}
  const isSaveDisabled = bio.length > 200;

  return (
    <div className='editProfile'>
      <Col style={{ margin: "auto" }} sx={24} md={20} lg={16} xl={12}>
        <Card bodyStyle={{ borderRadius: "23px" }} className='glass  editProfilePicCard scrollbar'>
          <div className="editProfileDiv">
            <div className='center'>
              <Avatar src={image?.url} style={{ border: '3px solid black' }} size={120} icon={<UserOutlined />} />
            </div>
            <Form className='editProfileForm' onFinish={handleSubmit} initialValues={formData}>
              <div className='center buttonsEdit'>
                <Button style={{ width: "120px", position: 'relative', marginRight: "12px" }} className='loginButton profileButton'>
                  <span className='Add'>Change Profile</span>
                  <input onChange={handleImageChange} type='file' style={{ opacity: "0.002" }} />
                </Button>
                <Button
                  onClick={removePic}
                
                  className='loginButton profileButton' style={{ width: "120px", backgroundColor: '#f1f1f1', color: 'red' }}>
                  <span className='redIcon'
                  
                  >Remove</span>
                </Button>
              </div>
              <Form.Item className='formItem' name="name" label="Name">
                <Input className='loginInput editProfileInput' />
              </Form.Item>
              <Form.Item className='formItem' name="email" label="Email">
                <Input className='loginInput editProfileInput' />
              </Form.Item>
              <Form.Item className='formItem' name="username" label="Username">
                <Input className='loginInput editProfileInput' />
              </Form.Item>
              <Form.Item className='formItem' name="bio" label="Bio">
                <Input.TextArea className='loginInput scrollbar editProfileInput textAreaEdit' value={bio} onChange={handleBioChange} />
                <span>{charCount} characters remaining</span>
              </Form.Item>
              <Form.Item>
                <div className="buttonFinal center">
                  <Button className='loginButton' style={{ backgroundColor: "white", width: "150px" }} type="primary"
                    onClick={() =>{navigate(`/user/${user?._id}`)}}
                  
                  
                  >Cancel</Button>
                  <Button style={{ width: "150px", marginLeft: '20px' }} className='loginButton' type="primary" htmlType="submit" disabled={isSaveDisabled}>Save</Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default EditProfile;
