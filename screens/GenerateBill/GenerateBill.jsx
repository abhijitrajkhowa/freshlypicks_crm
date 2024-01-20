import React from 'react';
import styles from './GenerateBill.module.css';
import dayjs from 'dayjs';
import { SyncOutlined, DiffOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../utils/helper';

import { DatePicker, Button, Modal, Select } from 'antd';

const GenerateBill = () => {
  const user = useSelector((state) => state.user);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [vendorList, setVendorList] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [vendorBills, setVendorBills] = useState([]);

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  const selectStyle = {
    width: '100%',
    margin: '16px 0 16px 0',
  };

  const getVendorsList = () => {
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/get-vendors-list`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          managerId: user.id,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          return;
        }
        setVendorList(data.vendorsList);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const generateBill = () => {
    const vendor = vendorList.find((vendor) => vendor.name === vendorName);
    setIsGeneratingBill(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/generate-vendor-bill`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: vendor.name,
          vendorId: vendor._id,
          date: new Date(date),
          amount: 0,
          paid: false,
          remarks: 'no remarks',
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsGeneratingBill(false);
          setIsItemModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getVendorBills();
        setIsGeneratingBill(false);
        setIsItemModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsGeneratingBill(false);
        setIsItemModalVisible(false);
      });
  };

  const getVendorBills = () => {
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/get-vendor-bill`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          date: new Date(date),
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          return;
        }
        setVendorBills(data.vendorBills);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const processVendorList = () => {
    const processedVendorList = vendorList?.map((vendor) => {
      return {
        value: vendor.name,
        label: vendor.name,
      };
    });
    return processedVendorList;
  };

  useEffect(() => {
    getVendorsList();
    getVendorBills();
  }, []);

  useEffect(() => {
    getVendorBills();
  }, [date]);

  return (
    <>
      <Modal
        centered
        title="Add to vendor bill"
        open={isItemModalVisible}
        onOk={() => {
          generateBill();
        }}
        okButtonProps={{ loading: isGeneratingBill }}
        okText="Add"
        onCancel={() => setIsItemModalVisible(false)}
      >
        <Select
          defaultValue="Select vendor"
          size="large"
          style={selectStyle}
          allowClear
          loading={vendorList.length === 0}
          onChange={(value) => setVendorName(value)}
          options={processVendorList()}
        />
      </Modal>
      <div className={styles.generateBill}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker
              value={dayjs(date)}
              onChange={onDateChange}
              size="large"
            />
            <Button
              onClick={() => {
                setIsItemModalVisible(true);
              }}
              icon={<DiffOutlined />}
              type="primary"
              size="large"
            >
              Generate bill
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;
