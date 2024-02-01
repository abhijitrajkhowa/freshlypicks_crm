import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from './BookKeeping.module.css';
import {
  CommentOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
  DownOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  MobileOutlined,
  ShopOutlined,
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
  Form,
  Tabs,
} from 'antd';

const BookKeeping = () => {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [isImportButtonLoading, setIsImportButtonLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isDeliveredFiltered, setIsDeliveredFiltered] = useState(true);
  const [toggleModal, setToggleModal] = useState(false);
  const [modalData, setModalData] = useState([{}]);
  const [processedOrders, setProcessedOrders] = useState([]);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorList, setVendorList] = useState([]);
  const [selectedBillItem, setSelectedBillItem] = useState({});
  const [isAddingToVendorBill, setIsAddingToVendorBill] = useState(false);
  const [isReloadButtonLoading, setIsReloadButtonLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [vendorBills, setVendorBills] = useState([]);
  const [isAddCrModalVisible, setIsAddCrModalVisible] = useState(false);
  const [currentAddCrItemIndex, setCurrentAddCrItemIndex] = useState(0);
  const [currentSelectedCrItem, setCurrentSelectedCrItem] = useState({});
  const [isCrSetting, setIsCrSetting] = useState(false);
  const [isDeletingCr, setIsDeletingCr] = useState(false);
  const [isAddRemarkModalVisible, setIsAddRemarkModalVisible] = useState(false);
  const [isAddingRemark, setIsAddingRemark] = useState(false);
  const [isAddingNewOfflineOrder, setIsAddingNewOfflineOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [localChickenNetQuantity, setLocalChickenNetQuantity] = useState(0);
  const [searchedTerm, setSearchedTerm] = useState('');

  const formRef = useRef();

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
    padding: '16px 0 0 0',
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

  const differentListItemChildStyle = {
    cursor: 'pointer',
    textDecoration: 'line-through',
    color: 'gray',
  };

  const modalStyle = {
    margin: '24px 0',
  };

  const selectStyle = {
    width: '100%',
    margin: '16px 0 16px 0',
  };

  const descriptionStyle = { width: '50%' };

  const descriptionStyleForNewOrder = { width: '100%' };

  const descriptionItemStyle = { verticalAlign: 'top' };

  const paymentOptions = ['Cash', 'UPI', 'Card'];

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
      render: (items, record) => (
        <List
          size="small"
          bordered
          style={listItemStyle}
          dataSource={items}
          renderItem={(item, index) => {
            // Check if there's any order in any vendorBill that has the same orderId and name as the item
            const isItemInVendorBills = vendorBills.some((vendorBill) =>
              vendorBill.orders.some(
                (order) =>
                  order.orderIds?.includes(item.orderId) &&
                  order.name === item.name,
              ),
            );

            if (!item.orderId) {
              item.orderId = record.id;
            }

            return (
              <List.Item
                style={
                  isItemInVendorBills
                    ? differentListItemChildStyle
                    : listItemChildStyle
                }
                onClick={() => {
                  if (!isItemInVendorBills) handleItemClick(item);
                }}
              >
                {index + 1}. {item.name} -- {item.quantity} {item.unit}
              </List.Item>
            );
          }}
        />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, record) => {
        return record.remark ? (
          <div className={styles.crWrapper}>
            {record.remark}
            <div className={styles.editIcon}>
              <EditOutlined
                onClick={() => {
                  setIsAddRemarkModalVisible(true);
                  setCurrentSelectedCrItem(record);
                }}
              />
            </div>
          </div>
        ) : (
          <Button
            onClick={() => {
              setCurrentSelectedCrItem(record);
              setIsAddRemarkModalVisible(true);
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add Remark
          </Button>
        );
      },
    },
    {
      title: 'C.R',
      dataIndex: 'cr',
      key: 'cr',
      render: (text, record, index) => {
        return record.cr === 0 ? (
          <Button
            onClick={() => {
              setIsAddCrModalVisible(true);
              setCurrentAddCrItemIndex(index);
              setCurrentSelectedCrItem(record);
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add C.R.
          </Button>
        ) : (
          <div className={styles.crWrapper}>
            {record.cr}
            <div className={styles.editIcon}>
              <Popconfirm
                title="Delete the cr"
                description="Are you sure to delete this cr value?"
                okText="Yes"
                cancelText="No"
                placement="left"
                onConfirm={() => deleteCr(record)}
                okButtonProps={{ loading: isDeletingCr }}
              >
                <CloseCircleOutlined />
              </Popconfirm>
            </div>
          </div>
        );
      },
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
    newProcessedOrders[index]['cr'] =
      e.target.value === '' ? 0 : parseInt(e.target.value);
    setProcessedOrders(newProcessedOrders);
  };

  const processOrders = () => {
    let newProcessedOrders = [];
    let filteredOrders = orders;

    if (searchedTerm) {
      filteredOrders = orders.filter((order) =>
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchedTerm.toLowerCase()),
        ),
      );
    }

    if (isDeliveredFiltered) {
      filteredOrders = filteredOrders.filter((order) => order.delivered);
    }

    filteredOrders.forEach((order, index) => {
      const onlyAddress = order.address?.split('--')[0];

      newProcessedOrders[index] = {
        id: order._id,
        key: index,
        index: index + 1,
        name: order.name,
        address: onlyAddress,
        items: order.items,
        quantity: order.items,
        price: order.total,
        cr: order.cr ? order.cr : 0,
        remark: order.remark,
      };
    });

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
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setOrders([]);
          setIsImportButtonLoading(false);
          setIsReloadButtonLoading(false);
          setIsInitialLoading(false);
          return;
        }
        setIsImportButtonLoading(false);
        setIsReloadButtonLoading(false);
        setIsInitialLoading(false);
        setOrders(data.orders);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setOrders([]);
        setIsImportButtonLoading(false);
        setIsReloadButtonLoading(false);
        setIsInitialLoading(false);
      });
  };

  const getOfflineOrdersByDate = () => {
    setIsImportButtonLoading(true);
    const formattedDate = moment(date, 'YYYY-MM-DD').format('D/M/YYYY');
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/get-offline-order`,
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
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsImportButtonLoading(false);
          setIsReloadButtonLoading(false);
          setIsInitialLoading(false);
          return;
        }
        setIsImportButtonLoading(false);
        setIsReloadButtonLoading(false);
        setIsInitialLoading(false);
        setOrders(data.offlineOrders);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsImportButtonLoading(false);
        setIsReloadButtonLoading(false);
        setIsInitialLoading(false);
      });
  };

  const getOrdersByDateForBackground = () => {
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
          toast.error(data.error, {
            position: 'bottom-center',
          });

          return;
        }

        setOrders(data.orders);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const getOfflineOrdersByDateForBackground = () => {
    const formattedDate = moment(date, 'YYYY-MM-DD').format('D/M/YYYY');
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/get-offline-order`,
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
          toast.error(data.error, {
            position: 'bottom-center',
          });
          return;
        }
        setOrders(data.offlineOrders);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const addRemarkToOrder = () => {
    setIsAddingRemark(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/add-remark-to-order`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          orderId: currentSelectedCrItem.id,
          remark: currentSelectedCrItem.remark,
          forOffline: activeTab === '2' ? true : false,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsAddingRemark(false);
          setIsAddRemarkModalVisible(false);
          return;
        }

        setIsAddingRemark(false);
        setIsAddRemarkModalVisible(false);
        activeTab === '1' ? debouncedGetOrders() : debouncedGetOfflineOrders();
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsAddingRemark(false);
        setIsAddRemarkModalVisible(false);
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

  const addToVendorBill = (order) => {
    setIsAddingToVendorBill(true);
    const vendor = vendorList.find((vendor) => vendor.name === vendorName);
    if (order.name?.includes('Local Chicken')) {
      order.quantity = localChickenNetQuantity;
    }
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
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setLocalChickenNetQuantity(0);
          setIsAddingToVendorBill(false);
          return;
        }
        setIsAddingToVendorBill(false);
        setSelectedBillItem({});
        getVendorBills();
        setLocalChickenNetQuantity(0);
        setVendorName('');
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setLocalChickenNetQuantity(0);
        setIsAddingToVendorBill(false);
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

  const setCr = () => {
    setIsCrSetting(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/set-order-cr`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          orderId: currentSelectedCrItem.id,
          cr: currentSelectedCrItem.cr,
          forOffline: activeTab === '2' ? true : false,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsCrSetting(false);
          setIsAddCrModalVisible(false);
          return;
        }
        setIsCrSetting(false);
        setIsAddCrModalVisible(false);
        activeTab === '1' ? debouncedGetOrders() : debouncedGetOfflineOrders();
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsCrSetting(false);
        setIsAddCrModalVisible(false);
      });
  };

  const debouncedGetOrders = _.debounce(getOrdersByDateForBackground, 5000);
  const debouncedGetOfflineOrders = _.debounce(
    getOfflineOrdersByDateForBackground,
    5000,
  );

  const deleteCr = (item) => {
    setIsDeletingCr(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/delete-order-cr`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          orderId: item.id,
          forOffline: activeTab === '2' ? true : false,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsDeletingCr(false);
          return;
        }
        setIsDeletingCr(false);
        activeTab === '1' ? getOrdersByDate() : getOfflineOrdersByDate();
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsDeletingCr(false);
      });
  };

  const addOfflineOrder = () => {
    setIsAddingNewOfflineOrder(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/add-offline-order`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          order: {
            ...modalData[0],
            date: moment(date, 'YYYY-MM-DD').format('D/M/YYYY'),
            dateObject: new Date(date),
            time: moment().format('h:m:ss a'),
            cr: 0,
            remark: '',
            discount: modalData[0].discount ? modalData[0].discount : 0,
          },
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsAddingNewOfflineOrder(false);
          setToggleModal(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setIsAddingNewOfflineOrder(false);
        setToggleModal(false);
        setModalData([{}]);
        getOfflineOrdersByDate();
        formRef.current.resetFields();
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsAddingNewOfflineOrder(false);
        setToggleModal(false);
      });
  };

  const onFinish = (values) => {
    const newModalData = [...modalData];
    newModalData[0].items = values.items;
    setModalData(newModalData);
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

  const fetchData = async (tabKey) => {
    if (tabKey === '2') {
      getOfflineOrdersByDate();
    } else if (tabKey === '1') {
      getOrdersByDate();
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (date && activeTab === '1') {
      getOrdersByDate();
      getVendorBills();
    } else if (date && activeTab === '2') {
      getOfflineOrdersByDate();
      getVendorBills();
    }
  }, [date]);

  useEffect(() => {
    processOrders();
  }, [orders, isDeliveredFiltered]);

  useEffect(() => {
    getVendorsList();
    getVendorBills();
  }, []);

  const fetchDataDebounced = _.debounce(fetchData, 1000);

  useEffect(() => {
    // Call the debounced function
    setIsImportButtonLoading(true);
    fetchDataDebounced(activeTab);

    // Cancel the debounced function in the cleanup function
    return () => {
      fetchDataDebounced.cancel();
    };
  }, [activeTab]);

  useEffect(() => {
    processOrders();
  }, [searchedTerm]);

  return (
    <>
      <Modal
        centered
        title="Add remark"
        open={isAddRemarkModalVisible}
        okText="Add"
        okButtonProps={{ loading: isAddingRemark }}
        onOk={() => {
          addRemarkToOrder();
        }}
        onCancel={() => setIsAddRemarkModalVisible(false)}
      >
        <Input.TextArea
          allowClear
          value={currentSelectedCrItem.remark}
          onChange={(e) => {
            const newOrders = [...processedOrders];
            newOrders.forEach((order) => {
              if (order.id === currentSelectedCrItem.id) {
                order.remark = e.target.value;
              }
            });
            setProcessedOrders(newOrders);
          }}
          placeholder="Enter remark"
          rows={2}
        />
      </Modal>
      <Modal
        centered
        title="Add to C.R."
        open={isAddCrModalVisible}
        okButtonProps={{ loading: isCrSetting }}
        onOk={() => {
          setCr();
        }}
        onCancel={() => {
          setIsAddCrModalVisible(false);
          const newOrders = [...processedOrders];
          newOrders[currentAddCrItemIndex]['cr'] = 0;
        }}
      >
        {processedOrders[currentAddCrItemIndex] && (
          <Input
            type="number"
            value={processedOrders[currentAddCrItemIndex]['cr']}
            onChange={(e) => handleCrInputChange(e, currentAddCrItemIndex)}
          />
        )}
      </Modal>
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
        onCancel={() => {
          setIsItemModalVisible(false);
          setLocalChickenNetQuantity(0);
        }}
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
        {selectedBillItem.name?.includes('Local Chicken') && (
          <Form>
            <Form.Item label="Gross quantity">
              <Input
                type="number"
                value={selectedBillItem.quantity}
                disabled
                placeholder="Gross quantity"
              />
            </Form.Item>
            <Form.Item label="Net quantity">
              <Input
                type="number"
                value={localChickenNetQuantity}
                onChange={(e) => setLocalChickenNetQuantity(e.target.value)}
                placeholder="Net quantity"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        style={modalStyle}
        width={'80%'}
        centered
        okText="Add"
        okButtonProps={{ loading: isAddingNewOfflineOrder }}
        onCancel={() => {
          setModalData([{}]);
          formRef.current.resetFields();
          setToggleModal(false);
        }}
        onOk={() => {
          if (Object.keys(modalData[0]).length === 0) {
            toast.error('Please fill up the form');
            return;
          }
          if (
            !modalData[0].name ||
            !modalData[0].address ||
            !modalData[0].items ||
            !modalData[0].total ||
            !modalData[0].payment ||
            !modalData[0].phone
          ) {
            toast.error('Please fill up the form');
            return;
          }
          addOfflineOrder();
        }}
        open={toggleModal}
      >
        <Descriptions
          bordered
          column={3}
          style={descriptionStyleForNewOrder}
          layout="vertical"
          className={styles.descriptionParent}
          title="Add record"
        >
          <Descriptions.Item label="Name" style={descriptionItemStyle}>
            <Input
              value={modalData[0].name}
              placeholder="Name"
              onChange={(e) => handleInputChange(e, 0, 'name')}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Address" style={descriptionItemStyle}>
            <Input
              value={modalData[0].address}
              placeholder="Address"
              onChange={(e) => handleInputChange(e, 0, 'address')}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Items" style={descriptionItemStyle}>
            <Form
              ref={formRef}
              name="dynamic_form_nest_item"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              autoComplete="off"
            >
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'product']}
                          rules={[
                            { required: true, message: 'Missing product' },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Select a product"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {products.map((product, index) => (
                              <Select.Option key={index} value={product._id}>
                                {product.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          rules={[
                            { required: true, message: 'Missing quantity' },
                          ]}
                        >
                          <Input
                            placeholder="Quantity (in gm's)"
                            type="number"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Item
                      </Button>
                    </Form.Item>
                    {fields.length > 0 && (
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={() => {
                            toast.success('Items added');
                          }}
                          htmlType="submit"
                        >
                          Done
                        </Button>
                      </Form.Item>
                    )}
                  </>
                )}
              </Form.List>
            </Form>
          </Descriptions.Item>
          <Descriptions.Item label="Telephone" style={descriptionItemStyle}>
            <Input
              type="number"
              value={modalData[0].phone}
              placeholder="Telephone"
              onChange={(e) => handleInputChange(e, 0, 'phone')}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Price" style={descriptionItemStyle}>
            <Input
              type="number"
              value={modalData[0].total}
              placeholder="Price"
              onChange={(e) => handleInputChange(e, 0, 'total')}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Discount" style={descriptionItemStyle}>
            <Input
              type="number"
              value={modalData[0].discount}
              placeholder="Discount"
              onChange={(e) => handleInputChange(e, 0, 'discount')}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Discount code" style={descriptionItemStyle}>
            <Input
              value={modalData[0].discountCode}
              placeholder="Discount code"
              onChange={(e) => handleInputChange(e, 0, 'discountCode')}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Payment" style={descriptionItemStyle}>
            <Select
              allowClear
              style={{ width: '100%' }}
              value={modalData[0].payment}
              placeholder="Select a payment option"
              onChange={(value) =>
                handleInputChange({ target: { value } }, 0, 'payment')
              }
            >
              {paymentOptions.map((option, index) => (
                <Select.Option key={index} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Descriptions.Item>
        </Descriptions>
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
                setIsReloadButtonLoading(true);
                setActiveTab('1');
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
            <Input.Search
              placeholder="Search"
              size="large"
              allowClear
              value={searchedTerm}
              onChange={(e) => setSearchedTerm(e.target.value)}
            />
          </div>
          {isImportButtonLoading && <Spin style={spinStyle} size="large" />}
          <>
            <Tabs
              style={{ padding: '0 16px' }}
              defaultActiveKey="1"
              activeKey={activeTab}
              onChange={handleTabChange}
              indicator={{ align: 'center' }}
            >
              <Tabs.TabPane
                icon={<MobileOutlined />}
                tab="Online orders"
                key="1"
              >
                {!isImportButtonLoading && (
                  <>
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
                      dataSource={orders ? processedOrders : dataSource}
                      columns={columns}
                      rowClassName={styles.topAlignedRow}
                    />
                    <div className={styles.totalGovWrapper}>
                      <Descriptions
                        bordered
                        column={3}
                        style={descriptionStyle}
                        layout="vertical"
                        title="Total Info"
                      >
                        <Descriptions.Item label="Total Gov">
                          ₹
                          {orders
                            .reduce((acc, order) => acc + order.total, 0)
                            .toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Cr">
                          ₹
                          {orders
                            .reduce(
                              (acc, order) => acc + (order.cr ? order.cr : 0),
                              0,
                            )
                            .toLocaleString()}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane
                icon={<ShopOutlined />}
                tab="Offline orders"
                key="2"
              >
                {!isImportButtonLoading && (
                  <>
                    <Table
                      style={tableStyle}
                      dataSource={orders ? processedOrders : dataSource}
                      columns={columns}
                      rowClassName={styles.topAlignedRow}
                    />
                    <div className={styles.totalGovWrapper}>
                      <Descriptions
                        bordered
                        column={3}
                        style={descriptionStyle}
                        layout="vertical"
                        title="Total Info"
                      >
                        <Descriptions.Item label="Total Gov">
                          ₹
                          {orders
                            .reduce((acc, order) => acc + order.total, 0)
                            .toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Cr">
                          ₹
                          {orders
                            .reduce(
                              (acc, order) => acc + (order.cr ? order.cr : 0),
                              0,
                            )
                            .toLocaleString()}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </>
                )}
              </Tabs.TabPane>
            </Tabs>
          </>
        </div>
      </div>
    </>
  );
};

export default BookKeeping;
