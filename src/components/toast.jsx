import React from 'react';
import Swal from 'sweetalert2';

const toast = ({icon, message}) => {

    const Toast = () => Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })


    return Toast.fire({
        icon: icon,
        title: message,
    });
}

export default toast