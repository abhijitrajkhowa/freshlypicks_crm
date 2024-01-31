import React from 'react';
import styles from './OtherItemsChart.module.css';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const OtherItemsChart = () => {
  const orders = useSelector((state) => state.orders);
  const [selectedCategory, setSelectedCategory] = useState('Meat');

  const selectCategories = [
    {
      name: 'Meat',
      value: 'Meat',
    },
    {
      name: 'Vegetable',
      value: 'Vegetable',
    },
    {
      name: 'Fruits',
      value: 'Fruits',
    },
    {
      name: 'dry Fruits',
      value: 'Dry Fruits',
    },
    {
      name: 'Fish',
      value: 'Fish',
    },
    {
      name: 'Eggs & Dairy',
      value: 'Eggs & Dairy',
    },
    {
      name: 'Special Cuts',
      value: 'Special Cuts',
    },
    {
      name: 'Combo',
      value: 'Combo',
    },
    {
      name: 'Fresh Juice',
      value: 'Fresh Juice',
    },
  ];

  const processOrders = () => {
    const items = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (
          selectedCategory === 'Meat'
            ? item.category?.includes(selectedCategory)
            : item.category === selectedCategory
        ) {
          let itemName = item.name;
          if (selectedCategory === 'Meat') {
            itemName = itemName.split('(')[0].trim();
            itemName = itemName
              .replace(/small cut|medium cut|large cut/gi, '')
              .trim();
          }
          if (items[itemName]) {
            items[itemName] += 1;
          } else {
            items[itemName] = 1;
          }
        }
      });
    });

    const processedOrders = Object.keys(items)
      .map((name) => ({ name, count: items[name] }))
      .sort((a, b) => b.count - a.count);

    return processedOrders;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p
            className={styles.tooltipLabel}
          >{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className={styles.otherItemsChart}>
        <div className={styles.selectWrapper}>
          <Select
            className={styles.selectCategory}
            placeholder="Select Category"
            allowClear
            size="large"
            showSearch
            style={{ width: 200 }}
            value={selectedCategory || 'Select Category'}
            onChange={(value) => setSelectedCategory(value)}
          >
            {selectCategories.map((category) => (
              <Select.Option value={category.value}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <BarChart
          width={500}
          height={300}
          data={processOrders()}
          margin={{
            right: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="count"
            fill="#e63946"
            barSize={30}
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          ></Bar>
        </BarChart>
      </div>
    </>
  );
};

export default OtherItemsChart;
