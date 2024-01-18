import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider, theme } from 'antd';
import { RefineThemes } from '@refinedev/antd';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Home from '../../screens/Home/Home';
import Login from '../../screens/Login/Login';
import { SET_DARK_THEME, SET_LIGHT_THEME } from '../../redux/types';

export default function App() {
  const customTheme = useSelector((state: any) => state.themeReducer);
  const dispatch = useDispatch();

  // Set theme from local storage on load
  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light') {
      dispatch({
        type: SET_LIGHT_THEME,
      });
    } else if (storedTheme === 'dark') {
      dispatch({
        type: SET_DARK_THEME,
      });
    }
  }, [dispatch]);

  // Update theme in local storage and document body when it changes
  useEffect(() => {
    window.localStorage.setItem('theme', customTheme);
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
