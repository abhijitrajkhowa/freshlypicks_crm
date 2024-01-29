import React from 'react';
import styles from './Home.module.css';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../Dashboard/Dashboard';
import BookKeeping from '../BookKeeping/BookKeeping';
import PendingPayments from '../PendingPayments/PendingPayments';
import GenerateBill from '../GenerateBill/GenerateBill';
import Miscellaneous from '../Miscellaneous/Miscellaneous';
import Setting from '../Setting/Setting';
import Customers from '../Customers/Customers';
import Expenses from '../Expenses/Expenses';

import VerticalNavBar from '../../components/VerticalNavBar/VerticalNavBar';

const Home = () => {
  return (
    <>
      <div className={styles.home}>
        <div className={styles.verticalNavWrapper}>
          <VerticalNavBar />
        </div>
        <div className={styles.mainContents}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookKeeping" element={<BookKeeping />} />
            <Route path="pendingPayments" element={<PendingPayments />} />
            <Route path="generateBill" element={<GenerateBill />} />
            <Route path="miscellaneous" element={<Miscellaneous />} />
            <Route path="setting" element={<Setting />} />
            <Route path="customers" element={<Customers />} />
            <Route path="expenses" element={<Expenses />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Home;
