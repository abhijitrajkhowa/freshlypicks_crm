import React from 'react';
import styles from './Dashboard.module.css';

import HorizontalNavBar from '../../components/HorizontalNavBar/HorizontalNavBar';

const Dashboard = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.mainContents}>
          <HorizontalNavBar />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
