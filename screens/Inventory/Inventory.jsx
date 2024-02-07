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
      render: (initialStock) => {
        return (
          <>
            <div className={styles.initialStockWrapper}>
              {initialStock[0].quantity}
              <div className={styles.editIcon}>
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

  const handleIncrease = (item) => {
    // Increase the quantity of the item
    const currentStock = Array.isArray(
      currentSelectedOnlineInventoryItem.currentStock,
    )
      ? [...currentSelectedOnlineInventoryItem.currentStock]
      : [];
    let updatedItem = currentStock.find((stock) => stock._id === item.key);
    updatedItem.quantity += 1;
    setCurrentSelectedOnlineInventoryItem({
      ...currentSelectedOnlineInventoryItem,
      currentStock: currentStock,
    });
  };

  const handleDecrease = (item) => {
    // Decrease the quantity of the item
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
        return isCurrentDate ? (
          <div className={styles.quantityChangeWrapper}>
            <Button type="primary" onClick={() => handleDecrease(record)}>
              <MinusOutlined />
            </Button>
            {quantity}
            <Button type="primary" onClick={() => handleIncrease(record)}>
              <PlusOutlined />
            </Button>
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

  useEffect(() => {
    getAllCategories();
    getOnlineInventoryItems();
  }, []);

  useEffect(() => {
    processOnlineInventoryItems();
  }, [category]);

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
      <Modal
        title="Item details"
        width={'80%'}
        open={isItemsDetailsModalVisible}
        onCancel={() => setIsItemsDetailsModalVisible(false)}
        onOk={() => setIsItemsDetailsModalVisible(false)}
        centered
      >
        <Table
          dataSource={processCurrentSelectedOnlineInventoryItem()}
          columns={selectedOnlineInventoryItemColumns}
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
