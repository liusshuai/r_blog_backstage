import React, {useState} from 'react';
import DeleteConfirm from '@/components/deleteConfirm';
import { Empty, Button, Tooltip, message, Modal, Input } from 'antd';
import { removeComment, addComment } from '@/api/comment';
import './index.less';

const TextArea = Input.TextArea;

const me = {
    username: '刘帅_',
    useremail: '302931504@qq.com',
    userblog: 'http://www.lsshuai.com'
}

let reply = {};

const messBoxFunc = (props) => {

    const { data = [], total = 0, type = 1 } = props;

    const [visible, setVisible] = useState(false);
    const [answerName, setAnName] = useState('');
    const [content, setContent] = useState('');

    const remove = (id) => {
        removeComment(id).then(res => {
            if (res.code === 200) {
                message.success('删除成功');
                props.removeCallback && props.removeCallback();
            } else {
                message.error(res.msg);
            }   
        });
    }

    const answer = (data) => {
        setVisible(true);
        setAnName(data.username);
        reply = {
            replyname: data.username,
            replyemail: data.useremail,
            replycontent: data.content,
            host: type === 3 ? 0 : data.host
        };
    }

    const setAnswerContent = (e) => {
        setContent(e.target.value);
    }

    const answerOk = () => {
        const params = Object.assign({
            content: content,
            type: type
        }, me, reply);

        addComment(params).then(res => {
            if (res.code === 200) {
                message.success('回复成功');
                setVisible(false);

                props.answerCallback && props.answerCallback();
            } else {
                message.error(res.msg);
            }
        });
    }

    return <ul className="mess_box">
        { data.length ? data.map((item, index) => <li key={item.id}>
            <div className="author_info">
                <div>
                    <span className="author_name">{item.username}</span>
                    <span className="pubtime">{item.pubtime}</span>
                </div>
                <div>
                    <span>{total - index}楼</span>
                    <DeleteConfirm onConfirm={() => remove(item.id)}>
                        <Tooltip title="删除">
                            <Button size="small" shape="circle" icon="delete" />
                        </Tooltip>
                    </DeleteConfirm>
                    <Tooltip title="回复">
                        <Button size="small" style={{marginLeft: '10px'}}
                            onClick={() => answer(item)}
                            type="primary" shape="circle" icon="edit" />
                    </Tooltip>
                </div>
                
            </div>
            <div className="mess_content">
                { item.replycontent ? <blockquote>
                    <pre>引用 {item.replyname} 的发言</pre>
                    {item.replycontent}
                </blockquote> : null }
                <p>{item.content}</p>
            </div>
        </li>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无评论" /> }

        <Modal visible={visible} width={600}
            cancelText="取消" okText="回复"
            onOk={answerOk}
            onCancel={() => setVisible(false)}>
            <div className="anser_box">
                <TextArea placeholder={`回复 ${answerName} 的留言`} onChange={setAnswerContent} />
            </div>
        </Modal>
    </ul>
};

export default messBoxFunc;