import React from 'react';
import { useState } from 'react';
import './LoginScreenContents.css';
import { baseUrl } from '../../utils/helper';
import { useDispatch } from 'react-redux';

import { Input, Button, Alert } from 'antd';
import { GET_USER_DATA } from '../../redux/types';

const LoginScreenContents = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const dispatch = useDispatch();

  const login = () => {
    setIsButtonLoading(true);
    fetch(`${baseUrl}/accountant-signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setIsButtonLoading(false);
          <Alert message={data.error} type="error" />;
          return;
        }
        setIsButtonLoading(false);
        <Alert message="Logged in succesfully" type="success" />;
        dispatch({
          type: GET_USER_DATA,
          user: data.accountant,
        });
      });
  };

  return (
    <>
      <div className="loginScreenContents">
        <div className="mainContents">
          <Input
            onChange={(event) => setPhone(event.target.value)}
            type="number"
            size="large"
            placeholder="Phone number"
          />
          <Input.Password
            onChange={(event) => setPassword(event.target.value)}
            size="large"
            placeholder="Password"
          />
          <Button loading={isButtonLoading} size="large" type="primary">
            Log me in
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginScreenContents;
