import React, {useState, useEffect} from 'react';
import DeleteConfirm from '@/components/deleteConfirm';
import MessBox from '@/components/messBox';
import { Modal, Pagination } from 'antd';
import { getCommentByBibi } from '@/api/comment';
import './index.less';

const bibiBoxFunc = (props) => {
    const { data } = props;
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [total, setTotal] = useState(0);

    // useEffect(() => {
    //     console.log(data.id);
    // }, []);

    const openMess = () => {
        !comments.length && getComments();
        setVisible(true);
    }

    const getComments = (page = 1) => {
        getCommentByBibi({
            tid: data.id,
            page: page
        }).then(res => {
            if (res.code === 200) {
                const { list, total } = res.data;
                setComments(list);
                setTotal(total);
            }
        });
    }

    const changePage = (page) => {
        setPage(page);
        getComments(page);
    }


    return <div className="bibi_item_content">
        { data.imgs && data.imgs[0] ? <div className="bibi_item_image">
            <img src={data.imgs[0].src} />
        </div> : null }
        <pre className="content">
            {data.content}
        </pre>
        <div className="bibi_item_tags">
            { data.fromw && JSON.parse(data.fromw).map(tag => <span key={tag}>● {tag}</span>) }
        </div>
        <div className="bibi_item_info">
            <span>发布于 {data.pubtime}</span>
            <span>|</span>
            <span>热度({data.likenum})</span>
            <span>|</span>
            <span onClick={openMess}>评论({data.comments})</span>
            <span>|</span>
            <DeleteConfirm onConfirm={() => props.deleteBibi(data.id)}>删除</DeleteConfirm>
        </div>


        <Modal visible={visible} width={800} footer={<Pagination current={page}
            pageSize={10} onChange={changePage} total={total} />}
            onCancel={() => setVisible(false)}>
            <MessBox data={comments} total={total} removeCallback={getComments}
                type={2} answerCallback={getComments} />
        </Modal>
    </div>
};

export default bibiBoxFunc;