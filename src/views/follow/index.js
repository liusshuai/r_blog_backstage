import React from 'react';
import Breadcrumb from '@/components/breadcrumb';
import DeleteConfirm from '@/components/deleteConfirm';
import { Table, Button, message } from 'antd';
import { getFollow, removeFollow } from '@/api/follow';
import './index.less';

const columns = [
  {
    title: '昵称',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  }
];

class FollowPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            list: [],
            total: 0,
            loading: true
        };

        this.pageChange = this.pageChange.bind(this);
    }

    componentDidMount() {
        document.title = '关注我的 - 博客后台';
        columns[2] = {
            title: '操作',
            key: 'operation',
            render: (r) => <DeleteConfirm onConfirm={() => this.remove(r.id)}>
                <Button size="small" type="primary">删除</Button>
            </DeleteConfirm>
        }
        this.getFollows();
    }

    getFollows() {
        getFollow(this.state.page).then(res => {
            if (res.code === 200) {
                let { list, total } = res.data;

                list = list.map(item => {
                    item.key = item.id;

                    return item;
                });

                this.setState({ list, total, loading: false });
            }
        }); 
    }

    pageChange(page) {
        this.setState({page}, () => {
            this.getFollows();
        });
    }

    remove(id) {
        removeFollow(id).then(res => {
            if (res.code === 200) {
                message.success('删除成功');
                this.setState({
                    page: 1
                }, () => {
                    this.getFollows();
                });
            } else {
                message.error(res.msg);
            }
        });
    }

    render() {
        const { page, list, loading } = this.state;

        return <div className="follow_page_wrap">
            <Breadcrumb pathes={['订阅我的']} />
            <Table columns={columns} dataSource={list} loading={loading}
                pagination={{
                    current: page, pageSize: 20, onChange: this.pageChange
                }} />
        </div>
    }
}

export default FollowPage;