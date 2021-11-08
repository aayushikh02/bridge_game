import { useState, useEffect } from 'react';
import { Table } from 'antd';
import styles from './App.css';
import axios from 'axios';

const Details = (props) => {
    const {data} = props;
  const columns = [
    {
      title: 'PLAYER',
      dataIndex: 'PLAYER',
      key: 'PLAYER',
    },
    {
      title: 'SPADES',
      dataIndex: 'SPADES',
      key: 'SPADES',
    },
    {
      title: 'HEARTS',
      dataIndex: 'HEARTS',
      key: 'HEARTS',
    },
    {
      title: 'DIAMONDS',
      dataIndex: 'DIAMONDS',
      key: 'DIAMONDS',
    },
    {
      title: 'CLUBS',
      dataIndex: 'CLUBS',
      key: 'CLUBS',
    },
  ];

  return (
    <div style={{ height: '200px', width: '200px' }}>
      <Table pagination={false} size="small" dataSource={data} columns={columns} />
    </div>
  );
};

export default Details;
