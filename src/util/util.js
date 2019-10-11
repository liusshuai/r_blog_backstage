export function parseUrl(search) {
    let params = {};
    if (search) {
        let paramString = search.split('?')[1];
        let arr = paramString.split('&');

        arr.map(item => {
            let keyValues = item.split('=');
            params[keyValues[0]] = keyValues[1];
            return null;
        });
    }

    return params;
}