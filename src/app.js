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
import { initRouter } from '@/util/util';

class App extends React.Component {

    componentDidMount() {
        const path = initRouter('/login');
        if (location.pathname === path) return;
        isLogin().then(res => {
            if (res.code === 301) {
                location.href = path;
            }
        });
    }

    render () {
        return (<BrowserRouter>
            <Switch>
                <Route exact path={initRouter()} component={Layout} />
                <Route path={initRouter('/login')} component={Login} />
                <Route path={initRouter('/*')} component={Layout} />
            </Switch>
        </BrowserRouter>   
        // <Layout />
        );
    }
};

ReactDOM.render(<App/>, document.getElementById('app'));