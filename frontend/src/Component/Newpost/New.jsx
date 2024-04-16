import { BugTwoTone, CloseOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, FloatButton, Form, Image, Input, Space, Upload, message } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uploadPic } from '../../Redux/Actions/Post';
import { imageUpload } from '../../Middleware';
import { useNavigate } from 'react-router-dom';
import SendPost from '../SendPost/SendPost';

const New = ({setVisible}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [loading, setLoading] = useState(false);
    const value = useSelector((state) => state.likeAndUnlike);
    const [loading2 ,setLoading2] = useState(value.loading)
    const [image, setImage] = useState({
        public_id: null,
        url: null,
    })
    const [caption, setCaption] = useState('')
    const handle = async (e) => {
        try {
            setLoading(true);
            const { data } = await imageUpload(e);
           
            setImage({
                public_id : data?.public_id,
                url :  data?.url
            })
    
        } finally {
            setLoading(false);
        }
    };
    useEffect(() =>{
        setLoading2(value.loading)
    },[value])
    const submit = async () => {
        if (caption && image. public_id  ) {
            await dispatch(uploadPic(caption, image));
            navigate("/")
            setVisible(false);
            message.success("Post Uploaded successfully")
        }
        else {
            alert('send image and caption')
        }
    }
    const handleCut  = () => {
        setImage ({
            public_id : null,
            url : null
        })
    }

    const styles = {
        fileInputContainer: {
            display: 'flex',
            alignItems: "center",
            justifyContent: "center", 
            width: "100%",
            marginTop: "10px", 
        },
        customButton: {
            display: 'inline-block',
            padding: '10px 15px',
       
            cursor: 'pointer',
        },
        fileInput: {
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            width: '100%', 
            height: '100%', 
            cursor: 'pointer',
        },
    };

    return (
       
        <Form
            style={{ margin: "30px 0px", width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}  >
                {!image?.url ? 
                <>
             
                <div style  ={{ display : 'flex', alignItems : "center", justifyContent : 'center', width : "100%", height : "200px"}}>
                    Select file to upload
                </div>
             <Button style ={{position : "relative" , margin : "20px auto"}} icon = {<UploadOutlined />} type = "primary"  loading = {loading}>
                <span>
                    Select file 
                </span>
                <input  style = {{opacity : "00" , display : "flex" , left : "0",top  :  "0" , position : "absolute"}} onChange = {(e) => handle(e)} type = "file" />
             </Button>
             </> : 

<>


    <Space style = {{ position : "relative"}}>
    <CloseOutlined onClick={handleCut}  style = {{ position : "absolute" , right : "5px" , top : "10px", zIndex : "111"}} />
<Image  width = {190}  src = {image?.url} ></Image>
        
    </Space>


               
                <Form.Item>

                    <textArea
                    rows = "4"
                    
                        style={
                            {
                                border : "none",
                                borderBottom : "2px solid black",
                                outline  :"none",
                                minWidth : "300px",
                                margin : "20px 0",
                                resize : "none",
                                
                            }
                        }
                    
                        value={caption} placeholder='Enter caption for pic' onChange={(e) => { setCaption(e.target.value) }} type='text' />
                </Form.Item>
                <div
                    style ={{   display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%"
                }}   
                >
                <Button
                    onClick={submit}
                    type = "primary"
                    loading = {loading2}
                    style ={{position : "relative" , margin : "20px auto"}}
                    >Add Post</Button>
                    

                    
                    </div>

                    </>
                    }
            </Form>


// <div>
// <SendPost/>
// </div>

       
    )
}

export default New

