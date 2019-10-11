import React from 'react';
import Common from './common';
import './index.less';

class DraftArticle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        document.title = '草稿箱 - 博客后台';
    }

    render() {
        return <Common type="draft" router={this.props.router} />
    }
}

export default DraftArticle;