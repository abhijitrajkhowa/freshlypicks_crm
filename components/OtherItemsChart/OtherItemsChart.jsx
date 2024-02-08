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
  const [selectedRange, setSelectedRange] = useState('');

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
      const orderDate = moment(order.date, 'DD/MM/YYYY'); // code for the range selection
      if (
        selectedRange &&
        selectedRange[0] !== '' &&
        selectedRange[1] !== '' &&
        !orderDate.isBetween(
          moment(selectedRange[0], 'DD/MM/YYYY'),
          moment(selectedRange[1], 'DD/MM/YYYY'),
          'day',
          '[]',
        )
      ) {
        return;
      }
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
          const quantity = parseFloat(item.quantity);
          if (items[itemName]) {
            items[itemName].count += 1;
            items[itemName].quantity += isNaN(quantity) ? 0 : quantity;
          } else {
            items[itemName] = {
              count: 1,
              quantity: isNaN(quantity) ? 0 : quantity,
            };
          }
        }
      });
    });

    const processedOrders = Object.keys(items)
      .map((name) => ({ name, ...items[name] }))
      .sort((a, b) => b.count - a.count);

    return processedOrders;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>
            {`Item: ${label}`}
            <br />
            {`Count: ${payload[0].value}`}
            <br />
            {`Total Quantity: ${(payload[0].payload.quantity / 1000).toFixed(
              2,
            )} kg`}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className={styles.selectWrapper}>
        <div className={styles.rangeSelectionWrapper}>
          <Form>
            <Form.Item
              name="range"
              label="Date Range"
              className={styles.datePicker}
            >
              <DatePicker.RangePicker
                className={styles.datePicker}
                onChange={(date, dateString) => {
                  setSelectedRange(dateString);
                }}
                placeholder={['Start Date', 'End Date']}
                format="DD-MM-YYYY"
                value={
                  selectedRange
                    ? [
                        moment(selectedRange[0], 'DD-MM-YYYY'),
                        moment(selectedRange[1], 'DD-MM-YYYY'),
                      ]
                    : null
                }
                disabledDate={(current) => {
                  return current && current.isAfter(dayjs().endOf('day'));
                }}
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              className={styles.selectCategory}
            >
              <Select
                className={styles.selectCategory}
                placeholder="Select Category"
                allowClear
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
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={styles.otherItemsChart}>
        {orders.length !== 0 ? (
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
              fill="#fe5b3a"
              barSize={30}
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          </BarChart>
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
};

export default OtherItemsChart;
