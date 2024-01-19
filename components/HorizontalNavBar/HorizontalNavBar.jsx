import React from 'react';
import { useState, useEffect } from 'react';
import styles from './HorizontalNavBar.module.css';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { Input, Avatar, Popover } from 'antd';

const HorizontalNavBar = () => {
  const colorOptions = [
    { backgroundColor: '#fde3cf', color: '#f56a00' },
    { backgroundColor: '#c1e1c5', color: '#007f5f' },
    { backgroundColor: '#ffd6a5', color: '#f07167' },
    { backgroundColor: '#f0f3bd', color: '#114b5f' },
    { backgroundColor: '#c5dedd', color: '#1a936f' },
    { backgroundColor: '#e2cfea', color: '#4b3f72' },
    { backgroundColor: '#ff9b54', color: '#563f1b' },
    { backgroundColor: '#d0f4de', color: '#3c6e71' },
    { backgroundColor: '#f6f7d7', color: '#3c493f' },
    { backgroundColor: '#f4acb7', color: '#9a348e' },
    { backgroundColor: '#9ef4e6', color: '#562349' },
    { backgroundColor: '#f9cb9c', color: '#f46842' },
    { backgroundColor: '#d2e1dd', color: '#414288' },
    { backgroundColor: '#e3eaa7', color: '#0e9aa7' },
    { backgroundColor: '#ffecd1', color: '#cb8fa9' },
  ];
  const customTheme = useSelector((state) => state.themeReducer);

  const user = useSelector((state) => state.user);
  const [avatarStyle, setAvatarStyle] = useState(colorOptions[0]);

  const inputStyle = {
    width: 300,
    fontFamily: 'Space Grotesk',
  };

  const popoverContent = (
    <div className={styles.popoverWrapper}>
      <div>Name: {user.name}</div>
      <div>Phone number: {user.phone}</div>
    </div>
  );

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * colorOptions.length);
    setAvatarStyle(colorOptions[randomIndex]);
  }, []);

  return (
    <>
      <div
        className={
          customTheme === 'dark'
            ? styles.horizontalNavBarDarkTheme
            : styles.horizontalNavBar
        }
      >
        <div className={styles.mainContents}>
          <h2 className={styles.userName}>Hello, {user.name}</h2>
          <div className={styles.searchBarAndAvatarWrapper}>
            <Input
              size="large"
              style={inputStyle}
              placeholder="Search"
              prefix={<SearchOutlined />}
            />
            <Popover
              placement="leftBottom"
              content={popoverContent}
              title="About me"
            >
              <Avatar shape="square" size={40} style={avatarStyle}>
                <p className={styles.avatarText}>{user.name[0]}</p>
              </Avatar>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default HorizontalNavBar;
