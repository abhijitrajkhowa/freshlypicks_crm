import React from 'react';
import styles from './Dashboard.module.css';

import HorizontalNavBar from '../../components/HorizontalNavBar/HorizontalNavBar';
import FrozenItemsChart from '../../components/FrozenItemsChart/FrozenItemsChart';
import OtherItemsChart from '../../components/OtherItemsChart/OtherItemsChart';

const Dashboard = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.mainContents}>
          <HorizontalNavBar />
          <div className={styles.chartsWrapper}>
            <div className={styles.frozenItemWrapper}>
              <h2 className={styles.chartTitle}>Frozen Items</h2>
              <FrozenItemsChart />
            </div>
            <div className={styles.otherItemsWrapper}>
              <h2 className={styles.chartTitle}>Other Items</h2>
              <OtherItemsChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
