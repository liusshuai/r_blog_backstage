import React from 'react';
import { Breadcrumb } from 'antd';
import './index.less';

const breadcrumbFuc = (props) => {

    const { pathes = [] } = props;

    return <div className="breadcrumb_wrap">
        <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {
                pathes.map(path => <Breadcrumb.Item key={path}>
                    {path}
                </Breadcrumb.Item>)
            }
        </Breadcrumb>
    </div>
};

export default breadcrumbFuc;