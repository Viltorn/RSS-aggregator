export const renderTitles = (feeds, state, elements) => {
  elements.feedsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const h2Div = document.createElement('div');
  h2Div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = state.interface.feedsTitle;
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  h2Div.append(h2);
  div.append(h2Div, ul);
  feeds.forEach((feed) => {
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
  elements.feedsContainer.append(div);
};

export const renderPosts = (posts, state, elements) => {
  elements.postsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const h2Div = document.createElement('div');
  h2Div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = state.interface.postsTitle;
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  h2Div.append(h2);
  div.append(h2Div, ul);
  elements.postsContainer.append(div);
  posts.forEach((post) => {
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
    modalBtn.textContent = state.interface.modalOpen;
    li.append(a, modalBtn);
    ul.prepend(li);
  });
};

export const toogleModal = (val, elements) => {
  if (val.status === 'open') {
    elements.modalTitle.textContent = val.postTitle;
    elements.modalDescription.textContent = val.postDescription;
    elements.modalRefBtn.setAttribute('href', val.postLink);
    elements.modalWindow.classList.add('show');
    elements.modalWindow.setAttribute('style', 'display: block;');
    elements.modalWindow.setAttribute('role', 'dialog');
    elements.modalWindow.setAttribute('aria-modal', 'true');
    elements.modalWindow.removeAttribute('aria-hidden');
    elements.body.classList.add('modal-open');
    elements.body.setAttribute('style', 'overflow: hidden; padding-right: 0px;');
  } else {
    elements.modalWindow.classList.remove('show');
    elements.modalWindow.setAttribute('style', 'display: none;');
    elements.modalWindow.removeAttribute('role');
    elements.modalWindow.removeAttribute('aria-modal');
    elements.modalWindow.setAttribute('aria-hidden', 'true');
    elements.body.classList.remove('modal-open');
    elements.body.removeAttribute('style');
  }
};

export const renderInterface = (val, elements) => {
  elements.form.addBtn.textContent = val.addBtn;
  elements.interface.h1.textContent = val.h1;
  elements.interface.lead.textContent = val.lead;
  elements.interface.label.textContent = val.label;
  elements.interface.example.textContent = val.example;
  elements.modal.modalRefBtn.textContent = val.modalRefBtn;
  elements.modal.modalCloseBtn.textContent = val.modalCloseBtn;
};

export const handleFormStatus = (value, elements) => {
  switch (value) {
    case 'filling':
      elements.addBtn.disabled = false;
      break;
    case 'sending':
      elements.addBtn.disabled = true;
      elements.feedback.classList.remove('text-danger' ?? 'text-success');
      break;
    case 'success':
      elements.feedback.classList.add('text-success');
      elements.form.reset();
      elements.input.focus();
      break;
    case 'error':
      elements.feedback.classList.add('text-danger');
      elements.input.focus();
      break;
    default:
      break;
  }
};

export const renderLanguage = (value, elements) => {
  elements.langBtn.forEach((btn) => {
    if (btn.value === value) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};
