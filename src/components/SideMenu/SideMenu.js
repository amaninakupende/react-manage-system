import React,{useState,useEffect} from 'react'
import {withRouter} from 'react-router-dom';
import axios from '../../utils/axios';

import {Menu,Layout,} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  UserSwitchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const {Sider} = Layout;

function SideMenu(props) {

  const [collapsed] = useState(false);
  const [menu,setMenu] = useState([]);

  useEffect( ()=> {
    axios.get("/rights?_embed=children&pagepermisson=1").then( res => {
      // console.log(res);
      setMenu(res.data);
    });
  },[]);

  // menu图形列表
  const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <TeamOutlined />,
    "/right-manage": <SettingOutlined />,
    "/right-manage/role/list": <UserSwitchOutlined />,
    "/right-manage/right/list": <UserAddOutlined />
  }

  const handleItem = (key,icon,label,children)=> {
    return {
      key,
      icon,
      label,
      children
    }
  }
 
  const {role:{rights}} = JSON.parse(localStorage.getItem('token'));
  // console.log(rights);
  //检查当前用户 所具有的菜单权限列表
  const checkPagepermisson = (item)=> {
    return item.pagepermisson && rights.includes(item.key);
  } 

  const renderMenu = (list)=> {
    const arr = [];
    list.map(item => {

      if(checkPagepermisson(item) && item.children && item.children.length !== 0) {
        return arr.push(handleItem(item.key,iconList[item.key],item.title,renderMenu(item.children)));
      } else if(item.pagepermisson && checkPagepermisson(item)){
        return arr.push(handleItem(item.key,iconList[item.key],item.title));
      }
    })
    return arr;
  }

  const showItem = (e) => {
    props.history.push(e.key);
  }
  
  const selectedKeys = [props.location.pathname];
  const openKeys = ["/" + props.location.pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div className="logo" style={{lineHeight: '32px', color: 'white', backgroundColor: 'rgb(255,255,255,0.0)', fontSize: '18px', margin: '10px', textAlign: 'center' }}>
          后台管理系统</div>
        <div style={{flex: "1",overflow:"auto"}}>
          <Menu
            theme="dark"
            mode="inline"                    //菜单竖向排列
            selectedKeys={selectedKeys}      //默认打开页面选中哪个选项
            defaultOpenKeys={openKeys}              //默认打开页面选中哪个子选项
            items={renderMenu(menu)}
            onClick={showItem}
          />
        </div>
      </div>
        
    </Sider>
  )
}

export default withRouter(SideMenu);