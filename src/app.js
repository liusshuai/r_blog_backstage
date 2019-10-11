import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './views/layout';
import Login from './views/login';
import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom';
import { isLogin } from '@/api/admin';
import './assets/style/init.css';

class App extends React.Component {

    componentDidMount() {
        if (location.pathname === '/admin/login') return;
        isLogin().then(res => {
            if (res.code === 301) {
                location.href = '/admin/login';
            }
        });
    }

    render () {
        return (<BrowserRouter>
            <Switch>
                <Route exact path="/admin" component={Layout} />
                <Route path='/admin/login' component={Login} />
                <Route path='/admin/*' component={Layout} />
            </Switch>
        </BrowserRouter>   
        // <Layout />
        );
    }
};

ReactDOM.render(<App/>, document.getElementById('app'));