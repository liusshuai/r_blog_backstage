import React, {useState} from 'react';
import DeleteConfirm from '@/components/deleteConfirm';
import MessBox from '@/components/messBox';
import { Modal, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { getCommentByMovie } from '@/api/comment';
import './index.less';

const sourceBoxFuc = (props) => {

    const data = props.data;

    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [total, setTotal] = useState(0);

    const openMess = () => {
        !comments.length && getComments();
        setVisible(true);
    }

    const getComments = (page = 1) => {
        getCommentByMovie({
            mid: data.id,
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
 
    return <div className="source_box_wrap">
        <div className="source_cover">
            <img src={data.cover} />
            <p className="base_info">{data.name}({data.type}/{data.tag})</p>
        </div>
        <div className="base_handler">
            <span><Link to={`/admin/addSource?id=${data.id}&type=update`}>修改</Link></span>
            <span className="delete_btn" onClick={openMess}>评论</span>
            <DeleteConfirm onConfirm={() => props.deleteBibi(data.id)} />
        </div>


        <Modal visible={visible} width={800} footer={<Pagination current={page}
            pageSize={10} onChange={changePage} total={total} />}
            onCancel={() => setVisible(false)}>
            <MessBox data={comments} total={total} removeCallback={getComments}
                type={4} answerCallback={getComments}/>
        </Modal>
    </div>
}

export default sourceBoxFuc;