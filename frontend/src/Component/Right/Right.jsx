import { Avatar, Card, Divider, Typography } from 'antd'

import React from 'react'
import { useSelector } from 'react-redux'

const Right = () => {
    const { user } = useSelector((state) => (state.user))

    return (
        <Card
        style={{marginTop  :'20px'}}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <Avatar
                    src={user?.avatar?.url}
                    style={{
                        width: "100px", height: "100px",


                    }}

                />

                <div>
                    <Typography.Title style={{ fontSize: "20px", textAlign: "center", marginTop: "12px", textAlign: "center" }}>
                        {user.name}
                    </Typography.Title>
                    <Typography>
                        {user.bio}
                        asdfs
                    </Typography>
                </div>
                <Divider />    
            </div>
            <div style = {{display : 'flex' ,justifyContent : 'space-evenly'}}>
           <div  style={{ fontSize: "15px",textAlign: "center" }} >
            <Typography.Title>
                {user?.following.length}
            </Typography.Title>
            Follower
           </div>
           <div  style={{ fontSize: "15px",textAlign: "center" }} >
            <Typography.Title>
                {user?.following.length}
            </Typography.Title>
            
            Follower
           </div>
           <div  style={{ fontSize: "15px",textAlign: "center" }} >
            <Typography.Title>
                {user?.posts.length}
       
            </Typography.Title>

         Post
           </div>
           </div>

        </Card>
    )
}

export default Right