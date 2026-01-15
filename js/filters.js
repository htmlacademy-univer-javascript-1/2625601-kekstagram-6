const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelectorAll('.effects__radio');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

let currentScale = 100;
let currentEffect = 'none';

const sliderConfig = {
  none: { min: 0, max: 1, step: 0.1, start: 1 },
  chrome: { min: 0, max: 1, step: 0.1, start: 1 },
  sepia: { min: 0, max: 1, step: 0.1, start: 1 },
  marvin: { min: 0, max: 100, step: 1, start: 100 },
  phobos: { min: 0, max: 3, step: 0.1, start: 3 },
  heat: { min: 1, max: 3, step: 0.1, start: 3 },
};

let sliderInstance = null;

const updateScale = () => {
  previewImage.style.transform = `scale(${currentScale / 100})`;
  scaleControlValue.value = `${currentScale}%`;
};

const updateEffectPreviews = (imageUrl) => {
  const previews = document.querySelectorAll('.effects__preview');
  previews.forEach((preview) => {
    preview.style.backgroundImage = `url("${imageUrl}")`;
  });
};

const updateFilter = (effect, value) => {
  let filter = '';
  switch (effect) {
    case 'chrome': filter = `grayscale(${value})`; break;
    case 'sepia': filter = `sepia(${value})`; break;
    case 'marvin': filter = `invert(${value}%)`; break;
    case 'phobos': filter = `blur(${value}px)`; break;
    case 'heat': filter = `brightness(${value})`; break;
    default: filter = '';
  }
  previewImage.style.filter = filter;
  effectLevelValue.value = effect === 'none' ? '' : String(value);
};

const resetScale = () => {
  currentScale = 100;
  updateScale();
};

const resetSlider = () => {
  if (sliderInstance) {
    sliderInstance.destroy();
    sliderInstance = null;
  }

  const effectLevelContainer = effectLevelSlider.closest('.img-upload__effect-level');
  if (currentEffect === 'none') {
    effectLevelContainer.classList.add('hidden');
    previewImage.style.filter = '';
    effectLevelValue.value = '';
  } else {
    effectLevelContainer.classList.remove('hidden');
    const config = sliderConfig[currentEffect];
    noUiSlider.create(effectLevelSlider, {
      start: config.start,
      connect: 'lower',
      range: { min: config.min, max: config.max },
      step: config.step,
    });
    sliderInstance = effectLevelSlider.noUiSlider;
    sliderInstance.on('update', (values) => {
      const currentValue = parseFloat(values[0]);
      updateFilter(currentEffect, currentValue);
    });
    sliderInstance.set(config.start);
  }
};

const resetEffectSelection = () => {
  document.querySelector('#effect-none').checked = true;
};

const resetFiltersState = () => {
  currentScale = 100;
  currentEffect = 'none';
  resetScale();
  resetSlider();
  resetEffectSelection();
};

const initFilters = () => {
  scaleControlSmaller.addEventListener('click', () => {
    if (currentScale > MIN_SCALE) {
      currentScale -= SCALE_STEP;
      updateScale();
    }
  });

  scaleControlBigger.addEventListener('click', () => {
    if (currentScale < MAX_SCALE) {
      currentScale += SCALE_STEP;
      updateScale();
    }
  });

  effectsList.forEach((radio) => {
    radio.addEventListener('change', () => {
      currentEffect = radio.value;
      resetSlider();
    });
  });

  resetScale();
};

export const filtersModule = {
  updateEffectPreviews,
  resetScale,
  resetSlider,
  resetEffectSelection,
  resetFiltersState,
  initFilters,
};
