import { toast } from 'react-toastify';
import i18next from 'i18next';

export const showSuccessToast = (messageKey) => {
  toast.success(i18next.t(messageKey), {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showErrorToast = (messageKey) => {
  toast.error(i18next.t(messageKey), {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfoToast = (messageKey) => {
  toast.info(i18next.t(messageKey), {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showWarningToast = (messageKey) => {
  toast.warning(i18next.t(messageKey), {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};