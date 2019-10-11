import React, {useState, useCallback} from 'react';
import MessBox from '@/components/messBox';
import {
    Button,
    Tooltip,
    Modal,
    Pagination
} from 'antd';
import { getCommentByArticle } from '@/api/comment';

export default (props) => {
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [total, setTotal] = useState(0);

    const openMess = () => {
        !comments.length && getComments();
        setVisible(true);
    }

    const changePage = (page) => {
        setPage(page);
        getComments(page);
    }

    const getComments = (page = 1) => {
        getCommentByArticle({
            page: page,
            aid: props.id
        }).then(res => {
            if (res.code === 200) {
                const { list, total } = res.data;
                setComments(list);
                setTotal(total);
            }
        });
    }

    // useCallback(() => {
    //     console.log(page);
    // }, [page]);

    return <React.Fragment>
        <Tooltip title={`共${props.count || 0}条评论，点击查看所有`}>
            <Button onClick={openMess} type="primary" 
                shape="circle" icon="message" />
        </Tooltip> 

        <Modal visible={visible} width={800} footer={<Pagination current={page}
            pageSize={10} onChange={changePage} total={total} />}
            onCancel={() => setVisible(false)}>
            <MessBox data={comments} total={total} removeCallback={getComments}
                type={1} answerCallback={getComments} />
        </Modal>
    </React.Fragment> 
}