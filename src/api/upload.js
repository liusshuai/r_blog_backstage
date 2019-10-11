import { post } from '@/util/request';
export default (type, params) => {
    return post('upload/upload?type=' + type, params).then(res => {
        return Promise.resolve(res);
    });
}