import React from 'react';
import styles from './PendingPayments.module.css';
import { useState, useEffect } from 'react';
import {
  CommentOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
  DownOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import {
  FloatButton,
  DatePicker,
  Button,
  Table,
  List,
  Switch,
  Input,
  Modal,
  Spin,
  Dropdown,
  Typography,
  Space,
  Menu,
  Select,
  Descriptions,
  Popconfirm,
} from 'antd';

const PendingPayments = () => {
  const user = useSelector((state) => state.user);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isReloadButtonLoading, setIsReloadButtonLoading] = useState(false);
  const [allPendingOrders, setAllPendingOrders] = useState([]);
  const [processedPendingOrders, setProcessedPendingOrders] = useState([]);

  const tableStyle = {
    padding: '16px 16px 0 16px',
  };

  const listItemStyle = {
    width: 300,
  };

  const listItemChildStyle = {
    cursor: 'pointer',
  };

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'Index No.',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Telephone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items, record) => (
        <List
          size="small"
          bordered
          style={listItemStyle}
          dataSource={items}
          renderItem={(item, index) => {
            return (
              <List.Item style={listItemChildStyle} onClick={() => {}}>
                {index + 1}. {item.name} -- {item.quantity} {item.unit}
              </List.Item>
            );
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Are you sure to change the status?"
              onConfirm={() => {
                changePaymentStatus(record._id, 'Paid');
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" size="small">
                Mark as Paid
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const changePaymentStatus = (orderId, status) => {
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/set-payment-pending-order`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          orderId: orderId,
          status: status,
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
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getPendingPayments();
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const processPendingOrders = () => {
    if (allPendingOrders.orders) {
      const processedPendingOrders = allPendingOrders.orders.map(
        (order, index) => {
          const items = order.items.map((item, index) => {
            return {
              ...item,
              key: index,
            };
          });
          const onlyAddress = order.address.split('--')[0];

          return {
            ...order,
            key: index,
            index: index + 1,
            items,
            address: onlyAddress,
            price: order.total.toLocaleString(),
            status: order.paymentStatus,
          };
        },
      );

      setProcessedPendingOrders(processedPendingOrders);
    }
  };

  const getPendingPayments = async () => {
    window.electron
      .invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/get-all-pending-orders`,
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsReloadButtonLoading(false);
          setIsInitialLoading(false);

          return;
        }
        setAllPendingOrders(data);
        setIsReloadButtonLoading(false);
        setIsInitialLoading(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsReloadButtonLoading(false);
        setIsInitialLoading(false);
      });
  };

  useEffect(() => {
    getPendingPayments();
  }, []);

  useEffect(() => {
    processPendingOrders();
  }, [allPendingOrders]);

  return (
    <>
      <div className={styles.pendingPayments}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <Button
              onClick={() => {
                getPendingPayments();
                setIsReloadButtonLoading(true);
              }}
              disabled={isInitialLoading}
              loading={isReloadButtonLoading}
              icon={<SyncOutlined />}
              type="primary"
              size="large"
            >
              {isReloadButtonLoading && 'Refreshing'}
              {!isReloadButtonLoading && 'Refresh'}
            </Button>
          </div>
          <Table
            style={tableStyle}
            loading={isInitialLoading || isReloadButtonLoading}
            dataSource={allPendingOrders ? processedPendingOrders : dataSource}
            columns={columns}
            rowClassName={styles.topAlignedRow}
          />
        </div>
      </div>
    </>
  );
};

export default PendingPayments;
