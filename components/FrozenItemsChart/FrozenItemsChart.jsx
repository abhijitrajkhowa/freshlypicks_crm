import React, { useEffect, useState, PureComponent } from 'react';
import styles from './FrozenItemsChart.module.css';
import { baseUrl } from '../../utils/helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const FrozenItemsChart = () => {
  const [frozenData, setFrozenData] = useState([]);

  const getFrozenItemsData = async () => {
    window.electron
      .invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/crm/get-most-ordered-frozen-products`,
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          return;
        }
        setFrozenData(data.result);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
      });
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

  useEffect(() => {
    getFrozenItemsData();
  }, []);

  return (
    <>
      <div className={styles.frozenItemsChart}>
        <BarChart
          width={500}
          height={300}
          data={frozenData}
          margin={{
            right: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="totalQuantity"
            fill="#e63946"
            barSize={30}
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          ></Bar>
        </BarChart>
      </div>
    </>
  );
};

export default FrozenItemsChart;
