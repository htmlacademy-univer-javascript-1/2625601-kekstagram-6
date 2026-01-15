import { openFullSizePhoto } from './full-pictures.js';

let picturesContainer = null;

const renderMiniatures = (photos) => {
  if (!picturesContainer) {
    picturesContainer = document.querySelector('.pictures');
    if (!picturesContainer) {
      return;
    }
  }

  const pictureTemplate = document.querySelector('#picture');
  if (!pictureTemplate) {
    return;
  }

  const oldPictures = picturesContainer.querySelectorAll('.picture');
  oldPictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = pictureTemplate.content.querySelector('.picture').cloneNode(true);
    const imageElement = pictureElement.querySelector('.picture__img');
    imageElement.src = photo.url;
    imageElement.alt = photo.description;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullSizePhoto(photo);
    });

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
};

export { renderMiniatures };
