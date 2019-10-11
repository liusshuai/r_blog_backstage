import React from 'react';
import Breadcrumb from '@/components/breadcrumb';
import { Input, Icon, Button, Select, Upload, message, Spin } from 'antd';
import BibiBox from '@/components/bibiBox';
import MoreBtn from '@/components/moreBtn';
import { getBibis, addBibi, removeBibi } from '@/api/tweet';
import './index.less';

const { TextArea } = Input;

class BibiPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            list: [],
            total: 0,
            content: '',
            img: '',
            tags: [],
            loading: true
        };

        this.deleteBibi = this.deleteBibi.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.getBibiContent = this.getBibiContent.bind(this);
        this.submitBibi = this.submitBibi.bind(this);
        this.getTags = this.getTags.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
        this.closeImg = this.closeImg.bind(this);
    }

    componentDidMount() {
        document.title = 'bibi talk - 博客后台';
        this.getBibiList();
    }

    deleteBibi(id) {
        removeBibi(id).then(res => {
            if (res.code === 200) {
                const { list, total } = this.state;
                const idx = list.findIndex(item => item.id === id);
                if (idx > -1) {
                    list.splice(idx, 1);
                    this.setState({ list, total: total - 1 });

                    message.success('删除成功');
                } else {
                    message.error('行博不存在');
                }
            } else {
                message.error(res.msg);
            }
        });
    }

    getBibiList() {
        getBibis({
            page: this.state.page
        }).then(res => {
            if (res.code === 200) {
                const { data, total } = res.data;
                let list = this.state.list;
                if (this.state.page > 1) {
                    list = list.concat(data)
                } else {
                    list = data;
                }
                this.setState({
                    list, total,
                    loading: false
                });
            }
        });
    }

    loadMore() {
        const { total, list } = this.state;
        if (total === list.length) return;
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.getBibiList();
        });
    }

    getBibiContent(e) {
        this.setState({
            content: e.target.value
        });
    }

    submitBibi() {
        const { content, tags, img } = this.state;
        if (!content) {
            message.error('发布内容不能为空');
            return;
        }
        const params = {
            content: content,
            fromw: JSON.stringify(tags)
        }

        if (img) {
            params.imgs = JSON.stringify([img]);
        }

        addBibi(params).then(res => {
            if (res.code === 200) {
                message.success('bibi发布成功');
                this.setState({ page: 1 }, () => {
                    this.getBibiList();
                });

                this.clearData();
            }
        });
    }

    clearData() {
        this.setState({
            content: '',
            img: '',
            tags: []
        });
    }

    getTags(value) {
        this.setState({
            tags: value
        });
    }

    uploadImg(info) {
        const { status, response } = info.file;
        if (status === 'done') {
            if (response.success) {
                this.setState({ img: response.data.url });
            } else {
                message.error(response.msg);
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    closeImg() {
        this.setState({
            img: ''
        });
    }

    render() {
        const { list, total, img, content, tags, loading } = this.state;

        return<div className="bibi_page_wrap">
            <Breadcrumb pathes={['bibi']} />
            <div className="bibi_textarea">
                <TextArea placeholder="something you want to say..." value={content}
                    autosize={false} onChange={this.getBibiContent} />
                <Upload name="file" onChange={this.uploadImg}
                    action="/api/upload/upload?type=bibi" showUploadList={false}>
                    <span className="pic_upload">
                        <Icon type="camera" />
                    </span>
                </Upload>
            </div> 
            <div className="bibi_tags">
                <Select mode="tags" value={tags}
                    placeholder="Please select"
                    onChange={this.getTags}
                    style={{ width: '100%' }}></Select>
                <Button onClick={this.submitBibi} type="primary">发布</Button>
            </div>
            { img ? <div className="upoload_img_list">
                <span className="img_wrap">
                    <img src={img} />
                    <span className="close_btn" onClick={this.closeImg}>✕</span>
                </span>
            </div> : null }
            <div className="bibi_list_wrap">
                <h1>💓 历史发布</h1>
                <Spin spinning={loading}>
                    <ul className="bibi_list_main">
                        { list.map(item => <li key={item.id}>
                            <BibiBox data={item} total={total} deleteBibi={this.deleteBibi} />
                        </li>) }
                    </ul>
                </Spin>
                { total > list.length ? <MoreBtn loadMore={this.loadMore} /> : null}
            </div>
        </div>
    }
}

export default BibiPage;