import React from 'react';
import styles from './Dashboard.module.css';

import HorizontalNavBar from '../../components/HorizontalNavBar/HorizontalNavBar';
import FrozenItemsChart from '../../components/FrozenItemsChart/FrozenItemsChart';
import OtherItemsChart from '../../components/OtherItemsChart/OtherItemsChart';
import TopTenSellingItemsChart from '../../components/TopTenSellingItemsChart/TopTenSellingItemsChart';
import TopTenSellingCategoriesChart from '../../components/TopTenSellingCategoriesChart/TopTenSellingCategoriesChart';
import ItemWiseSalesChart from '../../components/ItemWiseSalesChart/ItemWiseSalesChart';

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
            <div className={styles.individualChartWrapper}>
              <h2 className={styles.chartTitle}>Top 10 Selling Categories</h2>
              <TopTenSellingCategoriesChart />
            </div>
            <div className={styles.individualChartWrapper}>
              <h2 className={styles.chartTitle}>Item Wise Sales</h2>
              <ItemWiseSalesChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
