import i18n from 'i18next';
import ru from './locales/ru.js';

const i18nIn = i18n.createInstance();
i18nIn.init({
  lng: 'ru',
  debug: false,
  resources: { ru },
});

const initialState = {
  form: {
    errors: '',
    url: '',
  },
  visitedPostList: [],
  feedsLinks: [],
  postLinks: [],
};

const uiState = {
  visitedPostList: [],
  feedsTitles: [],
  feedsPosts: [],
  feedsCounter: 0,
  postsCounter: 0,
  modal: {
    status: 'close',
    postTitle: '',
    postLink: '',
    description: '',
  },
  btnDisable: false,
  language: '',
};

export { i18nIn, uiState, initialState };
