import React from 'react';
import styles from './Dashboard.module.css';

import HorizontalNavBar from '../../components/HorizontalNavBar/HorizontalNavBar';
import FrozenItemsChart from '../../components/FrozenItemsChart/FrozenItemsChart';
import OtherItemsChart from '../../components/OtherItemsChart/OtherItemsChart';
import TopTenSellingItemsChart from '../../components/TopTenSellingItemsChart/TopTenSellingItemsChart';

const Dashboard = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.mainContents}>
          <HorizontalNavBar />
          <div className={styles.chartsWrapper}>
            <div className={styles.individualChartWrapper}>
              <h2 className={styles.chartTitle}>Frozen Items</h2>
              <FrozenItemsChart />
            </div>
            <div className={styles.individualChartWrapper}>
              <h2 className={styles.chartTitle}>All Items</h2>
              <OtherItemsChart />
            </div>
            <div className={styles.individualChartWrapper}>
              <h2 className={styles.chartTitle}>Top 10 Selling Items</h2>
              <TopTenSellingItemsChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
