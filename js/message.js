import { isEscapeKey } from './util.js';

const showMessage = (templateId, buttonText = 'Закрыть') => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return null;
  }

  const message = template.content.cloneNode(true).firstElementChild;
  document.body.append(message);

  const button = message.querySelector('button');
  if (button) {
    button.textContent = buttonText;
  }

  function removeMessage() {
    message.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOverlayClick);
  }

  function onEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      removeMessage();
    }
  }

  function onOverlayClick(evt) {
    if (evt.target === message) {
      removeMessage();
    }
  }

  if (button) {
    button.addEventListener('click', removeMessage);
  }
  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOverlayClick);

  return removeMessage;
};

const showSuccessMessage = () => showMessage('success', 'Круто!');
const showErrorMessage = () => showMessage('error', 'Загрузить другой файл');

const showDataLoadErrorMessage = () => {
  const message = document.createElement('section');
  message.classList.add('data-error');
  message.textContent = 'Не удалось загрузить фотографии';
  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 5000);
};

export { showSuccessMessage, showErrorMessage, showDataLoadErrorMessage };
