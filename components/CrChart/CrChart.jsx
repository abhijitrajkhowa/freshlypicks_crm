import React from 'react';
import styles from './CrChart.module.css';
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

const CrChart = () => {
  const [selectedRange, setSelectedRange] = useState(['', '']);
  const [totalSales, setTotalSales] = useState([]);

  const getTotalSales = () => {
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/total-cr`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          selectedRange: selectedRange,
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
        setTotalSales(data.finalResult);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
  };

  const processItems = () => {
    const processedItems = totalSales
      .map((item) => ({
        yearMonth: item.yearMonth,
        finalAmount: item.finalAmount,
      }))
      .sort(
        (a, b) =>
          moment(a.yearMonth, 'YYYY-MM').valueOf() -
          moment(b.yearMonth, 'YYYY-MM').valueOf(),
      );

    return processedItems;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>
            {`Total Cr for ${moment(
              payload[0].payload.yearMonth,
              'YYYY-MM',
            ).format('MMMM YYYY')}: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    getTotalSales();
  }, []);

  useEffect(() => {
    if (selectedRange) {
      getTotalSales();
    }
  }, [selectedRange]);

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
          </Form>
        </div>
      </div>
      <div className={styles.otherItemsChart}>
        {totalSales?.length > 0 ? (
          <BarChart
            width={500}
            height={300}
            data={processItems()}
            margin={{
              right: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="finalAmount"
              fill="#a4133c"
              barSize={30}
              activeBar={<Rectangle fill="#ffb3c1" stroke="blue" />}
            />
          </BarChart>
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
};

export default CrChart;
