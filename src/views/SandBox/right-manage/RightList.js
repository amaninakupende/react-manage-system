import React,{useState,useEffect} from 'react';
import axios from '../../../utils/axios';

import { Space, Table, Tag, Button, Modal, Popover, Switch, message} from 'antd';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
const { confirm } = Modal;

export default function RightList() {
  useEffect(()=>{
    axios.get('/rights?_embed=children').then((result) => {
      result.data.forEach( item => {
        if(item.children.length == 0) {
          item.children = "";
        }
      })
      setDataSource(result.data);
    })
  },[])

  const [dataSource,setDataSource] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return (
          <b>{id}</b>
        )
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render:(key)=>{
        return (
          <Tag color='blue'>{key}</Tag>
        )
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
            <Popover content={<div style={{textAlign:"center"}}><Switch checked={item.pagepermisson} onChange={()=>{handleStatus(item)}}></Switch></div>} title="状态" trigger={item.pagepermisson===undefined?'':'click'} >
              <Button size='small' type='primary' icon={<EditOutlined />} disabled={item.pagepermisson===undefined}></Button>
            </Popover>
            &nbsp;
            <Button size='small' danger icon={<DeleteOutlined />} onClick={()=>{showMessage(item)}} ></Button>
          </div>
        )
      }
    }
  ];

  const handleStatus = (item)=> {
    item.pagepermisson = item.pagepermisson===1?0:1;
    // console.log(item);
    setDataSource([...dataSource]);
    if(item.grade == 1) {
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson});
    }else {
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson});
    }

    message.success('修改成功,请刷新')
  }

  const handleDelete = (item)=> {
    // console.log(item);
    if(item.grade == 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id));
      // axios.delete(`/rights/${item.id}`);
    }else {
      // console.log(item.rightId);
      let list = dataSource.filter(data => data.id == item.rightId);
      // console.log(list);
      list[0].children = list[0].children.filter(data => data.id !== item.id);
      // console.log(list[0].children);
      setDataSource([...dataSource]);
      // axios.delete(`/children/${item.id}`);
    }
  }

  const showMessage = (item)=> {
    confirm({
      title: `Do you Want to delete ${item.title}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(item);
      },
      onCancel() {
      },
    });
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/>
    </div>
  )
}
