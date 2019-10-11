import React from 'react';
import Breadcrumb from '@/components/breadcrumb';
import DeleteConfirm from '@/components/deleteConfirm';
import CommentBtn from './commentBtn';
import { Table, Tag, Button, message } from 'antd';
import { getArticles, updateArticle, deleteArticle } from '@/api/article';
import './index.less';

const commonColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    key: 'createtime'
  },
  {
      title: '发布时间',
      dataIndex: 'pubtime',
      key: 'pubtime'
  },
  { title: '分类', dataIndex: 'archive', key: 'archive' },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    render: tags => {
        if (tags) {
            return <span>
                {JSON.parse(tags).map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={tag}>
                    {tag}
                    </Tag>
                );
                })}
            </span>
        }
        return <span>-</span>
    }
  },
  { title: '阅读', dataIndex: 'views', key: 'views' },
  { title: '喜欢', dataIndex: 'likes', key: 'likes' },
  {
      title: '评论',
      dataIndex: 'comments',
      key: 'comments'
  }
];

let columns = [];

class Common extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            data: [],
            total: 0,
            show: props.type === 'online' ? 1 : 0,
            loading: true
        };

        this.pageChange = this.pageChange.bind(this);
    }

    componentDidMount() {
        this.initColumnAction();
        this.getData();
    }

    initColumnAction() {
        if (this.state.show) {
            columns = [
                ...commonColumns,
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    width: 140,
                    render: (r) => <div className="article_item_action">
                        <Button size="small" onClick={() => this.changeArticleShowValue(r.id, 0)}>下线</Button>
                        <Button size="small"
                            onClick={() => this.props.router.push(`/admin/edit?id=${r.id}&type=update`)}>修改</Button>
                        <DeleteConfirm onConfirm={() => this.removeArticle(r.id)}>
                            <Button size="small">删除</Button>
                        </DeleteConfirm>
                        <CommentBtn id={r.id} count={r.comments} />
                    </div>
                }
            ];
        } else {
            columns = [
                ...commonColumns,
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    width: 140,
                    render: (r) => <div className="article_item_action">
                        <Button size="small" onClick={() => this.changeArticleShowValue(r.id, 1)}>发布</Button>
                        <Button size="small"
                            onClick={() => this.props.router.push(`/admin/edit?id=${r.id}&type=update`)}>修改</Button>
                        <DeleteConfirm onConfirm={() => this.removeArticle(r.id)}>
                            <Button size="small">删除</Button>
                        </DeleteConfirm>
                        <CommentBtn id={r.id} count={r.comments} />
                    </div>
                }
            ];
        }
    }

    getData() {
        getArticles({
            page: this.state.page,
            show: this.state.show
        }).then(res => {
            if (res.code === 200) {
                let { list, total } = res.data;

                list = list.map(item => {
                    item.key = item.id;
                    item.archive = item.channel.name;
                    return item;
                });

                this.setState({ data: list, total, loading: false });
            }
        });
    }

    pageChange(page) {
        this.setState({page, loading: true}, () => {
            this.getData();
        });
    }

    changeArticleShowValue(id, value) {
        updateArticle({
            id: id,
            show: value
        }).then(res => {
            const msg = value ? '文章发布成功' : '文章下线成功';
            this.funcCallback(res, msg);
        });
    }

    removeArticle(id) {
        deleteArticle(id).then(res => {
            this.funcCallback(res, '文章删除成功');
        });
    }

    funcCallback(res, msg) {
        if (res.code === 200) {
            message.success(msg);
            this.getData();
        } else {
            message.error(res.msg);
        }
    }

    render() {
        const { data, show, page, total, loading } = this.state;

        return <div className="article_list_wrap">
            <Breadcrumb pathes={['文章', `${show ? '线上文章' : '草稿箱'}`]} />
            <Table columns={columns} dataSource={data} loading={loading}
                scroll={{ x: 1300 }} pagination={{
                current: page, pageSize: 10, total: total, onChange: this.pageChange
            }} />
        </div>
    }
}

export default Common;