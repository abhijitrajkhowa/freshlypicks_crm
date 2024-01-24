import React from 'react';
import { useState, useEffect } from 'react';
import styles from './BookKeeping.module.css';
import {
  CommentOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
  DownOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

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
} from 'antd';

const BookKeeping = () => {
  const user = useSelector((state) => state.user);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [isImportButtonLoading, setIsImportButtonLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isDeliveredFiltered, setIsDeliveredFiltered] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [modalData, setModalData] = useState([{}]);
  const [processedOrders, setProcessedOrders] = useState([]);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorList, setVendorList] = useState([]);
  const [selectedBillItem, setSelectedBillItem] = useState({});
  const [isAddingToVendorBill, setIsAddingToVendorBill] = useState(false);

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

  const spinStyle = {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: 'translate(-50%)',
  };

  const listItemChildStyle = {
    cursor: 'pointer',
  };

  const modalStyle = {};

  const selectStyle = {
    width: '100%',
    margin: '16px 0 16px 0',
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
            <List.Item
              style={listItemChildStyle}
              onClick={() => {
                handleItemClick(item);
              }}
            >
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
      render: (text, record, index) => (
        <Input
          type="number"
          value={processedOrders[index]['cr']}
          onChange={(e) => handleCrInputChange(e, index)}
        />
      ),
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
          placeholder="Name"
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
          placeholder="Address"
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
          placeholder="Items"
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
          placeholder="Price"
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
          placeholder="Delivery Charge"
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
          placeholder="Discount"
          onChange={(e) => handleInputChange(e, index, 'discount')}
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

  const handleCrInputChange = (e, index) => {
    const newProcessedOrders = [...processedOrders];
    newProcessedOrders[index]['cr'] = parseInt(e.target.value);
    setProcessedOrders(newProcessedOrders);
  };

  const processOrders = () => {
    let newProcessedOrders = [];
    if (isDeliveredFiltered) {
      orders
        .filter((order) => order.delivered)
        .forEach((order, index) => {
          const onlyAddress = order.address.split('--')[0];

          newProcessedOrders[index] = {
            key: index,
            index: index + 1,
            name: order.name,
            address: onlyAddress,
            items: order.items,
            price: order.total,
            cr: 0,
          };
        });
    } else {
      orders.forEach((order, index) => {
        const onlyAddress = order.address?.split('--')[0];

        newProcessedOrders[index] = {
          key: index,
          index: index + 1,
          name: order.name,
          address: onlyAddress,
          items: order.items,
          quantity: order.items,
          price: order.total,
          cr: 0,
        };
      });
    }

    setProcessedOrders(newProcessedOrders);
  };

  const handleItemClick = (item) => {
    setIsItemModalVisible(true);
    setSelectedBillItem(item);
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

  const addToVendorBill = (order) => {
    setIsAddingToVendorBill(true);
    const vendor = vendorList.find((vendor) => vendor.name === vendorName);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/add-to-vendor-bill`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          vendorId: vendor._id,
          date: new Date(date),
          order: order,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          setIsAddingToVendorBill(false);
          toast.error(data.error, {
            position: 'bottom-center',
          });
          return;
        }
        setIsAddingToVendorBill(false);
        setSelectedBillItem({});
        setVendorName('');
      })
      .catch((err) => {
        setIsAddingToVendorBill(false);
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
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
    if (date) {
      getOrdersByDate();
    }
  }, [date]);

  useEffect(() => {
    processOrders();
  }, [orders, isDeliveredFiltered]);

  useEffect(() => {
    getVendorsList();
  }, []);

  return (
    <>
      <Modal
        centered
        title="Add to vendor bill"
        open={isItemModalVisible}
        onOk={() => {
          setIsItemModalVisible(false);
          addToVendorBill(selectedBillItem);
        }}
        okButtonProps={{ disabled: !vendorName, loading: isAddingToVendorBill }}
        okText="Add"
        onCancel={() => setIsItemModalVisible(false)}
      >
        <Select
          value={vendorName || 'Select vendor'}
          size="large"
          style={selectStyle}
          allowClear
          loading={vendorList.length === 0}
          onChange={(value) => setVendorName(value)}
          options={processVendorList()}
        />
      </Modal>
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
            <DatePicker
              value={dayjs(date ? date : dayjs().format('YYYY-MM-DD'))}
              onChange={onDateChange}
              size="large"
            />
            <Button
              onClick={() => {
                getOrdersByDate();
              }}
              loading={isImportButtonLoading}
              icon={<SyncOutlined />}
              type="primary"
              size="large"
            >
              {isImportButtonLoading && 'Refreshing'}
              {!isImportButtonLoading && 'Refresh'}
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
          {isImportButtonLoading && <Spin style={spinStyle} size="large" />}
          {!isImportButtonLoading && (
            <Table
              style={tableStyle}
              dataSource={orders ? processedOrders : dataSource}
              columns={columns}
              rowClassName={styles.topAlignedRow}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BookKeeping;
