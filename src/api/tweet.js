import { get, post } from '@/util/request';
const api = 'tweet';

export function getBibis(params) {
    return get(`${api}/getMyTweet`, {
        page: params.page || 1
    }).then(res => {
        return Promise.resolve(res);
    });
}

export function addBibi(params) {
    return post(`${api}/addTweet`, params).then(res => {
        return Promise.resolve(res);
    });
}

export function removeBibi(id) {
    return post(`${api}/deleteTweet`, {id}).then(res => {
        return Promise.resolve(res);
    });
}