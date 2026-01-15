import { isEscapeKey } from './util.js';
import { uploadData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './message.js';
import { filtersModule } from './filters.js';

let isFormInitialized = false;

const uploadFormElement = document.querySelector('.img-upload__form');
const uploadInputElement = uploadFormElement.querySelector('.img-upload__input');
const uploadStartElement = document.querySelector('.img-upload__start');
const uploadOverlayElement = document.querySelector('.img-upload__overlay');
const uploadCancelElement = uploadFormElement.querySelector('.img-upload__cancel');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionInputElement = uploadFormElement.querySelector('.text__description');
const uploadSubmitElement = uploadFormElement.querySelector('.img-upload__submit');

const previewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

let pristine;

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.trim().split(' ').filter((tag) => tag !== '');

  if (hashtags.length > 5) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#') || hashtag === '#') {
      return false;
    }
    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/iu;
    if (!hashtagRegex.test(hashtag) || hashtag.length > 20) {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));
  return uniqueHashtags.size === hashtags.length;
};

const validateDescription = (value) => value.length <= 140;

const updateSubmitButtonState = () => {
  const isValid = pristine.validate();
  uploadSubmitElement.disabled = !isValid;
};

function closeUploadForm() {
  uploadOverlayElement.classList.add('hidden');
  uploadStartElement.classList.remove('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  uploadInputElement.value = '';
  hashtagsInputElement.value = '';
  descriptionInputElement.value = '';

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  filtersModule.resetFiltersState();
  pristine.reset();
  uploadSubmitElement.disabled = false;
  uploadSubmitElement.textContent = 'Опубликовать';
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.querySelector('.error')) {
      return;
    }

    evt.preventDefault();
    const isTextInputFocused = document.activeElement === hashtagsInputElement || document.activeElement === descriptionInputElement;
    if (!isTextInputFocused) {
      closeUploadForm();
    }
  }
}

const openUploadForm = () => {
  if (!isFormInitialized || !uploadStartElement || !uploadOverlayElement) {
    return;
  }

  const file = uploadInputElement.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${imageUrl})`;
    });

    uploadStartElement.classList.add('hidden');
    uploadOverlayElement.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);

    filtersModule.resetFiltersState();
  }
};

const onFileInputChange = () => {
  openUploadForm();
};

const onCancelButtonClick = () => {
  closeUploadForm();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  uploadSubmitElement.disabled = true;
  uploadSubmitElement.textContent = 'Отправляется...';

  const formData = new FormData(uploadFormElement);

  uploadData(
    () => {
      showSuccessMessage();
      closeUploadForm();
    },
    () => {
      showErrorMessage();
      uploadSubmitElement.disabled = false;
      uploadSubmitElement.textContent = 'Опубликовать';
    },
    formData
  );
};

const stopPropagationOnEscape = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const initForm = () => {
  uploadInputElement.value = '';
  isFormInitialized = false;

  pristine = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });

  pristine.addValidator(hashtagsInputElement, validateHashtags, 'Хэш-теги: до 5 шт., не повторяются, формат #тег (до 20 символов)');
  pristine.addValidator(descriptionInputElement, validateDescription, 'Комментарий не должен превышать 140 символов');

  filtersModule.initFilters();

  uploadInputElement.addEventListener('change', onFileInputChange);
  uploadCancelElement.addEventListener('click', onCancelButtonClick);
  uploadFormElement.addEventListener('submit', onFormSubmit);

  hashtagsInputElement.addEventListener('keydown', stopPropagationOnEscape);
  descriptionInputElement.addEventListener('keydown', stopPropagationOnEscape);
  hashtagsInputElement.addEventListener('input', updateSubmitButtonState);
  descriptionInputElement.addEventListener('input', updateSubmitButtonState);

  isFormInitialized = true;
};

export { initForm };
