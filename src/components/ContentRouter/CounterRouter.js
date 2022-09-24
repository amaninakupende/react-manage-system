import React, { useEffect, useState } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Home from '../../views/SandBox/Home/Home';
import UserList from '../../views/SandBox/user-manage/UserList';
import RoleList from '../../views/SandBox/right-manage/RoleList';
import RightList from '../../views/SandBox/right-manage/RightList';
import NoPermission from '../NoPermission/NoPermission';
import axios from '../../utils/axios';

export default function CounterRouter() {

    const [routeList,setRouteList] = useState([]);

    useEffect(()=>{
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then((res)=>{
            setRouteList([...res[0].data,...res[1].data]);
            // console.log([...res[0].data,...res[1].data]);
        })
    },[]);

    const {role:{rights}} = JSON.parse(localStorage.getItem("token"));

    const LocalContentRouterMap = {
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
    }

    const checkRoute = (item)=> {
        return LocalContentRouterMap[item.key] && item.pagepermisson
    }

    const checkUserPermisson = (item)=> {
        return rights.includes(item.key)
    }

    return (
        <div>
            <Switch>
                {/* <Route path="/home" component={Home}></Route>
                <Route path="/user-manage/list" component={UserList}></Route>
                <Route path="/right-manage/role/list" component={RoleList}></Route>
                <Route path="/right-manage/right/list" component={RightList}></Route> */}
                {
                    routeList.map( (item) => 
                    {
                        if(checkRoute(item) && checkUserPermisson(item)) {
                           return <Route path={item.key} key={item.key} component={LocalContentRouterMap[item.key]} exact></Route>
                        }
                        // return null
                    }
                    )
                }

                <Redirect from="/" to="/home" exact/>
                <Route path="*" component={NoPermission}></Route>
            </Switch>
        </div>
    )
}
