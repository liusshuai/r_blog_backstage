import React from 'react';
import Breadcrumb from '@/components/breadcrumb';
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    message
} from 'antd';
import BraftEditor from 'braft-editor';
import { addMovie, getMovieDetail, updateMovie } from '@/api/source';
import { parseUrl } from '@/util/util';
import upLoadImg from '@/api/upload';
import 'braft-editor/dist/index.css';
import './index.less';
const { Option } = Select;
const TextArea = Input.TextArea;
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
let sid = 0;

class AddSourcePage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.submitSource = this.submitSource.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
    }

    componentDidMount() {
        const params = parseUrl(location.search);
        if (params.type === 'update' && params.id) {
            document.title = '更新资源 - 博客后台';
            editType = 'update';
            sid = params.id;
            this.initData(params.id);
        } else {
            document.title = '新建资源 - 博客后台';
            editType = 'create';
            this.setState({
                loading: false
            });
        }
    }

    initData(id) {
        getMovieDetail(id).then(res => {
            if (res.code === 200) {
                const data = res.data;
                this.props.form.setFieldsValue({
                    name: data.name,
                    type: data.type,
                    cover: data.cover,
                    tag: data.tag,
                    director: data.director,
                    actor: data.actor,
                    desc: data.desc
                });

                const editorState = BraftEditor.createEditorState(data.content);
                this.refs.editor.setValue(editorState);
            } else {
                message.error(res.msg);
            }

            this.setState({ loading: false });
        });
    }

    submitSource(e) {
        e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const editorState = this.refs.editor.getValue();
        values.content = editorState.toHTML();
        if (this.judgeParams(values)) {
            if (editType === 'create') {
                this.createSource(values);
            } else if (editType === 'update') {
                values.id = sid;
                this.updateSource(values);
            }
        }
    }

    judgeParams(params) {
        const _p_text = {
            name: '标题不能为空',
            type: '请给资源选一个类型',
            content: '文章内容不能为空',
            cover: '请上传封面'
        };

        for (let key in _p_text) {
            if (!params[key]) {
                message.error(_p_text[key]);
                return false;
            }
            if (key === 'content' && params[key] === '<p></p>') {
                message.error(_p_text[key]);
                return false;
            }
        }

        return true;
    }

    uploadImg(info) {
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

    uploadImage(param) {
        let formData = new FormData();

        formData.append('files', param.file);

        upLoadImg('source', formData).then(res => {
            if (res.success) {
                param.success(res.data);
            } else {
                message.error('图片上传失败，请稍后重试!');
            }
        });
    }

    createSource(data) {
        addMovie(data).then(res => {
            if (res.code === 200) {
                message.success('创建成功');
                this.props.router.push('/admin/source');
            } else {
                message.error(res.msg);
            }
        });
    }

    updateSource(data) {
        updateMovie(data).then(res => {
            if (res.code === 200) {
                message.success('更新成功');
                this.props.router.push('/admin/source');
            } else {
                message.error(res.msg);
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        mediaParams.uploadFn = this.uploadImage;

        return <div className="source_add_page_wrap">
            <Breadcrumb pathes={['资源', '新增资源']} />
            <div className="add_main_form">
                <Form {...formItemLayout} onSubmit={this.submitSource}>
                    <Form.Item label="Title">
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: '标题不能为空',
                            }],
                        })(<Input style={{ width: 400 }} />)}
                    </Form.Item>
                    <Form.Item label="类型">
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true,
                                message: '请选择一个类型',
                            }],
                        })(<Select style={{ width: 200 }} placeholder="请选择一个类型">
                            <Option value="电影">电影</Option>
                            <Option value="美剧">美剧</Option>
                            <Option value="电视剧">电视剧</Option>
                            <Option value="纪录片">纪录片</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="封面">
                        <div>
                        {getFieldDecorator('cover', {
                            rules: [{
                                required: true,
                                message: '请选择一个类型',
                            }],
                        })(<Input style={{ width: 600 }} />)}
                        <Upload name="file" onChange={this.uploadImg}
                            action="/api/upload/upload?type=source" showUploadList={false}>
                            <Button style={{marginLeft: '2px'}} type="primary">上传</Button>
                        </Upload>
                        </div>
                    </Form.Item>
                    <Form.Item label="标签">
                        {getFieldDecorator('tag')(<Input
                            style={{ width: 450 }} placeholder="以 / 分割" />)}
                    </Form.Item>
                    <Form.Item label="导演">
                        {getFieldDecorator('director')(<Input style={{ width: 400 }} />)}
                    </Form.Item>
                    <Form.Item label="演员">
                        {getFieldDecorator('actor')(<Input placeholder="以 、 分割" />)}
                    </Form.Item>
                    <Form.Item label="简介">
                        {getFieldDecorator('desc')(<TextArea />)}
                    </Form.Item>
                    <Form.Item>
                        <BraftEditor style={{border: '1px solid #eee',
                            width: '853px', margin: '0 auto'}}
                            media={mediaParams} ref="editor"
                            excludeControls={['emoji']} />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 24 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    }
}

export default Form.create()(AddSourcePage);