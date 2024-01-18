import React from 'react';
import { useState } from 'react';
import styles from './BookKeeping.module.css';
import { CommentOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { FloatButton } from 'antd';

const BookKeeping = () => {
  return (
    <>
      <div>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{ right: 48 }}
          icon={<PlusOutlined />}
        >
          <FloatButton icon={<CommentOutlined />} />
          <FloatButton icon={<EditOutlined />} />
        </FloatButton.Group>
      </div>
    </>
  );
};

export default BookKeeping;
