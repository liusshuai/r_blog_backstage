import React from 'react';
import Breadcrumb from '@/components/breadcrumb';
import MessBox from '@/components/messBox';
import { getCommentByBoard } from '@/api/comment';
import MoreBtn from '@/components/moreBtn';
import { Spin } from 'antd';
import './index.less';

class BoradPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            boards: [],
            total: 0,
            loading: true
        };

        this.loadMore = this.loadMore.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
    }

    componentDidMount() {
        document.title = '留言板 - 博客后台';
        this.getBoards();
    }

    getBoards() {
        getCommentByBoard({
            page: this.state.page
        }).then(res => {
            if (res.code === 200) {
                const { list, total } = res.data;
                const boards = this.state.boards;
                this.setState({ 
                    boards: boards.concat(list),
                    total,
                    loading: false
                });
            }
        });
    }

    handleCallback() {
        this.setState({
            page: 1,
            boards: []
        }, () => {
            this.getBoards();
        });
    }
 
    loadMore() {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.getBoards();
        });
    }

    render() {
        const { boards, total, loading } = this.state;
        return <div className="board_page_wrap">
            <Breadcrumb pathes={[`留言板（${total}）`]} />
            <Spin spinning={loading}>
                <MessBox data={boards} total={total} removeCallback={this.handleCallback}
                    type={3} answerCallback={this.handleCallback} />
            </Spin>
            { total > boards.length ? <MoreBtn loadMore={this.loadMore} /> : null}
        </div>
    }
}

export default BoradPage;