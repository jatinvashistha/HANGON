import { Button, Col, Flex, Form, Grid, Image, Input, Layout, Typography, message } from 'antd'

import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { loadUser, loginUser } from '../Redux/Actions/User';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => (state?.user))
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const res = await loginUser(values.email, values.password);
        if (res?.token) {
            message.success("Logged in successfully.")
            dispatch(loadUser());
        } else {
            message.error("Email or password is wrong ");   
        }           
    };

    const validatePassword = (key, value) => {
        if (value && value.length >= 6) {
            return Promise.resolve();
        }
        return Promise.reject('Mininum 6 characters');
    };
    return (
        <Layout className='loginLayout' >

            <div className='loginBox'  >
                <Col xs={0} md={12} >
                    <div className='center'>
                        <div style={{ marginLeft: '40px' }}>
                            <Typography.Title style={{ fontSize: '3em', color: "white", fontWeight: 'bold', textShadow: '0 0 25px black' }} >
                                Share <span style={{ color: 'white', textShadow: '1px 0 5px white' }}>epic</span> <br />
                                moments with <span style={{ color: 'white' }}>your close ones</span>
                            </Typography.Title>
                        </div>

                    </div>
                </Col>
                <Col className="loginCol2" xs={24} md={12}>
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
                            Login
                        </Typography.Title>
                        <Form
                            className='loginForm center'
                            onFinish={onFinish}

                        >
                            <Form.Item

                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Email address"
                                    }
                                ]}
                            >
                                <Input className='loginInput' type='email' placeholder='Email' />
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
                            <span onClick={ () =>{navigate("/forgetpassword")}} className="loginForgot">
                                Forgot Password?
                            </span>
                            <Button
                                loading={user.loading}


                                className='loginButton center' htmlType="submit" type="primary" > <b> Continue</b></Button>
                            <div className='loginSignup' > <Typography.Text className='loginSignup'> Don't have account?</Typography.Text> <Link href='/signup' style={{ color: "rgb(100, 197, 232)" }}> Register here </Link></div>

                        </Form>

                    </div>
                </Col>
            </div>

        </Layout>
    )
}

export default Login