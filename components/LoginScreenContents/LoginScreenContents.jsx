import React from 'react';
import { useState, useEffect } from 'react';
import './LoginScreenContents.css';
import { baseUrl } from '../../utils/helper';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Input, Button, Alert } from 'antd';
import { GET_USER_DATA } from '../../redux/types';

const LoginScreenContents = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = () => {
    setIsButtonLoading(true);
    if (!phone || !password) {
      if (!phone) setPhoneError(true);
      if (!password) setPasswordError(true);
      setIsButtonLoading(false);
      return;
    }
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/accountant-signin`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          phone,
          password,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          setIsButtonLoading(false);
          toast.error(data.error);
          return;
        }
        setIsButtonLoading(false);
        window.electron.invoke('set-store-value', 'token', data.token);
        dispatch({
          type: GET_USER_DATA,
          payload: data.accountant,
        });
        console.log('signed in');
        navigate('/home');
      })
      .catch((err) => {
        setIsButtonLoading(false);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    window.electron.invoke('get-store-value', 'token').then((token) => {
      if (token) navigate('/home');
    });
  }, []);

  return (
    <>
      <div className="loginScreenContents">
        <div className="mainContents">
          <Input
            onChange={(event) => {
              setPhone(event.target.value);
              setPhoneError(false);
            }}
            type="number"
            size="large"
            placeholder="Phone number"
          />
          {phoneError && (
            <Alert closable message="Phone number is required" type="error" />
          )}
          <Input.Password
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(false);
            }}
            size="large"
            placeholder="Password"
          />
          {passwordError && (
            <Alert closable message="Password is required" type="error" />
          )}
          <Button
            onClick={login}
            loading={isButtonLoading}
            size="large"
            type="primary"
          >
            Log me in
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginScreenContents;
