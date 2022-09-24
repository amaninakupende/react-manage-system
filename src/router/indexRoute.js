import React from 'react';
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom';
import Login from '../views/Login/Login';
import NewsSandBox from '../views/SandBox/NewsSandBox';
export default function indexRoute() {
  return (

        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/" component={NewsSandBox}></Route>
                {/* <Route path="/" render={()=>
                    localStorage.getItem("token") ? 
                    <NewsSandBox></NewsSandBox> :
                    <Redirect to="/login" />
                } /> */}
                
            </Switch>
        </HashRouter>

  )
}
