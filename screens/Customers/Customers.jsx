import React from 'react';
import { useState, useEffect } from 'react';
import styles from './Customers.module.css';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SyncOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { Table, Input, Button, Modal, Descriptions, List } from 'antd';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isCustomerInfoLoading, setIsCustomerInfoLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [currentCustomerInfo, setCurrentCustomerInfo] = useState({});
  const [isCurrentUserOrdersLoading, setIsCurrentUserOrdersLoading] =
    useState(false);
  const [currentUserOrders, setCurrentUserOrders] = useState([]);
  const [loadingButtons, setLoadingButtons] = useState({});
  const [isRefreshButtonLoading, setIsRefreshButtonLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [pageSize, setPageSize] = useState(10);

  const getAllUsers = (page = 1, limit = pageSize) => {
    setIsCustomerInfoLoading(true);
    window.electron
      .invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/crm/get-all-users?page=${page}&limit=${limit}`,
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsCustomerInfoLoading(false);
          setIsRefreshButtonLoading(false);

          setInitialLoad(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setIsCustomerInfoLoading(false);
        setIsRefreshButtonLoading(false);
        setInitialLoad(false);
        setCustomers(data.users);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsCustomerInfoLoading(false);
        setIsRefreshButtonLoading(false);
        setInitialLoad(false);
      });
  };

  const getCurrentUserOrders = async (phone) => {
    setIsCurrentUserOrdersLoading(true);
    return window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/get-user-orders`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          phone: phone,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsCurrentUserOrdersLoading(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setIsCurrentUserOrdersLoading(false);
        setCurrentUserOrders(data.orders);
        // Calculate the most ordered product
        let productCounts = {};

        data.orders.forEach((order) => {
          order.items.forEach((product) => {
            if (productCounts[product._id]) {
              productCounts[product._id].count += 1;
            } else {
              productCounts[product._id] = {
                count: 1,
                name: product.name,
              };
            }
          });
        });

        let mostOrderedProduct = Object.values(productCounts).reduce(
          (a, b) => (a.count > b.count ? a : b),
          { count: 0 },
        );
        return mostOrderedProduct;
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsCurrentUserOrdersLoading(false);
      });
  };
  const getCurrentUserOrdersCount = async (phone) => {
    return window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/get-user-orders`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          phone: phone,
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
        return data.orderCount;
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const processCustomersData = () => {
    const processedData = customers
      .filter((customer) => customer.name && customer.name.trim() !== '')
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          customer.phone
            .toString()
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          (
            customer.house +
            ', ' +
            customer.street +
            ', ' +
            customer.city +
            ', ' +
            customer.state +
            ', ' +
            customer.pin
          )
            .toLowerCase()
            .includes(searchInput.toLowerCase()),
      )
      .map((customer) => {
        const address =
          customer.house +
          ', ' +
          customer.street +
          ', ' +
          customer.city +
          ', ' +
          customer.state +
          ', ' +
          customer.pin;
        return {
          key: customer._id,
          name: customer.name,
          address: address,
          phone: customer.phone,
          email: customer.email,
          orders: customer.orders,
          cartItems: customer.cartItems,
        };
      });
    return processedData;
  };

  const searchInputStyle = {};

  const descriptionItemStyle = { verticalAlign: 'top' };
  const moreInfoButtonStyle = {
    width: '100%',
  };

  const columns = [
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (text, record) => (
        <Button
          type="primary"
          style={moreInfoButtonStyle}
          icon={<InfoCircleOutlined />}
          loading={loadingButtons[record.key]}
          onClick={async () => {
            setLoadingButtons({ ...loadingButtons, [record.key]: true });
            const [mostOrderedProduct, orderCount] = await Promise.all([
              getCurrentUserOrders(record.phone),
              getCurrentUserOrdersCount(record.phone),
            ]);
            record.mostOrderedProduct = mostOrderedProduct;
            record.orderCount = orderCount;
            setCurrentCustomerInfo(record);
            setIsDetailsModalVisible(true);
            setLoadingButtons({ ...loadingButtons, [record.key]: false });
          }}
        >
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    getAllUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <>
      <Modal
        title="Customer Details"
        open={isDetailsModalVisible}
        centered
        width={'80%'}
        onCancel={() => setIsDetailsModalVisible(false)}
        onOk={() => setIsDetailsModalVisible(false)}
      >
        <Descriptions layout="vertical" bordered>
          <Descriptions.Item label="Name" style={descriptionItemStyle}>
            {currentCustomerInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone" style={descriptionItemStyle}>
            {currentCustomerInfo.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Address" style={descriptionItemStyle}>
            {currentCustomerInfo.address}
          </Descriptions.Item>
          <Descriptions.Item label="Email" style={descriptionItemStyle}>
            {currentCustomerInfo.email}
          </Descriptions.Item>
          <Descriptions.Item label="Orders" style={descriptionItemStyle}>
            {currentCustomerInfo.orderCount > 0
              ? currentCustomerInfo.orderCount
              : 'No orders yet'}
          </Descriptions.Item>
          <Descriptions.Item label="Cart Items" style={descriptionItemStyle}>
            <List
              size="small"
              bordered
              dataSource={currentCustomerInfo.cartItems}
              renderItem={(item, index) => (
                <List.Item key={index}>{item.name}</List.Item>
              )}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label="Most Ordered Product"
            style={descriptionItemStyle}
          >
            {currentCustomerInfo.mostOrderedProduct?.count > 0
              ? `${currentCustomerInfo.mostOrderedProduct.name} (${currentCustomerInfo.mostOrderedProduct.count})`
              : 'No orders yet'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <div className={styles.customers}>
        <div className={styles.searchBarAndRefreshButtonWrapper}>
          <Input.Search
            placeholder="Search by name or phone number or address"
            size="large"
            value={searchInput}
            disabled={isCustomerInfoLoading}
            onChange={(e) => setSearchInput(e.target.value)}
            style={searchInputStyle}
          />
          <Button
            icon={<SyncOutlined />}
            size="large"
            type="primary"
            disabled={initialLoad}
            onClick={() => {
              getAllUsers();
              setIsRefreshButtonLoading(true);
            }}
            loading={isRefreshButtonLoading}
          >
            {isRefreshButtonLoading && 'Refreshing'}
            {!isRefreshButtonLoading && 'Refresh'}
          </Button>
        </div>
        <Table
          loading={isCustomerInfoLoading}
          dataSource={processCustomersData()}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    </>
  );
};

export default Customers;
