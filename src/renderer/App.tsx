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
import {
  SET_DARK_THEME,
  SET_LIGHT_THEME,
  SET_COLOR_SCHEME,
} from '../../redux/types';

export default function App() {
  const customTheme = useSelector((state: any) => state.themeReducer);
  const customColorScheme = useSelector((state: any) => state.colorScheme);
  const dispatch = useDispatch();

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
    window.electron
      .invoke('get-store-value', 'colorScheme')
      .then((colorScheme: any) => {
        if (colorScheme !== null) {
          dispatch({
            type: SET_COLOR_SCHEME,
            payload: colorScheme,
          });
        }
      });
  }, [dispatch]);

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
    document.body.style.setProperty(
      '--scrollbar-thumb-color',
      customTheme === 'dark'
        ? 'rgba(255, 255, 255, 0.5)'
        : 'rgba(68, 68, 68, 0.5)',
    );
    document.body.style.setProperty(
      '--scrollbar-thumb-hover-color',
      customTheme === 'dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(68, 68, 68, 0.7)',
    );
  }, [customTheme]);

  const setColorScheme = () => {
    switch (customColorScheme) {
      case 'blue':
        return RefineThemes.Blue;
      case 'purple':
        return RefineThemes.Purple;
      case 'magenta':
        return RefineThemes.Magenta;
      case 'red':
        return RefineThemes.Red;
      case 'orange':
        return RefineThemes.Orange;
      case 'yellow':
        return RefineThemes.Yellow;
    }
  };

  useEffect(() => {
    window.localStorage.setItem('colorScheme', customColorScheme);
  }, [customColorScheme]);

  return (
    <>
      <ConfigProvider
        theme={{
          ...setColorScheme(),
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
