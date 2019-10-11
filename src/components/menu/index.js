import React from 'react';
import { Menu, Icon, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { logout } from '@/api/admin';
import './index.less';

const { SubMenu } = Menu;

const menuFuc = () => {

    const logoutSystem = () => {
        logout().then(res => {
            if (res.code !== 200) {
                message.error(res.msg);
            }

            location.href = '/admin/login';
        });
    }

    return <div className="menu">
        <div>
            <div className="logo">
                <img src="/static/images/logo_dark.png" />
            </div>
            <Menu
                defaultSelectedKeys={[location.pathname]}
                mode="inline"
                theme="dark">
                <Menu.Item key="/admin/">
                    <Link to="/admin/">
                    <Icon type="clock-circle" />
                    <span>bibi talk</span></Link>
                </Menu.Item>
                <Menu.Item key="/admin/source"><Link to="/admin/source">
                    <Icon type="play-square" />
                    <span>资源 source</span>
                </Link>
                </Menu.Item>
                <Menu.Item key="/admin/follow"><Link to="/admin/follow">
                    <Icon type="alert" />
                    <span>订阅我的</span>
                    </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={
                    <span>
                        <Icon type="profile" />
                        <span>文章</span>
                    </span>}>
                    <Menu.Item key="/admin/edit">
                        <Link to="/admin/edit">新增文章</Link>
                    </Menu.Item>
                    <SubMenu key="sub3" title="我的文章">
                        <Menu.Item key="/admin/article">
                            <Link to="/admin/article">线上文章</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/draft">
                            <Link to="/admin/draft">草稿箱</Link>
                        </Menu.Item>
                    </SubMenu>
                </SubMenu>
                <Menu.Item key="/admin/board"><Link to="/admin/board">
                    <Icon type="message" />
                    <span>留言版</span>
                    </Link>
                </Menu.Item>
            </Menu>
        </div>
        <div className="logout_btn">
            <Button type="dashed" icon="logout" onClick={logoutSystem}
                style={{background: 'transparent', color: '#fff'}}>登出</Button>
        </div>
    </div>
}

export default menuFuc;