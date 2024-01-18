import React from 'react';
import './Home.css';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../Dashboard/Dashboard';
import BookKeeping from '../BookKeeping/BookKeeping';
import PendingPayments from '../PendingPayments/PendingPayments';
import GenerateBill from '../GenerateBill/GenerateBill';
import Miscellaneous from '../Miscellaneous/Miscellaneous';

import VerticalNavBar from '../../components/VerticalNavBar/VerticalNavBar';

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="verticalNavWrapper">
          <VerticalNavBar />
        </div>
        <div className="mainContents">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookKeeping" element={<BookKeeping />} />
            <Route path="pendingPayments" element={<PendingPayments />} />
            <Route path="generateBill" element={<GenerateBill />} />
            <Route path="miscellaneous" element={<Miscellaneous />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Home;
