import React from 'react';
import styles from './Expenses.module.css';
import { useState, useEffect, useRef } from 'react';
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
  DeleteOutlined,
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

const Expenses = () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isReloadButtonLoading, setIsReloadButtonLoading] = useState(false);
  const [isGenerateExpenseModalVisible, setIsGenerateExpenseModalVisible] =
    useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [isGeneratingExpense, setIsGeneratingExpense] = useState(false);
  const [isGettingAllExpenses, setIsGettingAllExpenses] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);
  const [isReleadButtonLoading, setIsReleadButtonLoading] = useState(false);
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);
  const [
    isAddPersonalExpenseModalVisible,
    setIsAddPersonalExpenseModalVisible,
  ] = useState(false);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [currentSelectedExpense, setCurrentSelectedExpense] = useState({});
  const [
    isAddingCompanyExpenseModalVisible,
    setIsAddingCompanyExpenseModalVisible,
  ] = useState(false);

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  const addExpenseButtonStyle = { width: '100%' };

  const formStyle = { padding: '16px 0 0 0' };

  const spinStyle = {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: 'translate(-50%)',
  };

  const columns = [
    {
      title: 'Index No.',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Remark',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];

  const generateExpense = () => {
    setIsGeneratingExpense(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/generate-expense`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: expenseName,
          date: new Date(date),
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsGeneratingExpense(false);
          setIsGenerateExpenseModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getAllExpense();
        setIsGeneratingExpense(false);
        setIsGenerateExpenseModalVisible(false);
        setExpenseName('');
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsGeneratingExpense(false);
        setIsGenerateExpenseModalVisible(false);
      });
  };

  const getAllExpense = () => {
    setIsGettingAllExpenses(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/get-all-expenses-by-date`,
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
          setIsGettingAllExpenses(false);
          setIsReloadButtonLoading(false);

          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setAllExpenses(data.expenses);
        setIsGettingAllExpenses(false);
        setIsReloadButtonLoading(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsGettingAllExpenses(false);
        setIsReloadButtonLoading(false);
      });
  };

  const deleteExpense = (item) => {
    setIsDeletingExpense(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/delete-expense`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: item.name,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setIsDeletingExpense(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        getAllExpense();
        setIsDeletingExpense(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setIsDeletingExpense(false);
      });
  };

  const addPersonalExpense = () => {
    if (!reason || !amount || !remarks) {
      toast.error('All fields must be filled out', {
        position: 'bottom-center',
      });
      return;
    }
    setIsAddingExpense(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/add-personal-expense`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: currentSelectedExpense.name,
          reason,
          amount,
          remarks,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setReason('');
          setAmount('');
          setRemarks('');
          setIsAddingExpense(false);
          setIsAddPersonalExpenseModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setReason('');
        setAmount('');
        setRemarks('');
        getAllExpense();
        setIsAddingExpense(false);
        setIsAddPersonalExpenseModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setReason('');
        setAmount('');
        setRemarks('');
        setIsAddingExpense(false);
        setIsAddPersonalExpenseModalVisible(false);
      });
  };

  const addCompanyExpense = () => {
    if (!reason || !amount || !remarks) {
      toast.error('All fields must be filled out', {
        position: 'bottom-center',
      });
      return;
    }
    setIsAddingExpense(true);
    window.electron
      .invoke('api-request', {
        method: 'POST',
        url: `${baseUrl}/crm/add-company-expense`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: currentSelectedExpense.name,
          reason,
          amount,
          remarks,
        },
      })
      .then((response) => {
        const data = JSON.parse(response.body);
        if (response.status !== 200) {
          toast.error(data.error, {
            position: 'bottom-center',
          });
          setReason('');
          setAmount('');
          setRemarks('');
          setIsAddingExpense(false);
          setIsAddingCompanyExpenseModalVisible(false);
          return;
        }
        toast.success(data.message, {
          position: 'bottom-center',
        });
        setReason('');
        setAmount('');
        setRemarks('');
        getAllExpense();
        setIsAddingExpense(false);
        setIsAddingCompanyExpenseModalVisible(false);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
        });
        setReason('');
        setAmount('');
        setRemarks('');
        setIsAddingExpense(false);
        setIsAddingCompanyExpenseModalVisible(false);
      });
  };

  const processExpenses = (expenses) => {
    let processedExpenses = [];
    expenses.forEach((expense, index) => {
      processedExpenses.push({
        index: index + 1,
        reason: expense.reason,
        amount: expense.amount,
        remarks: expense.remarks,
      });
    });
    return processedExpenses;
  };

  useEffect(() => {
    getAllExpense();
  }, []);

  useEffect(() => {
    if (date) {
      getAllExpense();
    }
  }, [date]);

  return (
    <>
      <Modal
        open={isGenerateExpenseModalVisible}
        title="Generate expense for?"
        onCancel={() => {
          setExpenseName('');
          setIsGenerateExpenseModalVisible(false);
        }}
        onOk={() => {
          generateExpense();
        }}
        okButtonProps={{ loading: isGeneratingExpense }}
        centered
      >
        <Input
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          placeholder="generate an expense for?"
        />
      </Modal>
      <Modal
        centered
        title="Add personal expense"
        open={isAddPersonalExpenseModalVisible}
        onOk={() => {
          addPersonalExpense();
        }}
        okButtonProps={{ loading: isAddingExpense }}
        onCancel={() => {
          setReason('');
          setAmount('');
          setRemarks('');
          setIsAddPersonalExpenseModalVisible(false);
        }}
      >
        <Form style={formStyle}>
          <Form.Item label="Reason">
            <Input.TextArea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Amount">
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Remarks">
            <Input.TextArea
              rows={3}
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        centered
        title="Add company expense"
        open={isAddingCompanyExpenseModalVisible}
        onOk={() => {
          addCompanyExpense();
        }}
        okButtonProps={{ loading: isAddingExpense }}
        onCancel={() => {
          setReason('');
          setAmount('');
          setRemarks('');
          setIsAddingCompanyExpenseModalVisible(false);
        }}
      >
        <Form style={formStyle}>
          <Form.Item label="Reason">
            <Input.TextArea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Amount">
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Remarks">
            <Input.TextArea
              rows={3}
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div className={styles.expenses}>
        <div className={styles.mainContents}>
          <div className={styles.datePickerWrapper}>
            <DatePicker
              value={dayjs(date ? date : dayjs().format('YYYY-MM-DD'))}
              onChange={onDateChange}
              size="large"
            />
            <Button
              onClick={() => {
                getAllExpense();
                setIsReloadButtonLoading(true);
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
            <Button
              onClick={() => {
                setIsGenerateExpenseModalVisible(true);
              }}
              type="primary"
              size="large"
            >
              <PlusOutlined />
              Generate expense
            </Button>
          </div>
          <div className={styles.expensesWrapper}>
            {isGettingAllExpenses && <Spin style={spinStyle} size="large" />}
            {!isGettingAllExpenses && (
              <>
                {allExpenses.map((item, index) => {
                  return (
                    <div key={index} className={styles.expenseItemStyle}>
                      <div className={styles.deleteButtonWrapper}>
                        <Popconfirm
                          title="Are you sure to delete this expense?"
                          onConfirm={() => deleteExpense(item)}
                          okText="Yes"
                          okButtonProps={{ loading: isDeletingExpense }}
                          cancelText="No"
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            type="primary"
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                      <Descriptions
                        key={index}
                        layout="vertical"
                        bordered
                        column={2}
                      >
                        <Descriptions.Item label="Name">
                          {item.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">
                          {moment(item.date).format('D-M-YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label="Personal expenses">
                          {item.personalExpense.length > 0 && (
                            <Table
                              dataSource={processExpenses(item.personalExpense)}
                              columns={columns}
                              rowKey={(record, index) => index}
                              pagination={false}
                            />
                          )}
                          <Button
                            onClick={() => {
                              setCurrentSelectedExpense(item);
                              setIsAddPersonalExpenseModalVisible(true);
                            }}
                            style={addExpenseButtonStyle}
                            type="dashed"
                          >
                            <PlusOutlined />
                            Add personal expense
                          </Button>
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label="Company expenses">
                          {item.companyExpense.length > 0 && (
                            <Table
                              dataSource={processExpenses(item.companyExpense)}
                              columns={columns}
                              rowKey={(record, index) => index}
                              pagination={false}
                            />
                          )}
                          <Button
                            onClick={() => {
                              setCurrentSelectedExpense(item);
                              setIsAddingCompanyExpenseModalVisible(true);
                            }}
                            style={addExpenseButtonStyle}
                            type="dashed"
                          >
                            <PlusOutlined />
                            Add company expense
                          </Button>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Expenses;
