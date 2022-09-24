import React, { forwardRef, useState, useEffect } from 'react';

import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {

    const [isDisabled, setIsDisabled] = useState(false);
    const {roleId,region} = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
      setIsDisabled(props.isRegionDisabled);
    }, [props.isRegionDisabled]);
    
    const checkRegionOpt = (item)=> {   
        if(props.isUpdate) {
            if(roleId == 1) {
                return false;
            } else {
                console.log('###',item);
                return item.value !== region;
            }
        } 
    };
    
    const checkRoleOpt = (item)=> {
        if(roleId == 1) {
            return false;
        }else {
            console.log('@@@@',item);
            return item.id !== roleId && item.id < roleId

        }
    }

    return (
        <div>
            <Form layout="vertical" ref={ref}>
                <Form.Item name="username" label="用户名" rules={[{ required: true, message: 'please input' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" rules={[{ required: true, message: 'please input' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="region" label="区域" rules={isDisabled?[]:[{ required: true, message: 'please input' }]}>
                    <Select disabled={isDisabled}>
                        {
                            props.regionList.map(item => {
                                return <Option disabled={checkRegionOpt(item)} value={item.value} key={item.id}>{item.title}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="roleId" label="角色" rules={[{ required: true, message: 'please input' }]}>
                    <Select onChange={(value)=>{
                        if(value === 1) {
                            setIsDisabled(true);
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setIsDisabled(false)
                        }
                    }}>
                        {
                            props.roleList.map(item => {
                                return <Option disabled={checkRoleOpt(item)} value={item.id} key={item.id}>{item.roleName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm
