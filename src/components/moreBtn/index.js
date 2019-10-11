import React from 'react';

const moreBtnFuc = (props) => {
    return <div className="get_more_btn">
        <span onClick={props.loadMore}>加载更多</span>
    </div>
}

export default moreBtnFuc;