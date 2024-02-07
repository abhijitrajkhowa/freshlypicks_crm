import React from 'react';
import styles from './GenerateBill.module.css';
import dayjs from 'dayjs';
import {
  SyncOutlined,
  DiffOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
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
  Empty,
  Form,
} from 'antd';
import { SET_DATE } from '../../redux/types';

const GenerateBill = () => {
  const dispatch = useDispatch();
  const generateBillDate = useSelector((state) => state.date.generateBill);
  const user = useSelector((state) => state.user);
  const [date, setDate] = useState(
    generateBillDate || moment().format('YYYY-MM-DD'),
  );
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
  const [isDeleteItemFromBillModalOpen, setIsDeleteItemFromBillModalOpen] =
    useState(false);
  const [currentDeleteItem, setCurrentDeleteItem] = useState(null);
  const [isDeletingItemFromBill, setIsDeletingItemFromBill] = useState(false);
  const [updatedItems, setUpdatedItems] = useState({});
  const [miscValue, setMiscValue] = useState('');

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
    dispatch({
      type: SET_DATE,
      payload: {
        screen: 'generateBill',
        date: dateString,
      },
    });
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

  const badgeWrapperStyle = {
    width: '80px',
  };

  const emptyComponentStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
          name: vendorName === 'Misc' ? `Misc ${miscValue}` : vendor.name,
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
          setMiscValue('');
          setIsGeneratingBill(false);
          setIsItemModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setMiscValue('');
        getVendorBills();
        setIsGeneratingBill(false);
        setIsItemModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setMiscValue('');
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
          // toast.error(data.error, {
          //   position: 'bottom-center',
          // });
          setVendorBills([]);
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
        setVendorBills([]);
        setIsGettingVendorBills(false);
      });
  };

  const removeItemFromVendorBill = () => {
    setIsDeletingItemFromBill(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/remove-item-from-vendor-bill`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          billId: currentDeleteItem.billId,
          item: currentDeleteItem.item,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsDeletingItemFromBill(false);
          setIsDeleteItemFromBillModalOpen(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getVendorBills();
        setIsDeletingItemFromBill(false);
        setIsDeleteItemFromBillModalOpen(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsDeletingItemFromBill(false);
        setIsDeleteItemFromBillModalOpen(false);
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
        getVendorBills();
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
      const inputValue =
        order.customVendorPrice || amounts[vendorBill._id]?.[order.name];
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

  const setAmountToZero = (billId) => {
    // Create a new array with the updated vendor bill
    const updatedVendorBills = vendorBills.map((bill) => {
      if (bill._id === billId) {
        // This is the bill we want to update
        return { ...bill, amount: 0 };
      } else {
        // This is not the bill we want to update, so we return it as is
        return bill;
      }
    });

    // Update the state with the new array
    setVendorBills(updatedVendorBills);
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
        title="Remove product ?"
        open={isDeleteItemFromBillModalOpen}
        okButtonProps={{ loading: isDeletingItemFromBill }}
        onOk={() => {
          removeItemFromVendorBill();
        }}
        onCancel={() => setIsDeleteItemFromBillModalOpen(false)}
        okText="Remove"
      ></Modal>
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
        okButtonProps={{ loading: isGeneratingBill, disabled: !vendorName }}
        okText="Add"
        onCancel={() => {
          setIsItemModalVisible(false);
          setMiscValue('');
        }}
      >
        <Select
          value={vendorName || 'Select vendor'}
          size="large"
          style={selectStyle}
          allowClear
          showSearch
          loading={vendorList.length === 0}
          onChange={(value) => {
            setVendorName(value);
            setMiscValue('');
          }}
          options={processVendorList()}
        />
        {vendorName === 'Misc' && (
          <Form>
            <Form.Item label="Misc additional name">
              <Input
                allowClear
                value={miscValue}
                onChange={(e) => setMiscValue(e.target.value)}
                placeholder="Enter additional name for Misc"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <div className={styles.generateBill}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker
              value={dayjs(date ? date : dayjs().format('YYYY-MM-DD'))}
              onChange={onDateChange}
              size="large"
            />
            <Descriptions bordered>
              <Descriptions.Item label="Total amount">
                {Number(
                  vendorBills
                    .reduce((acc, bill) => acc + parseFloat(bill.amount), 0)
                    .toFixed(2),
                ).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Button
              onClick={() => {
                setIsItemModalVisible(true);
              }}
              icon={<DiffOutlined />}
              type="primary"
              size="large"
              disabled={isGettingVendorBills}
            >
              Generate bill
            </Button>
          </div>
          <div className={styles.vendorBillsDisplayWrapper}>
            {isGettingVendorBills && <Spin style={spinStyle} size="large" />}
            {!isGettingVendorBills && vendorBills.length === 0 && (
              <Empty description="No bills found" style={emptyComponentStyle} />
            )}
            {vendorBills &&
              vendorBills.map((item, index) => {
                return (
                  <div className={styles.billMainContents} key={index}>
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
                        <div className={styles.amountWrapper}>
                          {getTotalAmount(item)}
                          <div className={styles.editIcon}>
                            <CloseCircleOutlined
                              onClick={() => setAmountToZero(item._id)}
                            />
                          </div>
                        </div>
                      </Descriptions.Item>
                      <Descriptions.Item label="Paid">
                        <div className={styles.paidTextAndSwitchWrapper}>
                          <div style={badgeWrapperStyle}>
                            {item.paid ? (
                              <Badge status="success" text="Paid" />
                            ) : (
                              <Badge status="processing" text="Not paid" />
                            )}
                          </div>
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
                                <List.Item key={index}>
                                  <div className={styles.listItemMainWrapper}>
                                    <div
                                      className={styles.titleAndHeaderWrapper}
                                    >
                                      <div
                                        className={styles.listItemTitleWrapper}
                                      >
                                        <span className={styles.listItemtitle}>
                                          {order.name}{' '}
                                          <div className={styles.editIcon}>
                                            <DeleteOutlined
                                              onClick={() => {
                                                setIsDeleteItemFromBillModalOpen(
                                                  true,
                                                );
                                                setCurrentDeleteItem({
                                                  billId: item._id,
                                                  item: order,
                                                });
                                              }}
                                            />
                                          </div>
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
                                        Vendor Price{' '}
                                        <span
                                          className={
                                            styles.vendorPriceFromAppWrapper
                                          }
                                        >
                                          ₹{order.vendorPrice}/{order.sdunit} :
                                        </span>
                                      </span>
                                      <div className={styles.innerInputWrapper}>
                                        <Input
                                          type="text" // Change the type to "text"
                                          placeholder="Enter vendor price"
                                          value={
                                            order.customVendorPrice
                                              ? order.customVendorPrice
                                              : amounts[item._id]?.[
                                                  order.name
                                                ] || ''
                                          }
                                          onChange={(e) => {
                                            const newVendorPrice =
                                              e.target.value; // Store the value as a string

                                            // Update the order object with the new vendor price
                                            order.customVendorPrice =
                                              newVendorPrice;

                                            // Get the current state of the updatedItem object
                                            const updatedItem = updatedItems[
                                              item._id
                                            ] || { ...item };

                                            // Update the updatedItem object with the new order in its orders array
                                            updatedItem.orders =
                                              updatedItem.orders.map((o, i) =>
                                                i === index ? order : o,
                                              );

                                            // Update the amounts state
                                            setAmounts((prevAmounts) => ({
                                              ...prevAmounts,
                                              [item._id]: {
                                                ...(prevAmounts[item._id] ||
                                                  {}),
                                                [order.name]:
                                                  parseFloat(newVendorPrice), // Parse the value to a number when updating the amounts state
                                              },
                                            }));

                                            // Update the updatedItems state
                                            setUpdatedItems(
                                              (prevUpdatedItems) => ({
                                                ...prevUpdatedItems,
                                                [item._id]: updatedItem,
                                              }),
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </List.Item>
                              );
                            })}
                          </List>
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                    <Button
                      loading={isSavingBill}
                      onClick={() =>
                        saveVendorBill(updatedItems[item._id] || item)
                      }
                      icon={<SaveOutlined />}
                      type="primary"
                      size="large"
                    >
                      Save
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;
