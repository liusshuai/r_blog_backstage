import React from 'react';
import Breadcrumb from '@/components/breadcrumb';
import {
    Form,
    Input,
    Select,
    Button,
    Tooltip,
    Modal,
    message,
    Spin,
    Tabs,
    Upload
} from 'antd';
import BraftEditor from 'braft-editor';
import {
    getArticleChannel,
    addChannel,
    addArticle,
    getArticleDetail,
    updateArticle
} from '@/api/article';
import { parseUrl } from '@/util/util';
import upLoadImg from '@/api/upload';
import 'braft-editor/dist/index.css';
import './index.less';
const { Option } = Select;
const TextArea = Input.TextArea;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
    },
};
const mediaParams = {
    allowPasteImage: true,
    image: true, // 开启图片插入功能
    video: false, // 开启视频插入功能
    audio: false, // 开启音频插入功能
    validateFn: null, // 指定本地校验函数
    uploadFn: null, // 指定上传函数
};

let editType = 'create';
let aid = 0;
class AddSourcePage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isShowAddChannelModal: false,
            newCahnnel: '',
            channels: [],
            loading: true
        };

        this.addChannelOk = this.addChannelOk.bind(this);
        this.setNewChannelName = this.setNewChannelName.bind(this);
        this.coverUpload = this.coverUpload.bind(this);
    }

    componentDidMount() {
        this.getChannels();

        const params = parseUrl(location.search);
        if (params.type === 'update' && params.id) {
            document.title = '更新文章 - 博客后台';
            editType = 'update';
            aid = params.id;
            this.initData(params.id);
        } else {
            document.title = '新增文章 - 博客后台';
            editType = 'create';
            this.setState({ loading: false });
        }
    }

    initData(id) {
        getArticleDetail(id).then(res => {
            if (res.code === 200) {
                const data = res.data;
                this.props.form.setFieldsValue({
                    title: data.title,
                    channel: data.channel.id,
                    desc: data.desc,
                    tags: JSON.parse(data.tags),
                    outurl: data.outurl,
                    coverpos: data.coverpos || 0,
                    cover: data.cover || ''
                });

                const editorState = BraftEditor.createEditorState(data.content);
                this.refs.editor.setValue(editorState);
            } else {
                message.error(res.msg);
            }

            this.setState({ loading: false });
        });
    }

    getChannels() {
        getArticleChannel().then(res => {
            if (res.code === 200) {
                this.setState({
                    channels: res.data
                });
            }
        });
    }

    toggleAddChannelModal(type) {
        this.setState({
            isShowAddChannelModal: type
        });
    }

    addChannelOk() {
        const { newCahnnel } = this.state;
        if(!newCahnnel) {
            message.error('请输入分类名称');
            return;
        }

        addChannel({
            name: newCahnnel
        }).then(res => {
            if (res.code === 200) {
                message.success('分类创建成功');
                this.getChannels();
                this.toggleAddChannelModal(false);
            } else {
                message.error(res.msg);
            }
        });
    }

    setNewChannelName(e) {
        this.setState({
            newCahnnel: e.target.value
        });
    }

    uploadImage(param) {
        let formData = new FormData();

        formData.append('files', param.file);

        upLoadImg('article', formData).then(res => {
            if (res.success) {
                param.success(res.data);
            } else {
                message.error('图片上传失败，请稍后重试!');
            }
        });
    }

    sublimArticle(type) {
        const values = this.props.form.getFieldsValue();
        const editorState = this.refs.editor.getValue();
        values.content = editorState.toHTML();
        values.show = type;
        if (values.tags) {
            values.tags = JSON.stringify(values.tags);
        }

        if (this.judgeParams(values)) {
            if (editType === 'create') {
                this.createArticle(values);
            } else {
                values.id = aid;
                this.updateArticle(values);
            }
        }
    }

    judgeParams(params) {
        const _p_text = {
            title: '标题不能为空',
            content: '文章内容不能为空',
            channel: '请给问文章选择一个分类'
        };

        for(let key in _p_text) {
            if (!params[key]) {
                message.error(_p_text[key]);
                return false;
            }
            if (key === 'content' && params[key] === '<p></p>' && !params.outurl) {
                message.error(_p_text[key]);
                return false;
            }
        }

        return true;
    }

    createArticle(params) {
        addArticle(params).then(res => {
            if (res.code === 200) {
                const msg = params.show ? '文章发布成功' : '文章保存成功';
                message.success(msg);
                this.routerGo(params.show);
            } else {
                message.error(res.msg);
            }
        });
    }

    updateArticle(params) {
        updateArticle(params).then(res => {
            if (res.code === 200) {
                message.success('文章修改成功');
                this.routerGo(params.show);
            } else {
                message.error(res.msg);
            }
        });
    }

    routerGo(type) {
        if (type) {;
            this.props.router.push('/admin/article');
        } else {
            this.props.router.push('/admin/draft');
        }
    }

    coverUpload(info) {
        const { status, response } = info.file;
        if (status === 'done') {
            if (response.success) {
                this.props.form.setFieldsValue({
                    cover: response.data.url
                });
            } else {
                message.error(response.msg);
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    render() {
        const { isShowAddChannelModal, channels, loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        mediaParams.uploadFn = this.uploadImage;

        return <div className="article_add_page_wrap">
            <Breadcrumb pathes={['文章', '新建文章']} />
            <Spin spinning={loading}>
                <div className="add_main_form">
                    <Form {...formItemLayout}>
                        <Form.Item label="标题">
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    message: '标题不能为空',
                                }],
                            })(<Input style={{ width: 400 }} />)}
                        </Form.Item>
                        <Form.Item label="分类">
                            <div>
                                {getFieldDecorator('channel', {
                                    rules: [{
                                        required: true,
                                        message: '请选择一个分类',
                                    }],
                                })(<Select style={{ width: 200 }} placeholder="请选择一个类型">
                                    {channels.map(channel => <Option key={channel.id} 
                                        value={channel.id}>{channel.name}</Option>)}
                                </Select>)}
                                <Tooltip title="新增分类">
                                    <Button style={{marginLeft: '8px'}} type="primary"
                                        shape="circle" icon="plus"
                                        onClick={() => this.toggleAddChannelModal(true)} />
                                </Tooltip>
                            </div>
                        </Form.Item>
                        <Form.Item label="标签">
                            {getFieldDecorator('tags')(
                                <Select mode="tags"></Select>
                            )}
                        </Form.Item>
                        <Form.Item label="封面">
                            <InputGroup compact style={{display: 'flex', alignItems: 'center'}}>
                                <Form.Item style={{marginBottom: 0}}>
                                    {getFieldDecorator('coverpos', {initialValue: 0})(
                                        <Select style={{width: 120}}>
                                            <Option value={0}>Top</Option>
                                            <Option value={1}>Left</Option>
                                            <Option value={2}>Right</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item style={{marginBottom: 0}}>
                                    {getFieldDecorator('cover')(<Input style={{width: 500}} />)}
                                </Form.Item>
                                <Upload name="file"
                                    showUploadList={false}
                                    onChange={this.coverUpload}
                                    action="/api/upload/upload?type=article">
                                    <Button type="primary">上传</Button>
                                </Upload>
                            </InputGroup>
                        </Form.Item>
                        <Form.Item label="简介">
                            {getFieldDecorator('desc')(<TextArea />)}
                        </Form.Item>
                        <Form.Item>
                            <Tabs style={{width: '853px'}} type="card">
                                <TabPane tab="编辑器" key="editor">
                                    <BraftEditor style={{border: '1px solid #eee',
                                        width: '853px', margin: '0 auto'}}
                                        id="markdown_content"
                                        media={mediaParams} ref="editor"
                                        excludeControls={['emoji']} />
                                </TabPane>
                                <TabPane tab="外部链接" key="outurl">
                                    <Form.Item label="链接">
                                        {getFieldDecorator('outurl')(
                                            <Input placeholder="外链不为空则编辑器内容将被忽略" />)}
                                    </Form.Item>
                                </TabPane>
                            </Tabs>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ span: 24 }}>
                            <Button style={{marginRight: '10px'}}
                                onClick={() => this.sublimArticle(0)}>存入草稿箱</Button>
                            <Button type="primary"
                                onClick={() => this.sublimArticle(1)}>发布文章</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
       
            <Modal visible={isShowAddChannelModal} cancelText="取消" okText="确定"
                onCancel={() => this.toggleAddChannelModal(false)}
                onOk={this.addChannelOk}>
                <Input style={{marginTop: '20px'}} onChange={this.setNewChannelName}
                    placeholder="Enter your new channel's name"/>
            </Modal>
        </div>
    }
}

export default Form.create()(AddSourcePage);