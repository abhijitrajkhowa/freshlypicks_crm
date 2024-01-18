import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider, theme } from 'antd';
import { RefineThemes } from '@refinedev/antd';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Home from '../../screens/Home/Home';
import Login from '../../screens/Login/Login';

export default function App() {
  const customTheme = useSelector((state: any) => state.themeReducer);

  useEffect(() => {
    document.body.style.setProperty(
      'background-color',
      customTheme === 'dark' ? '#2C2C2C' : '#fafafa',
    );
    document.body.style.setProperty(
      '--text-color',
      customTheme === 'dark' ? '#fafafa' : '#2C2C2C',
    );
  }, [customTheme]);

  return (
    <>
      <ConfigProvider
        theme={{
          ...RefineThemes.Magenta,
          algorithm:
            customTheme === 'dark'
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home/*" element={<Home />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}
