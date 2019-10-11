import { get, post } from '@/util/request';
const api = 'follow';

export function getFollow(page) {
    return get(`${api}/getMyFollow`, {
        page: page || 1
    }).then(res => {
        return Promise.resolve(res);
    });
}

export function removeFollow(uid) {
    return post(`${api}/remove`, {
        uid
    }).then(res => {
        return Promise.resolve(res);
    });
}