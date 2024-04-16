import { Button, Col, Input, Form, Layout, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { checkemail, checkusername, loadUser, signUpUser } from '../Redux/Actions/User';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const navigate = useNavigate();
    const [validUsername, setValidUsername] = useState(true);
    const [Username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [validData, setValidData] = useState(false);
    const [loading, setLoading] = useState(false); 
    const user = useSelector((state) => (state?.user))
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const res = await signUpUser(email, values.password, Username, values.name)
        if (res?.token) {
            message.success("Sign up successfully.")
            dispatch(loadUser());
            navigate('/')
        } else {
            message.error("Something went wrong , try again");
            navigate('/signup')
        }
    }

    const validatePassword = (key, value) => {
        if (value && value.length >= 6) {
            return Promise.resolve();
        }
        return Promise.reject('Minimum 6 characters');
    };

    const checkValidUsername = async (e) => {
        const value = e.target.value; // Extract the value from the event
        setUsername(value); // Update the state with the new value
        setLoading(true);
        const data = await checkusername(value);
        setLoading(false);
        if (data?.success) {
            setValidUsername(true);
        } else {
            setValidUsername(false);
        }
    }

    const checkValidEmail = async (value) => {
        setEmail(value)
        setLoading(true);
        const data = await checkemail(value);
        setLoading(false);
        if (data?.success) {
            setValidEmail(true)
        } else {
            setValidEmail(false)
        }
    }

    const triggerNext = (e) => {
        e.preventDefault();
        setValidData(true);
    }

    return (
        <Layout className='loginLayout' >
            <div className='loginBox'  >
                <Col xs={0} md={12}  >
                    <div className='center'>
                        <div style={{ marginLeft: '40px' }}>
                            <Typography.Title style={{ fontSize: '3em', color: "white", fontWeight: 'bold', textShadow: '0 0 25px black' }} >
                                Share <span style={{ color: 'white', textShadow: '1px 0 5px white' }}>epic</span> <br />
                                moments with <span style={{ color: 'white' }}>your close ones</span>
                            </Typography.Title>
                        </div>
                    </div>
                </Col >
                <Col xs={24} md={12} className="loginCol2" >
                    <div className='loginLogo' >
                        <img
                            style={{
                                width: "120px"
                            }}
                            src='https://res.cloudinary.com/dk2scs5jz/image/upload/v1709014224/italoojvbis0zshqh0ij.png'
                        />
                    </div>
                    <div>
                        <Typography.Title class="loginHeading">
                            Sign Up
                        </Typography.Title>
                        <Form
                            className='loginForm center'
                            onFinish={onFinish}
                        >
                            {!(validData) ?
                                <>
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please Enter your username"
                                            }
                                        ]}
                                    >
                                        <Input
                                            value={Username}
                                            onChange={(e) => { checkValidUsername(e) }} className='loginInput' type='text' placeholder='Username' />
                                        {Username.length > 0 ? (validUsername ? <div className='success'>Username is available</div> : <div className='failure'>Username is not available</div>) : ""}
                                    </Form.Item>
                                    <Form.Item
                                        value={email}
                                        onChange={(e) => { checkValidEmail(e.target.value) }}
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please Enter your Email address"
                                            }
                                        ]}
                                    >
                                        <Input
                                            className='loginInput' type='email' placeholder='Email' />
                                        {email.length > 0 ? (validEmail ? <div className='success'>Email is available</div> : <div className='failure'>Email is not available</div>) : ""}
                                    </Form.Item>
                                    <Button disabled={!(validEmail && validUsername)} htmlType="submit" type="primary" onClick={(e) => { triggerNext(e) }}
                                    
                                        // className='loginButton center'
                                        className={`${!(validEmail && validUsername) ?"disableButton" : ""} loginButton center`}
                                        
                                    
                                    
                                    > <b>Next </b></Button>
                                    <div className='loginSignup'> <Typography.Text className='loginSignup'> Already have account : </Typography.Text> <Link href='/' style={{ color: "rgb(100, 197, 232)" }}> Login here </Link></div>
                                </>
                                :
                                <>
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please Enter your name"
                                            }
                                        ]}
                                    >
                                        <Input className='loginInput' type='text' placeholder='Name' />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please Enter your password"
                                            },
                                            {
                                                validator: validatePassword,
                                            },
                                        ]}
                                    >
                                        <Input.Password className='loginInput' placeholder='Password' />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmPassword"
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject('The two password do not match!');
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password className='loginInput' placeholder='Confirm Password' />
                                    </Form.Item>
                                    <Button htmlType="submit" type="primary" loading={loading || user?.loading} className='loginButton center'> <b>Register </b></Button>
                                </>
                            }
                        </Form>
                    </div>
                </Col>
            </div>
        </Layout>
    )
}

export default Signup;
