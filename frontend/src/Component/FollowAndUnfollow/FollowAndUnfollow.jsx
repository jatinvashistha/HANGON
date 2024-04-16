import { CheckOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

const FollowAndUnfollow = ({
    item, loading, handleFollow
    
}) => {
    const { user } = useSelector((state) => (state.user))
  return (
      <div className='center' style = {{ width : "100%"}}>
          {
              !user?.following?.some((element) => element?.user?._id === item?._id) ?

                  <Button className='loginButton primaryButton' theme="dark" loading={loading[item?._id]} type="primary" onClick={() => { handleFollow(item?._id) }} style={{ width: '150px', fontSize: "17px" }} >
                      <strong>
                          <UserAddOutlined />Follow
                      </strong>


                  </Button>
                  : <Button className='loginButton primaryButton center' theme="dark" onClick={() => { handleFollow(item?._id) }} style={{ borderRadius: "10px", width: '150px', backgroundColor: 'white', textAlign: "center", fontSize: "17px" }} >
                      <strong>
                          <CheckOutlined />
                          Following  </strong>
                  </Button>
          }
      </div>
  )
}

export default FollowAndUnfollow