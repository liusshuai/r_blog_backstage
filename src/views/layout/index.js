import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Menu from '@/components/menu';
import LazyLoad from '@/components/LazyLoad';
import './index.less';

const AddArticlePage = LazyLoad(() => import('@/views/addArticle'));
const AddSourcePage = LazyLoad(() => import('@/views/addSource'));
const DraftArticlePage = LazyLoad(() => import('@/views/article/draft'));
const OnlineArticlePage = LazyLoad(() => import('@/views/article/online'));
const FollowPage = LazyLoad(() => import('@/views/follow'));
const BoardPage = LazyLoad(() => import('@/views/board'));
const SourcePage = LazyLoad(() => import('@/views/source'));
const BibiPage = LazyLoad(() => import('@/views/bibi'));

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return <BrowserRouter>
        <div className="layout_warp">
            <div className="menu">
                <Menu />
            </div>
            <div className="main">
                <Switch>
                    <Route exact path="/admin" component={BibiPage}></Route>
                    <Route path="/admin/source" component={SourcePage}></Route>
                    <Route path="/admin/addSource" component={AddSourcePage}></Route>
                    <Route path="/admin/follow" component={FollowPage}></Route>
                    <Route path="/admin/board" component={BoardPage}></Route>
                    <Route path="/admin/article" component={OnlineArticlePage}></Route>
                    <Route path="/admin/draft" component={DraftArticlePage}></Route>
                    <Route path="/admin/edit" component={AddArticlePage}></Route>
                </Switch>
            </div>
        </div>
    </BrowserRouter>
    }
}

export default Layout;