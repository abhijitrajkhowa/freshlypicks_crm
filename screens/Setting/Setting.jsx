import React from 'react';
import styles from './Setting.module.css';
import { useState, useEffect } from 'react';
import { Radio, Space, Input, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  SET_LIGHT_THEME,
  SET_DARK_THEME,
  SET_COLOR_SCHEME,
} from '../../redux/types';

const Setting = () => {
  const [value, setValue] = useState(0);
  const [colorScheme, setColorScheme] = useState('');
  const customTheme = useSelector((state) => state.themeReducer);
  const customColorScheme = useSelector((state) => state.colorScheme);

  const dispatch = useDispatch();

  const onChange = (e) => {
    setValue(e.target.value);

    switch (e.target.value) {
      case 1:
        dispatch({ type: SET_LIGHT_THEME });
        window.electron.invoke('set-store-value', 'theme', 'light');
        break;
      case 2:
        dispatch({ type: SET_DARK_THEME });
        window.electron.invoke('set-store-value', 'theme', 'dark');
        break;
      default:
        break;
    }
  };

  const onColorChange = (e) => {
    setColorScheme(e.target.value);
    dispatch({ type: SET_COLOR_SCHEME, payload: e.target.value });
    window.electron.invoke('set-store-value', 'colorScheme', e.target.value);
  };

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
      .then((storedColorScheme) => {
        if (storedColorScheme) {
          dispatch({ type: SET_COLOR_SCHEME, payload: storedColorScheme });
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (customTheme === 'light') {
      setValue(1);
    } else {
      setValue(2);
    }
  }, [customTheme]);

  useEffect(() => {
    if (customColorScheme) {
      setColorScheme(customColorScheme);
    }
  }, [customColorScheme]);

  return (
    <>
      <div className={styles.setting}>
        <div className={styles.mainContents}>
          <div className={styles.customizationSection}>
            <h2>Customization</h2>
            <Divider />
            <div className={styles.themeHeaderAndContentsWrapper}>
              <h3>Theme</h3>
              <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                  <Radio value={1}>Light Mode</Radio>
                  <Radio value={2}>Dark Mode</Radio>
                </Space>
              </Radio.Group>
            </div>
            <Divider />
            <div className={styles.themeHeaderAndContentsWrapper}>
              <h3>Color scheme</h3>
              <Radio.Group onChange={onColorChange} value={colorScheme}>
                <Space direction="vertical">
                  <Radio value="blue">Blue</Radio>
                  <Radio value="purple">Purple</Radio>
                  <Radio value="magenta">Magenta</Radio>
                  <Radio value="red">Red</Radio>
                  <Radio value="orange">Orange</Radio>
                  <Radio value="yellow">Yellow</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
