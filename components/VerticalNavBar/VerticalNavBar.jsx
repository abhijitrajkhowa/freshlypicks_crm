import React from 'react';
import './VerticalNavBar.css';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  DashboardOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

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
  getItem('Dashboard', 'sub1', <DashboardOutlined />, [
    getItem(
      'Chart',
      'g1',
      null,
      [getItem('Weekly Chart', '1'), getItem('Daily Chart', '2')],
      'group',
    ),
    getItem(
      'Item 2',
      'g2',
      null,
      [getItem('Option 3', '3'), getItem('Option 4', '4')],
      'group',
    ),
  ]),
  getItem('Book Keeping', 'sub2', <BookOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [
      getItem('Option 7', '7'),
      getItem('Option 8', '8'),
    ]),
  ]),

  getItem('Pending Payments', 'sub4', <ExclamationCircleOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
  getItem('Generate Bill', 'sub5', <ReconciliationOutlined />, [
    getItem('Option 13', '13'),
    getItem('Option 14', '14'),
    getItem('Option 15', '15'),
    getItem('Option 16', '16'),
  ]),
  getItem('Miscellaneous', 'sub6', <AppstoreOutlined />, [
    getItem('Option 17', '17'),
    getItem('Option 18', '18'),
    getItem('Option 19', '19'),
    getItem('Option 20', '20'),
  ]),
  {
    type: 'divider',
  },
  getItem(
    'Others',
    'grp',
    null,
    [
      getItem('Setting', 'Setting', <SettingOutlined />),
      getItem('Freshly picks', 'Freshly picks', <MailOutlined />),
    ],
    'group',
  ),
];

const VerticalNavBar = () => {
  const onClick = (e) => {
    if (e.key === 'sub1') {
      console.log('sub1');
    }
  };

  const styles = {
    menuStyle: {
      width: 256,
      height: '100%',
      fontSize: '16px',
    },
  };

  return (
    <>
      <div className="verticalNavBar">
        <Menu
          onClick={onClick}
          style={styles.menuStyle}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </div>
    </>
  );
};

export default VerticalNavBar;
