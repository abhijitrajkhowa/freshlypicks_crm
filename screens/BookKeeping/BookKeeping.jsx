import React from 'react';
import { useState, useEffect } from 'react';
import styles from './BookKeeping.module.css';
import { CommentOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  FloatButton,
  DatePicker,
  Button,
  Table,
  List,
  Switch,
  Input,
  Modal,
} from 'antd';

const BookKeeping = () => {
  const [date, setDate] = useState('');
  const [isImportButtonLoading, setIsImportButtonLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isDeliveredFiltered, setIsDeliveredFiltered] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [modalData, setModalData] = useState([{}]);

  const handleToggleModal = () => {
    setToggleModal((toggleModal) => !toggleModal);
  };

  const toggleDeliveredFilter = () => {
    setIsDeliveredFiltered(!isDeliveredFiltered);
  };

  const floatGroupStyle = {
    right: 48,
  };

  const tableStyle = {
    padding: '16px 16px 0 16px',
  };

  const listItemStyle = {
    width: 300,
  };

  const modalStyle = {};

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
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <List
          size="small"
          bordered
          style={listItemStyle}
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item>
              {index + 1}. {item.name} -- {item.quantity} {item.unit}
            </List.Item>
          )}
        />
      ),
    },

    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'C.R',
      dataIndex: 'cr',
      key: 'cr',
    },
  ];

  const modalTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, index, 'name')}
        />
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, index, 'address')}
        />
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, index, 'items')}
        />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'total',
      key: 'total',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleInputChange(e, index, 'total')}
        />
      ),
    },
    {
      title: 'Delivery Charge',
      dataIndex: 'deliveryCharge',
      key: 'deliveryCharge',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleInputChange(e, index, 'deliveryCharge')}
        />
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleInputChange(e, index, 'discount')}
        />
      ),
    },
    {
      title: 'C.R',
      dataIndex: 'cr',
      key: 'cr',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleInputChange(e, index, 'cr')}
        />
      ),
    },
  ];

  const handleInputChange = (e, index, dataIndex) => {
    const newData = [...modalData];
    if (
      dataIndex === 'total' ||
      dataIndex === 'deliveryCharge' ||
      dataIndex === 'discount' ||
      dataIndex === 'cr'
    ) {
      newData[index][dataIndex] = parseInt(e.target.value);
      setModalData(newData);
      return;
    }
    newData[index][dataIndex] = e.target.value;
    newData[index]['delivered'] = true;
    setModalData(newData);
  };

  const processOrders = () => {
    const processedOrders = [];
    if (isDeliveredFiltered) {
      orders
        .filter((order) => order.delivered)
        .forEach((order, index) => {
          if (order.discount === undefined) order.discount = 0;
          const totalPrice =
            order.total + order.deliveryCharge - order.discount;

          const onlyAddress = order.address.split('--')[0];

          processedOrders[index] = {
            key: index,
            index: index + 1,
            name: order.name,
            address: onlyAddress,
            items: order.items,
            price: totalPrice,
            cr: totalPrice,
          };
        });
    } else {
      orders.forEach((order, index) => {
        if (order.discount === undefined) order.discount = 0;
        const totalPrice = order.total + order.deliveryCharge - order.discount;

        const onlyAddress = order.address?.split('--')[0];

        processedOrders[index] = {
          key: index,
          index: index + 1,
          name: order.name,
          address: onlyAddress,
          items: order.items,
          quantity: order.items,
          price: totalPrice,
          cr: totalPrice,
        };
      });
    }

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
      <Modal
        style={modalStyle}
        width={'80%'}
        centered
        title="Add record"
        okText="Add"
        onCancel={() => {
          setModalData([{}]);
          setToggleModal(false);
        }}
        onOk={() => {
          if (Object.keys(modalData[0]).length === 0) {
            toast.error('Please fill up the form');
            return;
          }
          setOrders([...orders, ...modalData]);
          setModalData([{}]);
          setToggleModal(false);
        }}
        open={toggleModal}
      >
        <Table
          pagination={false}
          dataSource={modalData}
          columns={modalTableColumns}
        />
      </Modal>
      <div className={styles.bookKeeping}>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={floatGroupStyle}
          icon={<PlusOutlined />}
        >
          <FloatButton tooltip=">////<" icon={<CommentOutlined />} />
          <FloatButton
            onClick={handleToggleModal}
            tooltip="Add record"
            icon={<EditOutlined />}
          />
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
          <div className={styles.switchWrapper}>
            <Switch
              checked={isDeliveredFiltered}
              onChange={toggleDeliveredFilter}
              size="lare"
              checkedChildren="Show All Orders"
              unCheckedChildren="Show Delivered Orders"
            />
          </div>
          <Table
            style={tableStyle}
            dataSource={orders ? processOrders() : dataSource}
            columns={columns}
            rowClassName={styles.topAlignedRow}
          />
        </div>
      </div>
    </>
  );
};

export default BookKeeping;
