import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb';
import { Button, Pagination, Spin, Tooltip, message } from 'antd';
import SourceBox from '@/components/sourceBox';
import { getMovies, removeMovie } from '@/api/source';
import './index.less';

class SourcePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            list: [],
            total: 0,
            loading: true
        };

        this.pageChange = this.pageChange.bind(this);
        this.deleteSource = this.deleteSource.bind(this);
    }

    componentDidMount() {
        document.title = '我的资源 - 博客后台';
        this.getData();
    }

    getData() {
        getMovies({
            page: this.state.page
        }).then(res => {
            if (res.code === 200) {
                const { list, total } = res.data;

                this.setState({ list, total, loading: false });
            }
        });
    }

    pageChange(page) {
        this.setState({page}, () => {
            this.getData();
        });
    }

    deleteSource(id) {
        removeMovie(id).then(res => {
            if (res.code === 200) {
                message.success('删除成功');
                this.setState({ page: 1 }, () => {
                    this.getData();
                });
            } else {
                message.error(res.msg);
            }
        });
    }

    render() {
        const { page, list, total, loading } = this.state;

        return <div className="source_page_wrap">
            <Breadcrumb pathes={['资源']} />
            <div>
                <Tooltip title="新增资源" placement="right">
                    <Link to="/admin/addSource">
                        <Button type="primary" shape="circle" icon="plus" />
                    </Link>
                </Tooltip>
            </div>
            <Spin spinning={loading}>
            <div className="source_list_wrap">
                <ul className="source_list">
                   { list.map(item => <li key={item.id}>
                       <SourceBox data={item} deleteBibi={this.deleteSource} /></li>) }
                </ul>
            </div>
            </Spin>
            <Pagination current={page} pageSize={20} total={total} onChange={this.pageChange} />
        </div>
    }
}

export default SourcePage;