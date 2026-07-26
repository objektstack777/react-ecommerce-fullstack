import { atom, useAtom } from 'jotai';

export const flashMessageAtom = atom({
  message: '',
  type: 'info',
});

let timeoutId = null;

export const useFlashMessage = () => {
  const [flashMessage, setFlashMessage] =
    useAtom(flashMessageAtom);

  const clearMessage = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    setFlashMessage({
      message: '',
      type: 'info',
    });
  };

  const showMessage = (message, type = 'info') => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setFlashMessage({
      message,
      type,
    });

    timeoutId = setTimeout(clearMessage, 3000);
  };

  return {
    flashMessage,
    showMessage,
    clearMessage,
  };
};