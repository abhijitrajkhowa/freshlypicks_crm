import React from 'react';
import styles from './Setting.module.css';
import { useState } from 'react';
import { Radio, Space, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { SET_LIGHT_THEME, SET_DARK_THEME } from '../../redux/types';

const Setting = () => {
  const [value, setValue] = useState(1);
  const dispatch = useDispatch();

  const onChange = (e) => {
    setValue(e.target.value);

    switch (e.target.value) {
      case 1:
        dispatch({ type: SET_LIGHT_THEME });
        break;
      case 2:
        dispatch({ type: SET_DARK_THEME });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className={styles.setting}>
        <div className="mainContents">
          <div className="customizationSection">
            <h2>Customization</h2>
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio value={1}>Light Mode</Radio>
                <Radio value={2}>Dark Mode</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
