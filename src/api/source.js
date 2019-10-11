import { get, post } from '@/util/request';
const api = 'movie';

export function getMovies(params) {
    return get(`${api}/getAll`, {
        page: params.page
    }).then(res => {
        return Promise.resolve(res);
    });
}

export function getMovieDetail(id) {
    return get(`${api}/detail`, { id }).then(res => {
        return Promise.resolve(res);
    });
}

export function addMovie(params) {
    return post(`${api}/add`, params).then(res => {
        return Promise.resolve(res);
    });
}

export function updateMovie(params) {
    return post(`${api}/update`, params).then(res => {
        return Promise.resolve(res);
    });
}

export function removeMovie(id) {
    return post(`${api}/remove`, {id}).then(res => {
        return Promise.resolve(res);
    });
}