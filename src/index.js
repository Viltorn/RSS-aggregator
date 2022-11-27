/* eslint-disable object-curly-newline */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import { i18nIn, feedsState, initialState } from './init.js';
import { render, rssRender } from './view.js';

const feeds = onChange(feedsState, rssRender());
const state = onChange(initialState, render());

const makeRequest = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .catch(() => {
    state.form.errors = i18nIn.t('errors.NetworkError');
    throw Error('Networkerror');
  });

const makeParse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    state.form.errors = i18nIn.t('errors.ParsingError');
    throw Error('ParsingError');
  }
  return doc;
};

const makeFeeds = (html) => {
  console.log(html);
  feeds.feedsCounter += 1;
  const feedId = feeds.feedsCounter;
  const titleElement = html.querySelector('channel > title');
  const title = titleElement.textContent;
  const descriptionElement = html.querySelector('channel > description');
  const description = descriptionElement.textContent;
  feeds.feedsTitles.push({ feedId, title, description });
  console.log(feeds.feedsTitles);
};

const makePosts = (html, feedId) => {
  const items = [...html.querySelectorAll('item')];
  const posts = items.map((item) => {
    const postTitleElement = item.querySelector('title');
    const postTitle = postTitleElement.textContent;
    const postLinkElement = item.querySelector('link');
    const postLink = postLinkElement.textContent;
    const visited = feeds.visitedPostList.includes(postLink);
    const postDescription = item.querySelector('description');
    const description = postDescription.textContent;
    feeds.postsCounter += 1;
    const postId = `${feeds.postsCounter}`;
    return { feedId, postTitle, postLink, postId, visited, description };
  });
  feeds.feedsPosts.push(...posts);
};

const showModalWindow = (event) => {
  const { target } = event;
  const { id } = target.dataset;
  const currentPost = _.find(feeds.feedsPosts, { postId: id });
  const { postLink } = currentPost;
  const { description } = currentPost;
  const { postTitle } = currentPost;
  feeds.modal = { status: 'show', postTitle, description, postLink };
  feeds.feedsPosts.forEach((post) => {
    if (post.postId === id && !feeds.visitedPostList.includes(post.postLink)) {
      post.visited = true;
      feeds.visitedPostList.push(post.postLink);
    }
  });
};

const refreshPosts = () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      const currentFeeds = state.feeds;
      feeds.postsCounter = 0;
      const initial = Promise.resolve([]);
      currentFeeds.reduce((acc, feed) => acc.then((content) => makeRequest(feed)
        .then((response) => [...content, response.data.contents])), initial)
        .then((data) => {
          let feedId = 1;
          feeds.feedsPosts = [];
          data.forEach((doc) => {
            const html = makeParse(doc);
            makePosts(html, feedId);
            feedId += 1;
          });
          resolve();
        })
        .catch(() => {
          resolve();
          throw Error('Refresh posts error');
        });
    }, 5000);
  });
  promise.then(() => refreshPosts());
};

const schema = yup.string().required('Required').url('Incorrecturl').notOneOf(state.feeds, 'Linkalreadyadded');

const btn = document.querySelector('button[aria-label="add"]');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  state.form.btnDisable = true;
  const { value } = input;
  schema.validate(value)
    .then(() => makeRequest(value))
    .then((response) => {
      const html = makeParse(response.data.contents);
      makeFeeds(html, value);
      makePosts(html, feeds.feedsCounter);
      state.form.errors = 'noerror';
      state.form.valid = true;
      state.feeds.push(value);
      form.reset();
      input.focus();
      state.form.btnDisable = false;
      refreshPosts();
      console.log(state.feeds);
    })
    .catch((err) => {
      const error = err.message;
      state.form.errors = i18nIn.t(`errors.${error}`);
      state.form.valid = false;
      state.form.btnDisable = false;
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
    feeds.modal = { ...feeds.modal, status: 'close' };
  });
});

state.language = 'ru';
