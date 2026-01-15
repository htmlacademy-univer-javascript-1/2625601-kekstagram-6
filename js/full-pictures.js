import { isEscapeKey } from './util.js';

const COMMENTS_PER_PAGE = 5;

let bigPictureElement = null;
let bigPictureImgElement = null;
let socialCaptionElement = null;
let likesCountElement = null;
let socialCommentsElement = null;
let socialCommentCountElement = null;
let commentsLoaderElement = null;
let cancelButtonElement = null;

let currentComments = [];
let shownCommentsCount = 0;

function initBigPictureDOM() {
  if (bigPictureElement) { return; }

  bigPictureElement = document.querySelector('.big-picture');
  bigPictureImgElement = bigPictureElement.querySelector('.big-picture__img img');
  socialCaptionElement = bigPictureElement.querySelector('.social__caption');
  likesCountElement = bigPictureElement.querySelector('.likes-count');
  socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
  commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
  cancelButtonElement = bigPictureElement.querySelector('.big-picture__cancel');

  cancelButtonElement.addEventListener('click', closeFullSizePhoto);
}

function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  const avatarElement = document.createElement('img');
  avatarElement.classList.add('social__picture');
  avatarElement.src = comment.avatar;
  avatarElement.alt = comment.name;
  avatarElement.width = 35;
  avatarElement.height = 35;
  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = comment.message;
  commentElement.appendChild(avatarElement);
  commentElement.appendChild(textElement);
  return commentElement;
}

function renderCommentsPortion(comments) {
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });
  socialCommentsElement.appendChild(fragment);
}

function updateCommentsCounter() {
  socialCommentCountElement.innerHTML = '';
  const shownCount = Math.min(shownCommentsCount, currentComments.length);
  const totalCount = currentComments.length;

  const shownCountElement = document.createElement('span');
  shownCountElement.classList.add('social__comment-shown-count');
  shownCountElement.textContent = shownCount;

  const totalCountElement = document.createElement('span');
  totalCountElement.classList.add('social__comment-total-count');
  totalCountElement.textContent = totalCount;

  socialCommentCountElement.appendChild(shownCountElement);
  socialCommentCountElement.append(' из ');
  socialCommentCountElement.appendChild(totalCountElement);
  socialCommentCountElement.append(' комментариев');

  if (shownCommentsCount >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
}

function renderInitialComments() {
  socialCommentsElement.innerHTML = '';
  const initialCount = Math.min(COMMENTS_PER_PAGE, currentComments.length);
  const initialComments = currentComments.slice(0, initialCount);
  shownCommentsCount = initialComments.length;
  renderCommentsPortion(initialComments);
  updateCommentsCounter();
}

function loadMoreComments() {
  const remainingComments = currentComments.length - shownCommentsCount;
  const nextCount = Math.min(COMMENTS_PER_PAGE, remainingComments);
  const nextComments = currentComments.slice(shownCommentsCount, shownCommentsCount + nextCount);
  renderCommentsPortion(nextComments);
  shownCommentsCount += nextComments.length;
  updateCommentsCounter();
}

function onCommentsLoaderClick() {
  loadMoreComments();
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeFullSizePhoto();
  }
}

function closeFullSizePhoto() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
  currentComments = [];
  shownCommentsCount = 0;
}

function openFullSizePhoto(photo) {
  initBigPictureDOM();
  bigPictureImgElement.src = photo.url;
  bigPictureImgElement.alt = photo.description;
  socialCaptionElement.textContent = photo.description;
  likesCountElement.textContent = photo.likes;
  currentComments = photo.comments;
  shownCommentsCount = 0;
  renderInitialComments();
  socialCommentCountElement.classList.remove('hidden');
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
}

export { openFullSizePhoto };
