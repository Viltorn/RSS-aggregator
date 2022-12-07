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
    case 'form.success':
      if (value !== '') {
        feedback.classList.add('text-success');
        feedback.textContent = value;
      }
      break;
    case 'form.errors':
      feedback.classList.remove('text-danger' ?? 'text-success');
      if (value === '') {
        feedback.textContent = '';
      } else {
        feedback.classList.add('text-danger');
        feedback.textContent = value;
      }
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
