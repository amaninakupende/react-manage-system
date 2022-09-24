import React from 'react';
import {withRouter} from 'react-router-dom';
import {useState} from 'react';
import {Layout,Dropdown,Menu,Avatar} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';

const {Header} = Layout;
function TopHeader(props) {

  const [collapsed,setCollapsed] = useState(false);
  // console.log(JSON.parse(localStorage.getItem('token')));
  const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'));

  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  }
  
  const menu = (
    <Menu
    onClick={(item)=>{
      // console.log(item);
      if(item.key == '2') {
        localStorage.removeItem('token');
        props.history.push('/login');
      }
    }}
    items={[
      {
        label: roleName,
        key: '1',
      },
      {
        type: 'divider',
      },
      {
        label: '退出',
        key: '2',
        danger: true
      },
    ]}
  />
    
  );


  return (

    <Header className="site-layout-background" style={{padding: '0 16px'}} >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>

      }
      <div style={{float: "right"}}>
        <span>{username}</span>&nbsp;&nbsp;
        <Dropdown overlay={menu}>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
    
  )
}
export default withRouter(TopHeader)