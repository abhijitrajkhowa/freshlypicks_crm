import React from 'react';
import styles from './Setting.module.css';
import { useState, useEffect } from 'react';
import { Radio, Space, Input, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LIGHT_THEME, SET_DARK_THEME } from '../../redux/types';

const Setting = () => {
  const [value, setValue] = useState(0);
  const customTheme = useSelector((state) => state.themeReducer);

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

  useEffect(() => {
    if (customTheme === 'light') {
      setValue(1);
    } else {
      setValue(2);
    }
  }, [customTheme]);

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
