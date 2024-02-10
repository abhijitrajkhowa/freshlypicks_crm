import React from 'react';
import styles from './ItemWiseSalesChart.module.css';
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

const ItemWiseSalesChart = () => {
  const products = useSelector((state) => state.products);
  const [selectedRange, setSelectedRange] = useState(['', '']);
  const [topTenSellingItems, setTopTenSellingItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const getTopTenSellingItems = () => {
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/item-sales-in-quantity`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          selectedRange: selectedRange,
          itemName: selectedProduct,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          //   toast.error(data.error, {
          //     position: 'bottom-center',
          //   });
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setTopTenSellingItems(data.result);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const data = [
    {
      name: 'Count',
      value: topTenSellingItems[0]?.count || 0,
      fill: '#8884d8',
    },
    {
      name: 'Total Quantity',
      value: topTenSellingItems[0]?.totalQuantity || 0,
      fill: '#82ca9d',
    },
  ];

  const processItems = () => {
    const processedItems = topTenSellingItems
      .map((item) => ({
        name: item._id,
        count: item.count,
        quantity: item.totalQuantity,
        totalSales: item.totalSales,
        month: item.yearMonth,
      }))
      .sort(
        (a, b) =>
          moment(b.month, 'YYYY-MM').valueOf() -
          moment(a.month, 'YYYY-MM').valueOf(),
      );

    return processedItems;
  };

  const processProductsForSelect = () => {
    const processedProducts = products.map((product) => (
      <Select.Option key={product._id} value={product.name}>
        {product.name}
      </Select.Option>
    ));

    return processedProducts;
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
            <br />
            {`Total sales: ${payload[0].payload.totalSales.toFixed(2)}`}
            <br />
            {`Month: ${moment(payload[0].payload.month, 'YYYY-MM').format(
              'MMMM YYYY',
            )}`}
          </p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    getTopTenSellingItems();
  }, []);

  useEffect(() => {
    if (selectedRange) {
      getTopTenSellingItems();
    }
  }, [selectedRange, selectedProduct]);

  useEffect(() => {
    if (products.length > 0) {
      setSelectedProduct(products[0].name);
    }
  }, []);

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
            <Form.Item name="productName" label="Product name">
              <Select
                allowClear
                showSearch
                placeholder="Select a product"
                onChange={(value) => {
                  setSelectedProduct(value);
                }}
                defaultValue={products[0]?.name || ''}
                value={selectedProduct || 'Select a product'}
              >
                {processProductsForSelect()}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={styles.otherItemsChart}>
        {topTenSellingItems.length !== 0 ? (
          <BarChart
            width={500}
            height={300}
            data={processItems()}
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
              fill="#621708"
              barSize={30}
              activeBar={<Rectangle fill="#f6aa1c" stroke="blue" />}
            />
          </BarChart>
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
};

export default ItemWiseSalesChart;
