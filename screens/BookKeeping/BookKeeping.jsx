import React from 'react';
import { useState, useEffect } from 'react';
import styles from './BookKeeping.module.css';
import { CommentOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FloatButton, DatePicker, Button, Table, List } from 'antd';

const BookKeeping = () => {
  const [date, setDate] = useState('');
  const [isImportButtonLoading, setIsImportButtonLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const floatGroupStyle = {
    right: 48,
  };

  const tableStyle = {
    padding: '16px 16px 0 16px',
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
      render: (item, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: 'red',
          }}
        >
          <div key={index}>{item}</div>
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: 'red',
          }}
        >
          <div key={index}>{item}</div>
        </div>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (item, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: 'red',
          }}
        >
          <div key={index}>{item}</div>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <List
          size="small"
          bordered
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item>
              {index + 1}. {item.name}
            </List.Item>
          )}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (item, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: 'red',
          }}
        >
          <div key={index}>{item}</div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (item, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: 'red',
          }}
        >
          <div key={index}>{item}</div>
        </div>
      ),
    },
    {
      title: 'C.R',
      dataIndex: 'cr',
      key: 'cr',
      render: (item, record, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: 'red',
          }}
        >
          <div key={index}>{item}</div>
        </div>
      ),
    },
  ];

  const processOrders = () => {
    const processedOrders = [];
    orders.forEach((order, index) => {
      const totalPrice = order.total + order.deliveryCharge + order.discount;

      processedOrders[index] = {
        key: index,
        index: index + 1,
        name: order.name,
        address: order.address,
        items: order.items,
        quantity: order.items.length,
        price: totalPrice,
        cr: totalPrice,
      };
    });
    return processedOrders;
  };

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  const getOrdersByDate = () => {
    setIsImportButtonLoading(true);
    const formattedDate = moment(date, 'YYYY-MM-DD').format('D/M/YYYY');
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/get-orders-by-date`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          date: formattedDate,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          setIsImportButtonLoading(false);
          toast.error(data.error, {
            position: 'bottom-center',
          });
          return;
        }
        setIsImportButtonLoading(false);
        setOrders(data.orders);
      })
      .catch((err) => {
        setIsImportButtonLoading(false);
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const onImportButtonClick = () => {
    getOrdersByDate();
  };

  return (
    <>
      <div className={styles.bookKeeping}>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={floatGroupStyle}
          icon={<PlusOutlined />}
        >
          <FloatButton tooltip=">////<" icon={<CommentOutlined />} />
          <FloatButton tooltip="Add record" icon={<EditOutlined />} />
        </FloatButton.Group>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker onChange={onDateChange} size="large" />
            <Button
              onClick={onImportButtonClick}
              loading={isImportButtonLoading}
              type="primary"
              size="large"
              icon={<PlusOutlined />}
            >
              Import
            </Button>
          </div>
          <Table
            style={tableStyle}
            dataSource={orders ? processOrders() : dataSource}
            columns={columns}
          />
        </div>
      </div>
    </>
  );
};

export default BookKeeping;
