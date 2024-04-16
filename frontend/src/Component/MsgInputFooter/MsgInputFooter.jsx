import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react'
import { HiMiniPaperClip } from 'react-icons/hi2';
import { checkBlockedUser, checkBlockingYou } from '../../Middleware';
import { useSelector } from 'react-redux';
import './MsgInputFooter.css'
const MsgInputFooter = ({
    chatName,setInput,
    typingHandler,
    input,
    handle,
    sendMsg,
    isSideNavbarVisible
}) => {
    const { user } = useSelector((state) => state.user);
  return (
    <div   className = "MsgFooterLayout">
                {!chatName?.isGroupChat ? !checkBlockedUser(user, chatName?.users?.filter((ele) => ele?._id !== user?._id)[0]) && !checkBlockingYou(user, chatName?.users?.filter((ele) => ele?._id !== user?._id)[0]) &&
              <div
                  className='MsgFooterItems'
              >
                        <Input className='inputFieldMsgFooter' onChange={(e) => {
                            setInput(e.target.value)
                            typingHandler();
                        }} value={input} placeholder="Enter your message here...." disabled={isSideNavbarVisible} />
                        <Button  className='fileSending'type="link" icon={<HiMiniPaperClip style={{ fontSize: "25px", color: "black", overflow: "hidden", }} />}>
                            <input onChange={(e) => handle(e)} type="file" style={{ position: "absolute", left: "21px", width: "15px", zIndex: '11', opacity: "0.00001" }} />
                        </Button>

          <Button className='sentButton button center' onClick={sendMsg} type="link"
          >
            <SendOutlined />
            

            </Button>
                    </div> :
              <div className='MsgFooterItems'>
                  <Input className='inputFieldMsgFooter' onChange={(e) => setInput(e.target.value)} value={input} placeholder="Enter your message here...." disabled={isSideNavbarVisible} />
                  <Button className='fileSending' style={{ fontSize: "25px", color: "black", overflow: "hidden", }} type="link" icon={<HiMiniPaperClip style={{ fontSize: "24px", color: "black", overflow: "hidden" }} />}>
                      <input onChange={(e) => handle(e)} type="file" style={{ position: "absolute", left: "16px", top  : '9px',width: "15px", zIndex: '11', opacity: "0.011" }} />
                        </Button>
                  <Button
                      className='sentButton button center'
                      
                      onClick={sendMsg} type="link" icon={<SendOutlined style={{ fontSize: "20px" }} />} />
                    </div>

                }

</div>
  )
}

export default MsgInputFooter