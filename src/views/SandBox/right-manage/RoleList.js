import React, { useEffect, useState } from 'react';
import { Table,Button,Modal,Tree, message } from 'antd';
import {DeleteOutlined, EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons';

import axios from '../../../utils/axios';
import { withSuccess } from 'antd/lib/modal/confirm';
const {confirm} = Modal;
export default function RoleList() {

  const [dataSource,setDataSource] = useState([]);
  //权限名称
  const [rightList,setRightList] = useState([]);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [currentRights,setCurrentRights] = useState([]);
  const [currentId,setCurrentId] = useState([]);

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
      title: '角色',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item)=> {
        return (
          <div>
            <Button size='small' type='primary' icon={<EditOutlined />} onClick={()=>{setIsModalVisible(true); setCurrentRights(item.rights);setCurrentId(item.id)}}></Button>
            &nbsp;
            <Button size='small' danger icon={<DeleteOutlined />} onClick={()=>{showMessage(item)}} ></Button>
          </div>
        )
      }
    }
  ];

  useEffect(()=>{
    axios.get('/roles').then((res)=>{
      setDataSource(res.data);
    });
    axios.get('/rights?_embed=children').then((res)=>{
      setRightList(res.data);
    });
    
  },[])
 
  const handleDelete = (item)=> {
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id));
    // axios.delete(`/roles/${item.id}`).then(()=>{
    //   console.log('delete done');
    // })
    message.success('删除成功',[2]);
  }

  const showMessage = (item)=> {
    confirm({
      title: `Do you Want to delete ${item.roleName}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(item);
      },
      onCancel() {
      },
    });
  }

  const handleOk = ()=> {
    setDataSource(dataSource.map(item => {
      if(item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }));

    axios.patch(`/roles/${currentId}`,{rights:currentRights})
    
    setIsModalVisible(false);

    message.success('修改成功,请重新登录',[2]);
  }
  
  const handleCancel = ()=> {
    setIsModalVisible(false);
  }

  //改变树形结构中复选框选取
  const handleCheckedKeys = (checkedKeys)=> {
    // console.log(checkedKeys.checked);
    setCurrentRights(checkedKeys.checked);
  }

  return (
    <div>
      {/* 如果在返回的数据中找不到key 可以设置属性 rowKey */}
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>

      {/* 对话框展示树形结构 
        defaultCheckedKeys 带default字段的是 非受控组件 仅第一次受到实际请求影响
        不带default的是受控组件 会随着数据的变化而产生变化
      */}
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree 
          checkable
          checkedKeys={currentRights}
          onCheck={handleCheckedKeys}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
