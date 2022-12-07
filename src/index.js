/* eslint-disable object-curly-newline */
import 'bootstrap';
import './styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import { uiState, initialState, i18nIn } from './init.js';
import { renderError, uiRender } from './view.js';

const whatchedUi = onChange(uiState, uiRender());
const whatchedState = onChange(initialState, renderError());

const makeRequest = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
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
  return doc;
};

const makeFeed = (html) => {
  whatchedUi.feedsCounter += 1;
  const feedId = whatchedUi.feedsCounter;
  const titleElement = html.querySelector('channel > title');
  const title = titleElement.textContent;
  const descriptionElement = html.querySelector('channel > description');
  const description = descriptionElement.textContent;
  return { feedId, title, description };
};

const makePosts = (html, feedId) => {
  const items = [...html.querySelectorAll('item')];
  const posts = items.map((item) => {
    const postTitleElement = item.querySelector('title');
    const postTitle = postTitleElement.textContent;
    const postLinkElement = item.querySelector('link');
    const postLink = postLinkElement.textContent;
    const visited = whatchedState.visitedPostList.includes(postLink);
    const postDescription = item.querySelector('description');
    const description = postDescription.textContent;
    if (!whatchedState.postLinks.includes(postLink)) {
      whatchedUi.postsCounter += 1;
      const postId = `${whatchedUi.postsCounter}`;
      whatchedState.postLinks.push(postLink);
      return { feedId, postTitle, postLink, postId, visited, description };
    }
    return '';
  });
  return posts.filter((post) => post !== '');
};

const showModalWindow = (event) => {
  const { target } = event;
  const { id } = target.dataset;
  const currentPost = _.find(whatchedUi.feedsPosts, { postId: id });
  const { postLink } = currentPost;
  const { description } = currentPost;
  const { postTitle } = currentPost;
  whatchedUi.modal = { status: 'show', postTitle, description, postLink };
  whatchedUi.feedsPosts.forEach((post) => {
    if (post.postId === id && !whatchedState.visitedPostList.includes(post.postLink)) {
      post.visited = true;
      whatchedState.visitedPostList.push(post.postLink);
    }
  });
};

const refreshPosts = () => {
  new Promise((resolve) => {
    setTimeout(() => {
      const currentFeeds = whatchedState.feedsLinks;
      const initial = Promise.resolve([]);
      currentFeeds.reduce((acc, feed) => acc.then((content) => makeRequest(feed)
        .then((response) => [...content, response.data.contents])), initial)
        .then((data) => {
          data.forEach((doc) => {
            const html = makeParse(doc);
            const posts = makePosts(html, whatchedUi.postsCounter);
            whatchedUi.feedsPosts.push(...posts);
          });
          resolve();
        });
    }, 5000);
  }).then(() => refreshPosts());
};

const btn = document.querySelector('button[aria-label="add"]');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  whatchedState.form.errors = '';
  whatchedState.form.success = '';
  const schema = yup.string().required('Required').url('Incorrecturl').notOneOf(whatchedState.feedsLinks, 'LinkAlreadyAdded');
  whatchedUi.btnDisable = true;
  const { value } = input;
  schema.validate(value)
    .then(() => makeRequest(value))
    .then((response) => {
      const html = makeParse(response.data.contents);
      const newFeed = makeFeed(html, value);
      whatchedUi.feedsTitles.push(newFeed);
      const newPosts = makePosts(html, whatchedUi.feedsCounter);
      whatchedUi.feedsPosts.push(...newPosts);
      whatchedState.form.success = i18nIn.t('successLoad');
      whatchedState.feedsLinks.push(value);
      form.reset();
      input.focus();
      whatchedUi.btnDisable = false;
      refreshPosts();
    })
    .catch((err) => {
      whatchedState.form.success = '';
      whatchedState.form.errors = i18nIn.t(`errors.${err.message}`);
      whatchedUi.btnDisable = false;
      input.focus();
    });
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

whatchedUi.language = 'ru';
