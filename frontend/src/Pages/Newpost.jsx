import React from 'react'
import New from '../Component/Newpost/New'


const Newpost = ({setVisible}) => {
  return (
    <div>
      <New setVisible = {setVisible}/>
 
    </div>
  )
}

export default Newpost