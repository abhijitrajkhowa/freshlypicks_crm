import React from 'react';
import styles from './Login.module.css';

import LoginScreenContents from '../../components/LoginScreenContents/LoginScreenContents';

const Login = () => {
  return (
    <>
      <div className={styles.login}>
        <LoginScreenContents />
      </div>
    </>
  );
};

export default Login;
