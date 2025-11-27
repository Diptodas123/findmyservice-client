import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastMessage = ({ msg, type }) => {
    return toast(msg, {
        position: "top-right",
        autoClose: 5000,
        type: type,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export default toastMessage;