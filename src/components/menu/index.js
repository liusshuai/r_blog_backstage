import React from 'react';
import { Menu, Icon, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { logout } from '@/api/admin';
import { initRouter } from '@/util/util';
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
                <img src="http://www.lsshuai.com/static/images/logo_dark.png" />
            </div>
            <Menu
                defaultSelectedKeys={[location.pathname]}
                mode="inline"
                theme="dark">
                <Menu.Item key={initRouter()}>
                    <Link to={initRouter()}>
                    <Icon type="clock-circle" />
                    <span>bibi talk</span></Link>
                </Menu.Item>
                <Menu.Item key={initRouter('/source')}><Link to={initRouter('/source')}>
                    <Icon type="play-square" />
                    <span>资源 source</span>
                </Link>
                </Menu.Item>
                <Menu.Item key={initRouter('/follow')}><Link to={initRouter('/follow')}>
                    <Icon type="alert" />
                    <span>订阅我的</span>
                    </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={
                    <span>
                        <Icon type="profile" />
                        <span>文章</span>
                    </span>}>
                    <Menu.Item key={initRouter('/edit')}>
                        <Link to={initRouter('/edit')}>新增文章</Link>
                    </Menu.Item>
                    <SubMenu key="sub3" title="我的文章">
                        <Menu.Item key={initRouter('/article')}>
                            <Link to={initRouter('/article')}>线上文章</Link>
                        </Menu.Item>
                        <Menu.Item key={initRouter('/draft')}>
                            <Link to={initRouter('/draft')}>草稿箱</Link>
                        </Menu.Item>
                    </SubMenu>
                </SubMenu>
                <Menu.Item key={initRouter('/board')}><Link to={initRouter('/board')}>
                    <Icon type="message" />
                    <span>留言版</span>
                    </Link>
                </Menu.Item>
            </Menu>
        </div>
        <div className="logout_btn">
            <div className="avatar"></div>
            <Button icon="logout" onClick={logoutSystem} size="small"
                style={{background: 'transparent', color: '#fff', fontSize: '12px'}}>登出</Button>
        </div>
    </div>
}

export default menuFuc;