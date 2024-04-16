import ReactDOM from 'react-dom';
import store from './Redux/Store';
import { Provider, useSelector } from 'react-redux';
import React from 'react';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

const RootComponent = () => {
  // const { theme } = useSelector((state) => (state));

  return (

      <ConfigProvider
        // theme={theme?.theme}
        theme="dark"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
  
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <Provider store={store}>
   <RootComponent />
</Provider>  
  );
