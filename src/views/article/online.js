import React from 'react';
import Common from './common';
import './index.less';

class OnlineArticle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        document.title = '发布的文章 - 博客后台';
    }

    render() {
        return <Common type="online" router={this.props.router} />
    }
}

export default OnlineArticle;