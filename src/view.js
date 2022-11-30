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
  switch (path) {
    case 'form.errors':
      if (value === 'noerror') {
        feedback.classList.replace('text-danger', 'text-success');
      } else if (value !== 'noerror' && feedback.classList.contains('text-success')) {
        feedback.classList.replace('text-success', 'text-danger');
      }
      feedback.textContent = value !== 'noerror' ? value : i18nIn.t('successLoad');
      break;
    default:
      break;
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
