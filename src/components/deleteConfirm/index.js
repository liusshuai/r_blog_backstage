import React from 'react';
import { Popconfirm, message, Button } from 'antd';
import './index.less';

const deleteConfirmFuc = (props) => {
    return <Popconfirm title="确认删除吗?"
        onConfirm={props.onConfirm}
        okText="确认" cancelText="取消">
        {props.children || <span>删除</span>}
    </Popconfirm>
};

export default deleteConfirmFuc;