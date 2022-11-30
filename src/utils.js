import { i18nIn } from './init';

const btn = document.querySelector('button[aria-label="add"]');
const h1 = document.querySelector('h1');
const lead = document.querySelector('p[class="lead"]');
const label = document.querySelector('label');
const mt2 = document.querySelector('p[class="mt-2 mb-0 text-muted"]');

export const renderTitles = (val) => {
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

export const renderPosts = (val) => {
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
    const textView = post.visited ? 'fw-normal' : 'fw-bold';
    a.classList.add(textView);
    a.setAttribute('href', `${post.postLink}`);
    a.dataset.id = `${post.postId}`;
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

const modal = document.querySelector('#modal');
const modalTitle = modal.querySelector('h5');
const modalDescription = modal.querySelector('[class="modal-body text-break"]');
const modalRefBtn = modal.querySelector('[class="btn btn-primary full-article"]');
const modalCloseBtn = modalRefBtn.nextElementSibling;
const body = document.querySelector('body');

export const toogleModal = (val) => {
  if (val.status === 'show') {
    modalTitle.textContent = val.postTitle;
    modalDescription.textContent = val.description;
    modalRefBtn.setAttribute('href', val.postLink);
    modal.classList.add('show');
    modal.setAttribute('style', 'display: block;');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('aria-hidden');
    body.classList.add('modal-open');
    body.setAttribute('style', 'overflow: hidden; padding-right: 0px;');
  } else {
    modal.classList.remove('show');
    modal.setAttribute('style', 'display: none;');
    modal.removeAttribute('role');
    modal.removeAttribute('aria-modal');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    body.removeAttribute('style');
  }
};

export const renderInterface = (val) => {
  i18nIn.changeLanguage(val).then(() => {
    btn.textContent = i18nIn.t('btn');
    h1.textContent = i18nIn.t('h1');
    lead.textContent = i18nIn.t('lead');
    label.textContent = i18nIn.t('label');
    mt2.textContent = i18nIn.t('mt2');
    modalRefBtn.textContent = i18nIn.t('modalRef');
    modalCloseBtn.textContent = i18nIn.t('modalClose');
  });
};

export const toogleBtn = (val) => {
  btn.disabled = val;
};
