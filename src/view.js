import i18nIn from './init';

const feedback = document.querySelector('.feedback');
const btn = document.querySelector('button');
const h1 = document.querySelector('h1');
const lead = document.querySelector('p[class="lead"]');
const label = document.querySelector('label');
const mt2 = document.querySelector('p[class="mt-2"]');

export const render = () => (path, value) => {
  switch (path) {
    case 'form.errors':
      if (value === 'noerror') {
        feedback.classList.replace('text-danger', 'text-success');
      } else if (value !== 'noerror' && feedback.classList.contains('text-success')) {
        feedback.classList.replace('text-success', 'text-danger');
      }
      feedback.innerHTML = value !== 'noerror' ? value : i18nIn.t('successLoad');
      break;
    case 'form.language':
      i18nIn.changeLanguage(value).then(() => {
        btn.textContent = i18nIn.t('btn');
        h1.textContent = i18nIn.t('h1');
        lead.textContent = i18nIn.t('lead');
        label.textContent = i18nIn.t('label');
        mt2.textContent = `${i18nIn.t('mt2')} https://ru.hexlet.io/lessons.rss`;
      });
      break;
    case 'form.btnDisable':
      btn.disabled = value;
      break;
    default:
      break;
  }
};

const makeFeeds = (val) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const h2Div = document.createElement('div');
  h2Div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nIn.t('feedsTitle');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  h2Div.append(h2);
  div.append(h2Div, ul);
  val.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(h3, p);
    ul.prepend(li);
  });
  feedsContainer.append(div);
};

const makePosts = (val) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const h2Div = document.createElement('div');
  h2Div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nIn.t('postsTitle');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  h2Div.append(h2);
  div.append(h2Div, ul);
  postsContainer.append(div);
  val.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', `${post.postLink}`);
    a.setAttribute('data-id', `${post.postId}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.postTitle;
    const modalBtn = document.createElement('button');
    modalBtn.setAttribute('type', 'button');
    modalBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    modalBtn.dataset.id = `${post.postId}`;
    modalBtn.dataset.bsToogle = 'modal';
    modalBtn.dataset.bsTarget = '#modal';
    modalBtn.textContent = i18nIn.t('modal');
    li.append(a, modalBtn);
    ul.prepend(li);
  });
};

export const rssRender = () => (path, value) => {
  switch (path) {
    case 'feedsTitles':
      makeFeeds(value);
      break;
    case 'feedsPosts':
      makePosts(value);
      break;
    default:
      break;
  }
};
