import toastMessage from './toastMessage';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

async function uploadImage(file, { folder } = {}) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        const err = new Error('Cloudinary configuration missing (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)');
        err.isConfigError = true;
        throw err;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    if (folder) formData.append('folder', folder);

    try {
        const res = await fetch(url, { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) {
            const msg = data?.error?.message || data?.message || `Upload failed (status ${res.status})`;
            toastMessage({ msg, type: 'error' });
            const err = new Error(msg);
            err.response = data;
            throw err;
        }
        return data; // contains secure_url, public_id, etc.
    } catch (e) {
        if (!e.isConfigError) {
            toastMessage({ msg: 'Failed to upload image. Check your network or try again.', type: 'error' });
        }
        throw e;
    }
}

export default { uploadImage };
