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
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isReloadButtonLoading, setIsReloadButtonLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  return (
    <>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
