import { i18nIn } from './init';
import {
  renderInterface,
  renderTitles,
  renderPosts,
  toogleModal,
  toogleBtn,
} from './utils';

const feedback = document.querySelector('.feedback');

export const renderError = () => (path, value) => {
  if (path === 'form.errors') {
    switch (value) {
      case '':
        feedback.classList.remove('text-danger' ?? 'text-success');
        feedback.textContent = '';
        break;
      case 'success':
        feedback.classList.add('text-success');
        feedback.textContent = i18nIn.t('successLoad');
        break;
      default:
        feedback.classList.add('text-danger');
        feedback.textContent = i18nIn.t(`errors.${value}`);
        if (feedback.classList.contains('text-success')) {
          feedback.classList.remove('text-success');
        }
        break;
    }
  }
};

export const uiRender = () => (path, value) => {
  switch (path) {
    case 'feedsTitles':
      renderTitles(value);
      break;
    case 'feedsPosts':
      renderPosts(value);
      break;
    case 'modal':
      toogleModal(value);
      break;
    case 'btnDisable':
      toogleBtn(value);
      break;
    case 'language':
      renderInterface(value);
      break;
    default:
      break;
  }
};
