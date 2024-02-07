import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from './Inventory.module.css';
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
  MinusOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
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
  Divider,
} from 'antd';
import { SET_DATE } from '../../redux/types';

const Inventory = () => {
  const dispatch = useDispatch();
  const inventoryDate = useSelector((state) => state.date.inventory);
  const products = useSelector((state) => state.products);
  const [date, setDate] = useState(
    inventoryDate || moment().format('YYYY-MM-DD'),
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isReloadButtonLoading, setIsReloadButtonLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [
    isAddOnlineItemToInventoryModalVisible,
    setIsAddOnlineItemToInventoryModalVisible,
  ] = useState(false);
  const [selectedOnlineItem, setSelectedOnlineItem] = useState({});
  const [isCreatingOnlineInventoryItem, setIsCreatingOnlineInventoryItem] =
    useState(false);
  const [onlineInventoryItems, setOnlineInventoryItems] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isGettingCategory, setIsGettingCategory] = useState(false);
  const [category, setCategory] = useState('');
  const [isItemsDetailsModalVisible, setIsItemsDetailsModalVisible] =
    useState(false);
  const [
    currentSelectedOnlineInventoryItem,
    setCurrentSelectedOnlineInventoryItem,
  ] = useState({});
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(-1);
  const [editedQuantity, setEditedQuantity] = useState(null);
  const [initialStockEditedQuantity, setInitialStockEditedQuantity] =
    useState(null);
  const [initialStockCustomQuantity, setInitialStockCustomQuantity] =
    useState(-1);
  const [isInitialStockModalVisible, setIsInitialStockModalVisible] =
    useState(false);

  const selectStyle = {
    width: '100%',
    margin: '16px 0 16px 0',
  };

  const categorySelectStyle = {
    width: '100%',
    margin: '0 0 8px 0',
  };

  const detailsButtonStyle = {
    width: '100%',
  };

  const onlineInventoryItemsColumns = [
    {
      title: 'Product name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 150,
    },
    {
      title: 'Initial stock',
      dataIndex: 'initialStock',
      key: 'initialStock',
      width: 150,
      render: (initialStock, record) => {
        return (
          <>
            <div className={styles.initialStockWrapper}>
              {initialStock[initialStock.length - 1].quantity}
              <div
                onClick={() => {
                  setCurrentSelectedOnlineInventoryItem(record);
                  setIsInitialStockModalVisible(true);
                }}
                className={styles.editIcon}
              >
                <EditOutlined />
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: 'Current stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 150,
      render: (currentStock) => {
        return currentStock[currentStock.length - 1].quantity;
      },
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      width: 150,
      render: (text, record) => {
        return (
          <Button
            onClick={() => {
              setCurrentSelectedOnlineInventoryItem(record);
              setIsItemsDetailsModalVisible(true);
            }}
            style={detailsButtonStyle}
            type="primary"
          >
            Details
          </Button>
        );
      },
    },
  ];

  const handleIncrease = (record, increaseAmount) => {
    setEditedQuantity((quantity) => {
      return quantity + increaseAmount;
    });
  };

  const handleDecrease = (record, increaseAmount) => {
    setEditedQuantity((quantity) => {
      if (quantity - increaseAmount < 0) {
        return 0;
      }
      return quantity - increaseAmount;
    });
  };

  const handleInitialStockIncrease = (record, increaseAmount) => {
    setInitialStockEditedQuantity((quantity) => {
      return quantity + increaseAmount;
    });
  };

  const handleInitialStockDecrease = (record, increaseAmount) => {
    setInitialStockEditedQuantity((quantity) => {
      return quantity - increaseAmount;
    });
  };

  const updateOnlineInventoryItem = (record) => {
    setIsUpdatingQuantity(true);
    const newCurrentRecordQuantity = editedQuantity;
    const newCurrentRecordDate = record.date;
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/update-online-inventory-item`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          currentSelectedOnlineInventoryItem:
            currentSelectedOnlineInventoryItem,
          quantity: newCurrentRecordQuantity,
          date: newCurrentRecordDate,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setEditedQuantity(customQuantity);
          setIsUpdatingQuantity(false);
          getOnlineInventoryItems();
          setIsItemsDetailsModalVisible(false);
          return;
        }
        setCustomQuantity(editedQuantity);
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setIsUpdatingQuantity(false);
        getOnlineInventoryItems();
        setIsItemsDetailsModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setEditedQuantity(customQuantity);
        setIsUpdatingQuantity(false);
        getOnlineInventoryItems();
        setIsItemsDetailsModalVisible(false);
      });
  };

  const updateOnlineInventoryItemInitialStock = (record) => {
    setIsUpdatingQuantity(true);
    const newCurrentRecordQuantity = initialStockEditedQuantity;
    const newCurrentRecordDate = record.date;
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/update-online-inventory-item-initial-stock`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          currentSelectedOnlineInventoryItem:
            currentSelectedOnlineInventoryItem,
          quantity: newCurrentRecordQuantity,
          date: newCurrentRecordDate,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setInitialStockEditedQuantity(initialStockCustomQuantity);
          setIsUpdatingQuantity(false);
          getOnlineInventoryItems();
          setIsInitialStockModalVisible(false);
          return;
        }
        setInitialStockCustomQuantity(initialStockEditedQuantity);
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setIsUpdatingQuantity(false);
        getOnlineInventoryItems();
        setIsInitialStockModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setInitialStockEditedQuantity(initialStockCustomQuantity);
        setIsUpdatingQuantity(false);
        getOnlineInventoryItems();
        setIsInitialStockModalVisible(false);
      });
  };

  const selectedOnlineInventoryItemColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '50%',
      render: (date) => {
        return dayjs(date).format('YYYY-MM-DD');
      },
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '50%',
      render: (quantity, record) => {
        const isCurrentDate = moment(record.date).isSame(moment(date), 'day');
        if (isCurrentDate) {
          if (customQuantity < 0) {
            setCustomQuantity(quantity);
          }
        }
        return isCurrentDate ? (
          <div className={styles.quantityChangeWrapper}>
            <Button type="primary" onClick={() => handleDecrease(record, 1000)}>
              <MinusOutlined />
              1000
            </Button>
            <Button type="primary" onClick={() => handleDecrease(record, 100)}>
              <MinusOutlined />
              100
            </Button>
            <Button type="primary" onClick={() => handleDecrease(record, 10)}>
              <MinusOutlined />
              10
            </Button>
            <Button type="primary" onClick={() => handleDecrease(record, 1)}>
              <MinusOutlined />1
            </Button>
            {isUpdatingQuantity ? (
              <Spin />
            ) : editedQuantity !== null ? (
              editedQuantity
            ) : (
              customQuantity
            )}
            <Button
              disabled={editedQuantity + 1 > record.quantity}
              type="primary"
              onClick={() => handleIncrease(record, 1)}
            >
              <PlusOutlined />1
            </Button>
            <Button
              disabled={editedQuantity + 10 > record.quantity}
              type="primary"
              onClick={() => handleIncrease(record, 10)}
            >
              <PlusOutlined />
              10
            </Button>
            <Button
              disabled={editedQuantity + 100 > record.quantity}
              type="primary"
              onClick={() => handleIncrease(record, 100)}
            >
              <PlusOutlined />
              100
            </Button>
            <Button
              disabled={editedQuantity + 1000 > record.quantity}
              type="primary"
              onClick={() => handleIncrease(record, 1000)}
            >
              <PlusOutlined />
              1000
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure you want to update this record?"
              onConfirm={() => updateOnlineInventoryItem(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Update</Button>
            </Popconfirm>
          </div>
        ) : (
          quantity
        );
      },
    },
  ];

  const selectedOnlineInventoryItemInitialStockColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '50%',
      render: (date) => {
        return dayjs(date).format('YYYY-MM-DD');
      },
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '50%',
      render: (quantity, record) => {
        const isCurrentDate = moment(record.date).isSame(moment(date), 'day');
        if (isCurrentDate && record.isFromDatabase) {
          // Check the flag
          if (initialStockCustomQuantity < 0) {
            setInitialStockCustomQuantity(quantity);
          }
        } else if (isCurrentDate && !record.isFromDatabase) {
          if (initialStockCustomQuantity < 0) {
            setInitialStockCustomQuantity(0);
          }
        }
        return isCurrentDate ? (
          <div className={styles.quantityChangeWrapper}>
            <Button
              type="primary"
              onClick={() => handleInitialStockDecrease(record, 1000)}
            >
              <MinusOutlined />
              1000
            </Button>
            <Button
              type="primary"
              onClick={() => handleInitialStockDecrease(record, 100)}
            >
              <MinusOutlined />
              100
            </Button>
            <Button
              type="primary"
              onClick={() => handleInitialStockDecrease(record, 10)}
            >
              <MinusOutlined />
              10
            </Button>
            <Button
              type="primary"
              onClick={() => handleInitialStockDecrease(record, 1)}
            >
              <MinusOutlined />1
            </Button>
            {isUpdatingQuantity ? (
              <Spin />
            ) : initialStockEditedQuantity !== null ? (
              initialStockEditedQuantity
            ) : (
              initialStockCustomQuantity
            )}
            <Button
              type="primary"
              onClick={() => handleInitialStockIncrease(record, 1)}
            >
              <PlusOutlined />1
            </Button>
            <Button
              type="primary"
              onClick={() => handleInitialStockIncrease(record, 10)}
            >
              <PlusOutlined />
              10
            </Button>
            <Button
              type="primary"
              onClick={() => handleInitialStockIncrease(record, 100)}
            >
              <PlusOutlined />
              100
            </Button>
            <Button
              type="primary"
              onClick={() => handleInitialStockIncrease(record, 1000)}
            >
              <PlusOutlined />
              1000
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure you want to update this record?"
              onConfirm={() => updateOnlineInventoryItemInitialStock(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Update</Button>
            </Popconfirm>
          </div>
        ) : (
          quantity
        );
      },
    },
  ];

  const onDateChange = (date, dateString) => {
    setDate(dateString);
    dispatch({
      type: SET_DATE,
      payload: {
        screen: 'inventory',
        date: dateString,
      },
    });
  };

  const onSelectChange = (value) => {
    if (value) {
      products.map((product) => {
        if (product.name === value) {
          setSelectedOnlineItem(product);
        }
      });
    } else {
      setSelectedOnlineItem({});
    }
  };

  const onCategorySelectChange = (value) => {
    if (value) {
      setCategory(value);
    } else {
      setCategory('');
    }
  };

  const createOnlineInventoryItem = () => {
    setIsCreatingOnlineInventoryItem(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/create-online-inventory-item`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: selectedOnlineItem.name,
          category: selectedOnlineItem.category,
          unit: selectedOnlineItem.unit,
          initialStock: selectedOnlineItem.initialStock,
          currentStock: selectedOnlineItem.currentStock,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          getOnlineInventoryItems();
          setIsCreatingOnlineInventoryItem(false);
          setIsAddOnlineItemToInventoryModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getOnlineInventoryItems();
        setSelectedOnlineItem({});
        setIsCreatingOnlineInventoryItem(false);
        setIsAddOnlineItemToInventoryModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        getOnlineInventoryItems();

        setIsCreatingOnlineInventoryItem(false);
        setIsAddOnlineItemToInventoryModalVisible(false);
      });
  };

  const getOnlineInventoryItems = () => {
    setIsInitialLoading(true);
    window.electron
      .invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/crm/get-online-inventory-item`,
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsInitialLoading(false);
          return;
        }
        setOnlineInventoryItems(data.onlineInventoryItems);
        setIsInitialLoading(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsInitialLoading(false);
      });
  };

  const getAllCategories = () => {
    setIsGettingCategory(true);
    window.electron
      .invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/get-category`,
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsGettingCategory(false);
          return;
        }
        setIsGettingCategory(false);
        setAllCategories(data.allCategories);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsGettingCategory(false);
      });
  };

  const processOrdersForSelect = () => {
    const processedOrders = [];
    products.forEach((product) => {
      processedOrders.push(
        <Select.Option key={product.name} value={product.name}>
          {product.name}
        </Select.Option>,
      );
    });
    return processedOrders;
  };

  const processCategoriesForSelect = () => {
    const processedCategories = [];
    allCategories.forEach((category) => {
      processedCategories.push(
        <Select.Option key={category.name} value={category.name}>
          {category.name}
        </Select.Option>,
      );
    });
    return processedCategories;
  };

  const processOnlineInventoryItems = () => {
    const processedOnlineInventoryItems = [];
    onlineInventoryItems
      .filter((item) => {
        return item.category === category || item.category.includes(category);
      })
      .forEach((item) => {
        processedOnlineInventoryItems.push({
          key: item._id,
          name: item.name,
          category: item.category,
          unit: item.unit,
          initialStock: item.initialStock,
          currentStock: item.currentStock,
        });
      });
    return processedOnlineInventoryItems;
  };

  const processCurrentSelectedOnlineInventoryItem = () => {
    const processedCurrentSelectedOnlineInventoryItem = [];
    const currentStock = Array.isArray(
      currentSelectedOnlineInventoryItem.currentStock,
    )
      ? [...currentSelectedOnlineInventoryItem.currentStock]
      : [];

    if (currentStock.length > 0) {
      const lastItem = currentStock[currentStock.length - 1];
      const lastItemDate = moment(lastItem.date);
      const currentDate = moment(date);

      for (
        let m = moment(lastItemDate).add(1, 'days');
        m.isBefore(currentDate, 'day');
        m.add(1, 'days')
      ) {
        currentStock.push({
          _id: Math.random().toString(), // Generate a random ID for the new item
          date: m.toISOString(),
          quantity: lastItem.quantity,
        });
      }

      if (lastItemDate.isBefore(currentDate, 'day')) {
        currentStock.push({
          _id: Math.random().toString(), // Generate a random ID for the new item
          date: currentDate.toISOString(),
          quantity: lastItem.quantity,
        });
      }
    }

    currentStock.forEach((item) => {
      processedCurrentSelectedOnlineInventoryItem.push({
        key: item._id,
        date: item.date,
        quantity: item.quantity,
      });
    });

    return processedCurrentSelectedOnlineInventoryItem.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  const processCurrentSelectedOnlineInventoryItemInitialStock = () => {
    const processedCurrentSelectedOnlineInventoryItem = [];
    const initialStock = Array.isArray(
      currentSelectedOnlineInventoryItem.initialStock,
    )
      ? currentSelectedOnlineInventoryItem.initialStock.map((item) => ({
          ...item,
          isFromDatabase: true, // Add a flag to indicate this item is from the database
        }))
      : [];

    if (initialStock.length > 0) {
      const lastItem = initialStock[initialStock.length - 1];
      const lastItemDate = moment(lastItem.date);
      const currentDate = moment(date);

      for (
        let m = moment(lastItemDate).add(1, 'days');
        m.isBefore(currentDate, 'day');
        m.add(1, 'days')
      ) {
        initialStock.push({
          _id: Math.random().toString(), // Generate a random ID for the new item
          date: m.toISOString(),
          quantity: lastItem.quantity,
        });
      }

      if (lastItemDate.isBefore(currentDate, 'day')) {
        initialStock.push({
          _id: Math.random().toString(), // Generate a random ID for the new item
          date: currentDate.toISOString(),
          quantity: lastItem.quantity,
        });
      }
    }

    initialStock.forEach((item) => {
      processedCurrentSelectedOnlineInventoryItem.push({
        key: item._id,
        date: item.date,
        quantity: item.quantity,
        isFromDatabase: item.isFromDatabase, // Copy the flag
      });
    });

    return processedCurrentSelectedOnlineInventoryItem.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  useEffect(() => {
    getAllCategories();
    getOnlineInventoryItems();
  }, []);

  useEffect(() => {
    processOnlineInventoryItems();
  }, [category]);

  useEffect(() => {
    if (isItemsDetailsModalVisible) {
      setEditedQuantity(customQuantity);
    }
  }, [isItemsDetailsModalVisible, customQuantity]);

  useEffect(() => {
    if (isInitialStockModalVisible) {
      setInitialStockEditedQuantity(initialStockCustomQuantity);
    }
  }, [isInitialStockModalVisible, initialStockCustomQuantity]);

  return (
    <>
      {/* This is the modal for adding online item to inventory */}
      <Modal
        centered
        title="Add online item to inventory"
        open={isAddOnlineItemToInventoryModalVisible}
        onCancel={() => {
          setIsAddOnlineItemToInventoryModalVisible(false);
          setSelectedOnlineItem({});
        }}
        onOk={() => {
          createOnlineInventoryItem();
        }}
        okButtonProps={{
          disabled: Object.keys(selectedOnlineItem).length === 0,
          loading: isCreatingOnlineInventoryItem,
        }}
      >
        <Select
          onChange={(value) => onSelectChange(value)}
          size="large"
          allowClear
          showSearch
          value={
            Object.keys(selectedOnlineItem).length > 0
              ? selectedOnlineItem.name
              : 'Select a product'
          }
          style={selectStyle}
        >
          {processOrdersForSelect()}
        </Select>
        {Object.keys(selectedOnlineItem).length > 0 && (
          <Form>
            <Form.Item label="Product name">
              <Input value={selectedOnlineItem.name} disabled />
            </Form.Item>
            <Form.Item label="Product category">
              <Input value={selectedOnlineItem.category} disabled />
            </Form.Item>
            <Form.Item label="Unit">
              <Input value={selectedOnlineItem.unit} disabled />
            </Form.Item>
            <Form.Item label="Initial stock">
              <Input
                value={selectedOnlineItem.initialStock?.count}
                onChange={(e) => {
                  setSelectedOnlineItem({
                    ...selectedOnlineItem,
                    initialStock: [
                      {
                        date: new Date(date),
                        quantity: parseInt(e.target.value),
                      },
                    ],
                    currentStock: [
                      {
                        date: new Date(date),
                        quantity: parseInt(e.target.value),
                      },
                    ],
                  });
                }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/* This is the modal for item details */}
      <Modal
        title="Item details"
        width={'80%'}
        open={isItemsDetailsModalVisible}
        onCancel={() => {
          setIsItemsDetailsModalVisible(false);
          setCustomQuantity(-1);
          setEditedQuantity(null);
        }}
        onOk={() => {
          setIsItemsDetailsModalVisible(false);
          setCustomQuantity(-1);
          setEditedQuantity(null);
        }}
        centered
      >
        <Table
          dataSource={processCurrentSelectedOnlineInventoryItem()}
          columns={selectedOnlineInventoryItemColumns}
        />
      </Modal>
      <Modal
        title="Initial stock details"
        width={'80%'}
        open={isInitialStockModalVisible}
        onCancel={() => {
          setIsInitialStockModalVisible(false);
          setInitialStockCustomQuantity(-1);
          setInitialStockEditedQuantity(null);
        }}
        onOk={() => {
          setIsInitialStockModalVisible(false);
          setInitialStockCustomQuantity(-1);
          setInitialStockEditedQuantity(null);
        }}
        centered
      >
        <Table
          dataSource={processCurrentSelectedOnlineInventoryItemInitialStock()}
          columns={selectedOnlineInventoryItemInitialStockColumns}
        />
      </Modal>
      <div className={styles.inventory}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker
              style={{ width: 295 }}
              value={dayjs(date ? date : dayjs().format('YYYY-MM-DD'))}
              onChange={onDateChange}
              size="large"
              disabledDate={(current) => {
                return current && current.isAfter(dayjs().endOf('day'));
              }}
            />
            <Button
              onClick={() => {
                getOnlineInventoryItems();
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
            <Button
              onClick={() => {
                setIsAddOnlineItemToInventoryModalVisible(true);
              }}
              icon={<PlusOutlined />}
              type="primary"
              size="large"
            >
              Add online item to inventory
            </Button>
          </div>
          <div className={styles.OnlineInventoryItemsWrapper}>
            <Select
              size="large"
              onChange={(value) => onCategorySelectChange(value)}
              value={category || 'Select category'}
              loading={isGettingCategory}
              showSearch
              allowClear
              style={categorySelectStyle}
            >
              {processCategoriesForSelect()}
            </Select>
            <Table
              loading={isInitialLoading}
              dataSource={processOnlineInventoryItems()}
              columns={onlineInventoryItemsColumns}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
