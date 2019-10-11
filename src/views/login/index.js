import React from 'react';
import { Input, Button, message } from 'antd';
import { login } from '@/api/admin';
import './index.less';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            account: '',
            password: ''
        };

        this.login = this.login.bind(this);
        this.setAccount = this.setAccount.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    componentDidMount() {
        document.title = '博客登录';
    }

    setAccount(e) {
        this.setState({
            account: e.target.value
        });
    }

    setPassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    login() {
        const { account, password } = this.state;
        if (!account) {
            message.error('用户名不能为空');
        } else if (!password) {
            message.error('密码不能为空');
        } else {
            login({
                account,
                password
            }).then(res => {
                if (res.code === 200) {
                    location.href = '/admin/';
                } else {
                    message.error(res.msg);
                }
            });
        }
    }

    render() {
        return <div className="login_page">
            <div className="login_main_box">
                <h1>博客后台系统</h1>
                <Input placeholder="用户名" onChange={this.setAccount} />
                <Input placeholder="密码" type="password" onChange={this.setPassword} />
                <Button type="primary" onClick={this.login}>登录</Button>
            </div>
        </div>
    }
}

export default LoginPage;