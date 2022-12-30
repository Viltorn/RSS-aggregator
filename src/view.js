import {
  renderInterface,
  renderTitles,
  renderPosts,
  toogleModal,
  handleFormStatus,
  renderLanguage,
} from './utils';

export const renderForm = (formElements) => (path, value) => {
  switch (path) {
    case 'form.status':
      handleFormStatus(value, formElements);
      break;
    case 'form.errors':
      formElements.feedback.textContent = value;
      break;
    case 'form.successMsg':
      formElements.feedback.textContent = value;
      break;
    default:
      break;
  }
};

export const uiRender = (state, elements) => (path, value) => {
  switch (path) {
    case 'feedsTitles':
      renderTitles(value, state, elements);
      break;
    case 'feedsPosts':
      renderPosts(value, state, elements);
      break;
    case 'modal':
      toogleModal(value, elements.modal);
      break;
    case 'interface':
      renderInterface(value, elements);
      break;
    case 'language':
      renderLanguage(value, elements);
      break;
    default:
      break;
  }
};
