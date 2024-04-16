import React, { useEffect, useState } from 'react';
import './Navbar.css';
import image from './Logo.png';
import { MdNightlight } from 'react-icons/md';
import { Avatar, Button, Input } from 'antd';
import { CiLight } from 'react-icons/ci';
import { BellFilled, BellOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { theme1, theme2 } from '../../theme';
import { changeThemee } from '../../Redux/Actions/Theme';
import Search from '../../Pages/Search';
import { Header } from 'antd/es/layout/layout';
import { socket } from '../../Socket';
import { allNotifications } from '../../Redux/Actions/Notifications';
import { useNavigate } from 'react-router-dom';


const Navbar = ({ notficationCount =0}) => {
  const { user, theme } = useSelector((state) => state);

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { notification } = useSelector(state => state.getAllNotifications)
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  // const [notficationCount, setNotificationCount] = useState(0)

  const iconStyle = {
    padding: '8px',
    borderRadius: '4px',
    position: 'absolute',
    width: '50px',
    right: '0',
    fontSize: '15px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '0 15px 15px 0',
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Header className="Navbar">
      <div className='center' >
        <img
          style={{
            width: "120px"
          }}
          src='https://res.cloudinary.com/dk2scs5jz/image/upload/v1709014224/italoojvbis0zshqh0ij.png'
        />
      </div>
      <div>
        <div className=

          {
          ` ${!open ? (isHovered ? "navSearchBarHover" :"navSearchBar"): "navSearching"} navSearch center` 
           
          }
          
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        
        >
          <Search />
      
        </div>

      </div>
      <div className='center notificationBar' >
        {!open && <SearchOutlined className="searchIcon"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}

        />
        }

        <div
          onClick={() => { navigate('/notification') }}
          className='center '
          style = { { position :"relative"}}
        >
          {notficationCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-11px",
                right: "2.4px",
              }}
            >
              <strong style={{ color: 'red', fontSize: "40px" }}>
                •
              </strong>
            </div>
          )}
          <BellFilled style={{ color: "white", fontSize: "20px" }} />
        </div>

      </div>
    </Header>
  );
};

export default Navbar;
