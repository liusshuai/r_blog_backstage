import { get, post } from '@/util/request';
import { user } from '@/util/contant';
const api = 'article';

export function getArticles(params) {
    return get(`${api}/getByAuthor`, {
        author: user,
        page: params.page || 1,
        limit: params.limit || 10,
        show: params.show
    }).then(res => {
        return Promise.resolve(res);
    });
}

export function getArticleDetail(id) {
    return get(`${api}/getOneById`, {
        id: id,
        onlyRead: 1
    }).then(res => {
        return Promise.resolve(res);
    });
}

export function addArticle(params) {
    return post(`${api}/save`, params).then(res => {
        return Promise.resolve(res);
    });
}

export function deleteArticle(id) {
    return post(`${api}/delete`, {id}).then(res => {
        return Promise.resolve(res);
    });
}

export function updateArticle(params) {
    return post(`${api}/update`, params).then(res => {
        return Promise.resolve(res);
    });
}

export function getArticleChannel() {
    return get('channel/getAllChannel').then(res => {
        return Promise.resolve(res);
    });
}

export function addChannel(params) {
    return post('channel/addChannel', params).then(res => {
        return Promise.resolve(res);
    });
}