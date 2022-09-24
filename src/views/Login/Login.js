import React from 'react';
import './Login.css';
import {Form,Input,Checkbox,Button, message} from 'antd';
import {LockOutlined,UserOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';
// import Particles from "react-particles";
export default function Login(props) {

  const onFinish = (value)=> {
    // console.log(value);
    axios.get(`/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then(
      res => {
        // console.log(res);
        if(res.data.length !== 0) {
          message.success('登录成功',[1]);
          localStorage.setItem("token",JSON.stringify(res.data[0]));
          props.history.push('/home');
        } else {
          message.error('登陆失败',[1]);
        }
      }  
    )
  }
  return (
    <div style={{backgroundColor:'rgb(35,39,65)',height:'100%',}}>
      {/* <Particles /> */}
      <div style={{backgroundColor:'#BEE9C2',width:'300px',position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',padding:'10px'}}>
        <h2 style={{textAlign:'center'}}>后台系统管理登录</h2>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{required: true,message: 'Please input your Username!'},]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true,message: 'Please input your Password!'},]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
