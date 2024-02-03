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

const Inventory = () => {
  const products = useSelector((state) => state.products);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isReloadButtonLoading, setIsReloadButtonLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [
    isAddOnlineItemToInventoryModalVisible,
    setIsAddOnlineItemToInventoryModalVisible,
  ] = useState(false);
  const [selectedOnlineItem, setSelectedOnlineItem] = useState({});
  const [isCreatingOnlineInventoryItem, setIsCreatingOnlineInventoryItem] =
    useState(false);

  const selectStyle = {
    width: '100%',
    margin: '16px 0 16px 0',
  };

  const onDateChange = (date, dateString) => {
    setDate(dateString);
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
          setIsCreatingOnlineInventoryItem(false);
          setIsAddOnlineItemToInventoryModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setSelectedOnlineItem({});
        setIsCreatingOnlineInventoryItem(false);
        setIsAddOnlineItemToInventoryModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsCreatingOnlineInventoryItem(false);
        setIsAddOnlineItemToInventoryModalVisible(false);
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

  return (
    <>
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
      <div className={styles.inventory}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker
              value={dayjs(date ? date : dayjs().format('YYYY-MM-DD'))}
              onChange={onDateChange}
              size="large"
            />
            <Button
              onClick={() => {}}
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
          <div className={styles.OnlineInventoryItemsWrapper}></div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
