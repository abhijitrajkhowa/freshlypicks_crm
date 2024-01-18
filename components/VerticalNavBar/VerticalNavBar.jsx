import React from 'react';
import { useState, useEffect } from 'react';
import styles from './VerticalNavBar.module.css';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  DashboardOutlined,
  ReconciliationOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Menu, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { CLEAR_USER_DATA } from '../../redux/types';
import { useNavigate } from 'react-router-dom';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Dashboard', '/dashboard', <DashboardOutlined />),
  getItem('Book Keeping', '/bookKeeping', <BookOutlined />),
  getItem(
    'Pending Payments',
    '/pendingPayments',
    <ExclamationCircleOutlined />,
  ),
  getItem('Generate Bill', '/generateBill', <ReconciliationOutlined />),
  getItem('Miscellaneous', '/miscellaneous', <AppstoreOutlined />),
  {
    type: 'divider',
  },
  getItem(
    'Others',
    'grp',
    null,
    [
      getItem('Setting', '/setting', <SettingOutlined />),
      getItem('Freshly picks', '/freshlyPicks', <MailOutlined />),
      getItem('Log out', 'Log out', <LogoutOutlined />),
    ],
    'group',
  ),
];

const VerticalNavBar = () => {
  const [toggleModal, setToggleModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggleModal = () => {
    setToggleModal((toggleModal) => !toggleModal);
  };

  const logOut = () => {
    window.electron.invoke('remove-store-value', 'token');
    dispatch({ type: CLEAR_USER_DATA });
    navigate('/');
  };

  const onClick = ({ key }) => {
    if (key === 'Log out') {
      handleToggleModal();
    } else {
      navigate(`/home${key}`);
    }
  };

  useEffect(() => {
    navigate(`/home/dashboard`);
  }, []);

  const menuStyle = {
    width: 256,
    height: '100%',
    fontSize: '16px',
  };

  return (
    <>
      <Modal
        title="Log out"
        okText="Yes"
        onCancel={handleToggleModal}
        onOk={logOut}
        open={toggleModal}
      >
        Are you sure you want to log out?
      </Modal>
      <div className={styles.verticalNavBar}>
        <Menu
          onClick={onClick}
          style={menuStyle}
          defaultSelectedKeys={['/dashboard']}
          mode="inline"
          items={items}
        />
      </div>
    </>
  );
};

export default VerticalNavBar;
