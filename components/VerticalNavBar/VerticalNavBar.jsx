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
  SmileOutlined,
  MoneyCollectOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons';
import { Menu, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { CLEAR_USER_DATA } from '../../redux/types';
import { useNavigate } from 'react-router-dom';

const VerticalNavBar = () => {
  const [toggleModal, setToggleModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  };

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
    getItem('Customers', '/customers', <SmileOutlined />),
    getItem('Expenses', '/expenses', <MoneyCollectOutlined />),
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
    {
      key: 'collapse',
      icon: isCollapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />,
      label: isCollapsed ? 'Expand' : 'Collapse',
    },
  ];

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
    } else if (key === 'collapse') {
      handleCollapse();
    } else {
      navigate(`/home${key}`);
    }
  };

  useEffect(() => {
    navigate(`/home/dashboard`);
  }, []);

  const menuStyle = {
    display: 'flex',
    flexDirection: 'column',
    // width: 220,
    height: '100%',
    fontSize: '16px',
    paddingTop: 24,
  };

  return (
    <>
      <Modal
        title="Log out"
        okText="Yes"
        centered
        onCancel={handleToggleModal}
        onOk={logOut}
        open={toggleModal}
      >
        Are you sure you want to log out?
      </Modal>
      <div className={styles.verticalNavBar}>
        <Menu
          inlineCollapsed={isCollapsed}
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
