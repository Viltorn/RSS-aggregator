import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import ru from './locales/ru.js';
import en from './locales/en.js';
import { renderForm, uiRender } from './view.js';

export default () => {
  const i18nIn = i18n.createInstance();
  const defaultLanguage = 'ru';
  i18nIn.init({
    lng: '',
    debug: false,
    resources: { ru, en },
  }).then(() => {
    const initialState = {
      form: {
        status: 'filling',
        successMsg: '',
        errors: '',
      },
      visitedPostList: [],
      feedsLinks: [],
      postLinks: [],
    };

    const uiState = {
      feedsTitles: [],
      feedsPosts: [],
      modal: {
        status: 'close',
        postTitle: '',
        postLink: '',
        description: '',
      },
      interface: {},
      language: '',
    };

    const modalFooter = document.querySelector('.modal-footer');

    const elements = {
      form: {
        feedback: document.querySelector('.feedback'),
        addBtn: document.querySelector('button[aria-label="add"]'),
        input: document.querySelector('#url-input'),
        form: document.querySelector('form'),
      },
      interface: {
        h1: document.querySelector('h1'),
        lead: document.querySelector('p[class="lead"]'),
        label: document.querySelector('label'),
        example: document.querySelector('p[class="mt-2 mb-0 text-muted"]'),
      },
      modal: {
        modalWindow: document.querySelector('#modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalDescription: document.querySelector('[class="modal-body text-break"]'),
        modalRefBtn: modalFooter.querySelector('[class="btn btn-primary full-article"]'),
        modalCloseBtn: modalFooter.querySelector('[class="btn btn-secondary"]'),
        body: document.querySelector('body'),
      },
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),
      langBtn: document.querySelectorAll('[aria-label="language"]'),
    };

    const whatchedUi = onChange(uiState, uiRender(uiState, elements));
    const whatchedState = onChange(initialState, renderForm(elements.form));

    const makeURL = (link) => {
      const url = new URL('/get', 'https://allorigins.hexlet.app');
      url.searchParams.append('disableCache', 'true');
      const newLink = encodeURI(link);
      url.searchParams.append('url', newLink);
      return url.toString();
    };

    const makeRequest = (link) => axios.get(link)
      .catch(() => {
        throw Error('NetworkError');
      });

    const makeParse = (data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/xml');
      const errorNode = doc.querySelector('parsererror');
      if (errorNode) {
        throw Error('ParsingError');
      }
      const feedTitle = doc.querySelector('channel > title');
      const feedDescription = doc.querySelector('channel > description');
      const items = [...doc.querySelectorAll('item')];
      const posts = items.map((item) => {
        const title = item.querySelector('title');
        const link = item.querySelector('link');
        const description = item.querySelector('description');
        return { title, link, description };
      });
      return { feedTitle, feedDescription, posts };
    };

    const addFeeds = (feedTitle, feedDescription) => {
      const title = feedTitle.textContent;
      const description = feedDescription.textContent;
      whatchedUi.feedsTitles.push({ title, description });
    };

    const addPosts = (posts) => {
      posts.forEach((post) => {
        const postTitle = post.title.textContent;
        const postLink = post.link.textContent;
        const visited = whatchedState.visitedPostList.includes(postLink);
        const postDescription = post.description.textContent;
        if (!whatchedState.postLinks.includes(postLink)) {
          const postId = _.uniqueId();
          whatchedUi.feedsPosts.push({
            postId,
            postDescription,
            postLink,
            postTitle,
            visited,
          });
          whatchedState.postLinks.push(postLink);
        }
      });
    };

    const showModalWindow = (event) => {
      const { target } = event;
      const { id } = target.dataset;
      const currentPost = _.find(whatchedUi.feedsPosts, { postId: id });
      const { postLink } = currentPost;
      const { postDescription } = currentPost;
      const { postTitle } = currentPost;
      whatchedUi.modal = {
        status: 'open',
        postTitle,
        postDescription,
        postLink,
      };
      whatchedUi.feedsPosts.forEach((post) => {
        if (post.postId === id && !whatchedState.visitedPostList.includes(post.postLink)) {
          post.visited = true;
          whatchedState.visitedPostList.push(post.postLink);
        }
      });
    };

    const refreshPosts = () => {
      const currentFeeds = whatchedState.feedsLinks;
      const promises = currentFeeds.map((feed) => makeRequest(makeURL(feed))
        .then((response) => {
          const { posts } = makeParse(response.data.contents);
          addPosts(posts);
        }));
      Promise.all(promises).finally(() => setTimeout(() => refreshPosts(), 5000));
    };

    elements.form.addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      whatchedState.form.errors = '';
      whatchedState.form.successMsg = '';
      whatchedState.form.status = 'sending';
      const schema = yup.string().required('Required').url('Incorrecturl').notOneOf(whatchedState.feedsLinks, 'LinkAlreadyAdded');
      const { value } = elements.form.input;
      schema.validate(value)
        .then(() => makeRequest(makeURL(value)))
        .then((response) => {
          const { feedTitle, feedDescription, posts } = makeParse(response.data.contents);
          addFeeds(feedTitle, feedDescription);
          addPosts(posts);
          whatchedState.form.status = 'success';
          whatchedState.form.successMsg = i18nIn.t('successLoad');
          whatchedState.feedsLinks.push(value);
        })
        .catch((err) => {
          whatchedState.form.status = 'error';
          whatchedState.form.errors = i18nIn.t(`errors.${err.message}`);
        })
        .finally(() => { whatchedState.form.status = 'filling'; });
    });

    const posts = document.querySelector('.posts');
    posts.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.tagName === 'BUTTON') {
        showModalWindow(event);
      }
    });

    const closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach((closeBtn) => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        whatchedUi.modal = { ...whatchedUi.modal, status: 'close' };
      });
    });

    const makeTranslation = (val) => {
      i18nIn.changeLanguage(val).then(() => {
        const addBtn = i18nIn.t('btn');
        const h1 = i18nIn.t('h1');
        const feedsTitle = i18nIn.t('feedsTitle');
        const postsTitle = i18nIn.t('postsTitle');
        const lead = i18nIn.t('lead');
        const label = i18nIn.t('label');
        const example = i18nIn.t('example');
        const modalOpen = i18nIn.t('modalOpen');
        const modalRefBtn = i18nIn.t('modalRef');
        const modalCloseBtn = i18nIn.t('modalClose');
        whatchedUi.language = val;
        whatchedUi.interface = {
          addBtn,
          h1,
          feedsTitle,
          postsTitle,
          lead,
          label,
          example,
          modalOpen,
          modalRefBtn,
          modalCloseBtn,
        };
      });
    };

    elements.langBtn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        makeTranslation(e.target.value);
      });
    });

    makeTranslation(defaultLanguage);
    refreshPosts();
  });
};
