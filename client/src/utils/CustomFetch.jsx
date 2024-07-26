
export default function CustomFetch(url, options = {}) {
    options.credentials = 'include';
    return fetch(url, options);
}
