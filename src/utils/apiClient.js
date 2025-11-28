import toastMessage from './toastMessage';
const DEFAULT_TIMEOUT = 15000; // 15s

function buildUrl(base, path, query) {
    const url = new URL(path, base);
    if (query && typeof query === 'object') {
        Object.entries(query).forEach(([k, v]) => {
            if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
        });
    }
    return url.toString();
}

async function request({ method = 'GET', path = '/', baseURL = '', query, body, headers = {}, timeout = DEFAULT_TIMEOUT }) {
    const token = (() => {
        try {
            return localStorage.getItem('token');
        } catch {
            return null;
        }
    })();

    const url = buildUrl(baseURL || window.location.origin, path, query);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
    };

    if (body !== undefined && body !== null) {
        opts.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
        const res = await fetch(url, opts);
        clearTimeout(timer);
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!res.ok) {
            const err = new Error(data?.error || data?.message || `HTTP ${res.status}`);
            err.status = res.status;
            err.response = data;
            throw err;
        }
        return data;
    } catch (e) {
        if (e.name === 'AbortError' || e.code === 'ETIMEDOUT') {
            const err = new Error('Request timed out');
            err.code = 'ETIMEDOUT';
            err.isNetworkError = true;
            toastMessage({ msg: 'Network timeout. Please check your connection and try again.', type: 'error' });
            throw err;
        }
        // other network or parse errors
        if (e instanceof Error) {
            e.isNetworkError = true;
        } else {
            const err = new Error('Network error');
            err.isNetworkError = true;
            toastMessage({ msg: 'Network error. Please check your connection.', type: 'error' });
            throw err;
        }
        toastMessage({ msg: 'Network error. Please check your connection.', type: 'error' });
        throw e;
    }
}

export default {
    get: (path, opts = {}) => request({ ...opts, method: 'GET', path }),
    post: (path, body, opts = {}) => request({ ...opts, method: 'POST', path, body }),
    put: (path, body, opts = {}) => request({ ...opts, method: 'PUT', path, body }),
    del: (path, opts = {}) => request({ ...opts, method: 'DELETE', path }),
    request,
};
