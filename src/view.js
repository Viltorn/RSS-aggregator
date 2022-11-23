const feedback = document.querySelector('.feedback');

const render = () => (path, value) => {
  switch (path) {
    case 'form.errors':
      feedback.innerHTML = value;
      break;
    default:
      break;
  }
};

export default render;
