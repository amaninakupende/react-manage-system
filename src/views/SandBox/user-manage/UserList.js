import React,{useState,useEffect,useRef} from 'react';
import axios from '../../../utils/axios';

import {Table, Button, Switch, Modal, message, } from 'antd';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import UserForm from '../../../components/UserManage/UserForm';
const { confirm } = Modal;

export default function UserList() {
  const [dataSource,setDataSource] = useState([]);
  //弹框标题
  const [title,setTitle] = useState('');
  const [isModalVisible,setIsModalVisible] = useState(false);
  //解决弹框中区域显示bug问题
  const [isRegionDisabled,setIsRegionDisabled] = useState(false);
  const [roleList,setRoleList] = useState([]);
  const [regionList,setRegionList] = useState([]);
  const [currentId, setCurrentId] = useState({});
  const form = useRef(null);

  const {roleId,username,region} = JSON.parse(localStorage.getItem("token"));

  useEffect(()=>{
    axios.get('/users?_expand=role').then((res)=>{
      // console.log(res.data);
      // const roleObj = {
      //   "1": "superadmin",
      //   "2": "admin",
      //   "3": "editor"
      // }
      // setDataSource(roleObj[roleId] === "superadmin" ? res.data : [
      //   ...res.data.filter(item => item.username === username),
      //   ...res.data.filter(item => item.region === region && roleObj[item.roleId] === "editor"),
      // ]);
      setDataSource(roleId === 1 ? res.data : [
        ...res.data.filter(item => item.username == username),
        ...res.data.filter(item => item.region == region && item.roleId == 3 )
      ]);
    });

    axios.get('/roles').then((res)=>{
      setRoleList(res.data);
    });

    axios.get('/regions').then((res)=>{
      setRegionList(res.data);
    })
  },[]);

  useEffect(() => {
    
  }, [isRegionDisabled])
  
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      // sorter: 'true',
      render:(region)=>{
        return (
          <b>{region===''?'全国':region}</b>
        )
      },
      filters:[
        {
          text: '全国',
          value: '全国'
        },
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        }))
      ],
      onFilter:(value,item)=>{
        if(value === '全球') {
          return item.region === ""
        } 
        return item.region === value
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role)=>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return (
          <div>
            <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
          </div>
        )
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
            <Button size='small' type='primary' icon={<EditOutlined />} onClick={()=>{handleUpdate(item);}} disabled={item.default}></Button>
            &nbsp;
            <Button size='small' danger icon={<DeleteOutlined />} disabled={item.default} onClick={()=>{showMessage(item)}}></Button>
          </div>
        )
      }
    }
  ]

  const handleDelete = (item)=> {
    setDataSource(dataSource.filter(data=>item.id !== data.id))
    axios.delete(`/users/${item.id}`);
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
  
  const handleChange = (item)=> {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);

    axios.patch(`/users/${item.id}`,{
      roleState: item.roleState
    })
  }

  const handleAdd = ()=> {
    setTitle('新增用户');
    setIsModalVisible(true);
    form.current.resetFields();
  }

  const handleUpdate = async (item)=> {
    setTitle('修改用户');
    await setIsModalVisible(true);
    await form.current.setFieldsValue(item);
    if (item.roleId === 1) {
      //禁用
      setIsRegionDisabled(true);
    } else {
      //取消禁用
      setIsRegionDisabled(false);
    }
    setCurrentId(item.id);
  }

  const formOk = ()=> {
    if(title=='新增用户') {                            //新增用户提交form表单
      form.current.validateFields().then((value)=>{
        setIsModalVisible(false);
   
        //重置表单
        form.current.resetFields();

        axios.post('/users',{
          ...value,
          roleState: true,
          default: false
        }).then((res) => {
          setDataSource([...dataSource, {
            ...res.data,
            role: roleList.filter(item => item.id === value.roleId)[0]
          }]);
          message.success('新增成功',[2]);   
        });
        
      }).catch((err)=>{
        console.log(err);
      });
    } else if(title=='修改用户') {
      form.current.validateFields().then((value)=>{    //修改用户提交form表单
        setIsModalVisible(false)
        setDataSource(dataSource.map(item=>{
          if(item.id === currentId) {
            return {
              ...item,
              ...value,
              role: roleList.filter(data => data.id === value.roleId)[0]
            }
          }
          return item;
        }))
        setIsRegionDisabled(!isRegionDisabled);
        axios.patch(`/users/${currentId}`,value);
        message.success('修改成功',[2]);   
      })
    }
    
    
  }

  return (
    <div>
      <Button type='primary' onClick={()=>{handleAdd()}}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:6}} rowKey={(item)=>item.id}></Table>
      
      {/* 新增的弹框 */}
      <Modal title={title} 
        visible={isModalVisible} 
        onCancel={()=>{setIsModalVisible(false);setIsRegionDisabled(!isRegionDisabled)}} 
        onOk={()=>{formOk()}}
      >
        <UserForm ref={form} roleList={roleList} regionList={regionList} isRegionDisabled={isRegionDisabled} isUpdate={true}/>
      </Modal>
    </div>
  ) 
}
