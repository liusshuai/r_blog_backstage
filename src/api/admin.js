import { get, post } from '@/util/request';
const api = 'author';

export function login(params) {
    return post(`${api}/login`, params).then(res => {
        return Promise.resolve(res);
    });
}

export function logout() {
    return get(`${api}/logout`).then(res => {
        return Promise.resolve(res);
    });
}

export function isLogin() {
    return get(`${api}/getAdmin`).then(res => {
        return Promise.resolve(res);
    });
}