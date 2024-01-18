import React from 'react';
import styles from './HorizontalNavBar.module.css';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { Input, Avatar, Popover } from 'antd';

const HorizontalNavBar = () => {
  const user = useSelector((state) => state.user);

  const inputStyle = {
    width: 300,
    fontFamily: 'Space Grotesk',
  };

  const avatarStyle = {
    backgroundColor: '#fde3cf',
    color: '#f56a00',
  };

  const popoverContent = (
    <div className={styles.popoverWrapper}>
      <div>Name: {user.name}</div>
      <div>Phone number: {user.phone}</div>
    </div>
  );

  return (
    <>
      <div className={styles.horizontalNavBar}>
        <div className={styles.mainContents}>
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
    </>
  );
};

export default HorizontalNavBar;
