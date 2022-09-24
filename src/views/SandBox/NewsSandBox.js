import React,{useEffect} from 'react';

//组件
import SideMenu from '../../components/SideMenu/SideMenu';
import TopHeader from '../../components/TopHeader/TopHeader';

//内容显示区各路由组件
import CounterRouter from '../../components/ContentRouter/CounterRouter'; 

//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

//css
import './NewsSandBox.css';

import {Layout} from 'antd';
const {Content} = Layout;


export default function NewsSandBox() {
  //进度条开始 结束
  NProgress.start();
  useEffect(() => {
    NProgress.done()
  })
  
  return (
    <Layout className="data">

        <SideMenu></SideMenu>

        <Layout className="site-layout">
            <TopHeader className="site-layout-head"></TopHeader>

            {/* 内容显示区 */}
            <Content className="site-layout-background " style={{ margin: '24px 16px',padding: 24,minHeight: 280,overflow:'auto'}}>
                <CounterRouter></CounterRouter>
            </Content>

        </Layout>

    </Layout>
  )
}
