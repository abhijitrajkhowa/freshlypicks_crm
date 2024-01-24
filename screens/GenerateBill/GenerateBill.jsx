import React from 'react';
import styles from './GenerateBill.module.css';
import dayjs from 'dayjs';
import {
  SyncOutlined,
  DiffOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../utils/helper';

import {
  DatePicker,
  Button,
  Modal,
  Select,
  Descriptions,
  Badge,
  Input,
  List,
  Switch,
  Icon,
  Spin,
} from 'antd';

const GenerateBill = () => {
  const user = useSelector((state) => state.user);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [vendorList, setVendorList] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [vendorBills, setVendorBills] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [isSavingBill, setIsSavingBill] = useState(false);
  const [isRemarksModalVisible, setIsRemarksModalVisible] = useState(false);
  const [currentEditItemIndex, setCurrentEditItemIndex] = useState(null);
  const [currentRemarks, setCurrentRemarks] = useState('');
  const [isGettingVendorBills, setIsGettingVendorBills] = useState(false);

  const handleSwitchChange = (itemIndex, checked) => {
    // Create a new object with the updated item
    const newVendorBills = vendorBills.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, paid: checked };
      }
      return item;
    });

    // Update the state with the new object
    setVendorBills(newVendorBills);
  };

  const handleRemarksChange = (itemIndex, remarks) => {
    // Create a new object with the updated item
    const newVendorBills = vendorBills.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, remarks };
      }
      return item;
    });

    // Update the state with the new object
    setVendorBills(newVendorBills);
  };

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  const selectStyle = {
    width: '100%',
    margin: '16px 0 16px 0',
  };

  const fontStyle = {
    fontSize: '16px',
  };

  const spinStyle = {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: 'translate(-50%)',
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

  const generateBill = () => {
    const vendor = vendorList.find((vendor) => vendor.name === vendorName);
    setIsGeneratingBill(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/generate-vendor-bill`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: vendor.name,
          vendorId: vendor._id,
          date: new Date(date),
          amount: 0,
          paid: false,
          remarks: 'no remarks',
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsGeneratingBill(false);
          setIsItemModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getVendorBills();
        setIsGeneratingBill(false);
        setIsItemModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsGeneratingBill(false);
        setIsItemModalVisible(false);
      });
  };

  const getVendorBills = () => {
    setIsGettingVendorBills(true);
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
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsGettingVendorBills(false);
          return;
        }
        setVendorBills(data.vendorBills);
        setIsGettingVendorBills(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsGettingVendorBills(false);
      });
  };

  const saveVendorBill = (vendorBill) => {
    vendorBill.amount = getTotalAmount(vendorBill);
    setIsSavingBill(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/save-vendor-bill`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          vendorBill,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsSavingBill(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setCurrentRemarks('');
        setIsSavingBill(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsSavingBill(false);
      });
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

  const getTotalAmount = (vendorBill) => {
    let totalAmount = 0;
    let inputsAreEmpty = true;

    vendorBill.orders.forEach((order) => {
      const inputValue = amounts[vendorBill._id]?.[order.name];
      if (inputValue) {
        inputsAreEmpty = false;
        totalAmount += inputValue * order.quantity;
      }
    });

    if (inputsAreEmpty) {
      return vendorBill.amount;
    } else {
      return totalAmount.toFixed(2);
    }
  };

  useEffect(() => {
    getVendorsList();
  }, []);

  useEffect(() => {
    getVendorBills();
  }, [date]);

  return (
    <>
      <Modal
        centered
        title="Remarks"
        open={isRemarksModalVisible}
        onOk={() => {
          setIsRemarksModalVisible(false);
        }}
        onCancel={() => setIsRemarksModalVisible(false)}
      >
        <Input.TextArea
          value={currentRemarks}
          onChange={(e) => {
            handleRemarksChange(currentEditItemIndex, e.target.value);
            setCurrentRemarks(e.target.value);
          }}
          rows={4}
          placeholder="Enter remarks"
        />
      </Modal>
      <Modal
        centered
        title="Add to vendor bill"
        open={isItemModalVisible}
        onOk={() => {
          generateBill();
        }}
        okButtonProps={{ loading: isGeneratingBill }}
        okText="Add"
        onCancel={() => setIsItemModalVisible(false)}
      >
        <Select
          defaultValue="Select vendor"
          size="large"
          style={selectStyle}
          allowClear
          loading={vendorList.length === 0}
          onChange={(value) => setVendorName(value)}
          options={processVendorList()}
        />
      </Modal>
      <div className={styles.generateBill}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker
              value={dayjs(date ? date : dayjs().format('YYYY-MM-DD'))}
              onChange={onDateChange}
              size="large"
            />
            <Button
              onClick={() => {
                setIsItemModalVisible(true);
              }}
              icon={<DiffOutlined />}
              type="primary"
              size="large"
            >
              Generate bill
            </Button>
          </div>
          <div className={styles.vendorBillsDisplayWrapper}>
            {isGettingVendorBills && <Spin style={spinStyle} size="large" />}
            {vendorBills.map((item, index) => {
              return (
                <>
                  <Descriptions
                    key={index}
                    className={styles.descriptionParent}
                    title={`${item.name}`}
                    contentStyle={fontStyle}
                    labelStyle={fontStyle}
                    layout="vertical"
                    column={5}
                    bordered
                  >
                    <Descriptions.Item label="Vendor name">
                      {item.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date">
                      {dayjs(item.date).format('DD-MM-YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Amount">
                      {getTotalAmount(item)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Paid">
                      <div className={styles.paidTextAndSwitchWrapper}>
                        {item.paid ? (
                          <Badge status="success" text="Paid" />
                        ) : (
                          <Badge status="processing" text="Not paid" />
                        )}
                        <Switch
                          checked={item.paid}
                          onChange={(checked) =>
                            handleSwitchChange(index, checked)
                          }
                        />
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Remarks">
                      <div className={styles.editRemarkWrapper}>
                        <div>{item.remarks}</div>
                        <div className={styles.editIcon}>
                          <EditOutlined
                            onClick={() => {
                              setIsRemarksModalVisible(true);
                              setCurrentRemarks(vendorBills[index].remarks);
                              setCurrentEditItemIndex(index);
                            }}
                          />
                        </div>
                      </div>
                    </Descriptions.Item>
                    {item.orders.length > 0 && (
                      <Descriptions.Item span={5} label="items">
                        <List>
                          {item.orders.map((order, index) => {
                            return (
                              <>
                                <List.Item key={index}>
                                  <div className={styles.listItemMainWrapper}>
                                    <div
                                      className={styles.titleAndHeaderWrapper}
                                    >
                                      <div
                                        className={styles.listItemTitleWrapper}
                                      >
                                        <span className={styles.listItemtitle}>
                                          {order.name}
                                        </span>
                                      </div>
                                      <div
                                        className={styles.listItemHeaderWrapper}
                                      >
                                        <span className={styles.listItemHeader}>
                                          {order.quantity} {order.unit}
                                        </span>
                                      </div>
                                    </div>
                                    <div className={styles.inputWrapper}>
                                      <span
                                        className={styles.listItemInputTitle}
                                      >
                                        Vendor Price :
                                      </span>
                                      <div className={styles.innerInputWrapper}>
                                        <Input
                                          type="number"
                                          placeholder="Enter vendor price"
                                          value={
                                            amounts[item._id]?.[order.name] ||
                                            ''
                                          }
                                          onChange={(e) => {
                                            setAmounts({
                                              ...amounts,
                                              [item._id]: {
                                                ...(amounts[item._id] || {}),
                                                [order.name]: parseFloat(
                                                  e.target.value,
                                                ),
                                              },
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </List.Item>
                              </>
                            );
                          })}
                        </List>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                  <Button
                    loading={isSavingBill}
                    onClick={() => saveVendorBill(item)}
                    icon={<SaveOutlined />}
                    type="primary"
                    size="large"
                  >
                    Save
                  </Button>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;
