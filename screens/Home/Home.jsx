import React from 'react';
import './Home.css';
import { Avatar } from 'antd';

import VerticalNavBar from '../../components/VerticalNavBar/VerticalNavBar';

const Home = () => {
  return (
    <>
      <div className="home">
        <VerticalNavBar />
      </div>
    </>
  );
};

export default Home;
