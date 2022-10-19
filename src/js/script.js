function throttle(func, ms) {
  let isThrottled = false;
  let savedArgs;
  let savedThis;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);
    isThrottled = true;

    setTimeout(function () {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

const buttonClickHandler = (evt, arr, cb) => {
  evt.target.style.display = 'none';
  window.removeEventListener('resize', cb);

  for (let i = 0; i < arr.children.length; i++) {
    arr.children[i].style.display = 'inline-block';
  }
}

const terms = document.querySelectorAll('.terms');

const sessionClickHandler = () => {
  for (const term of terms) {
    const sessions = term.querySelectorAll('.sessions');

    for (const session of sessions) {
      session.addEventListener('click', (evt) => {
        for (const item of session.children) {
          item.classList.remove('sessions__item--active');
        }
        evt.target.classList.add('sessions__item--active');
      })
    }
  }
}

const examinationAmountElement = (btn, count, session) => {
  btn.style.display = 'inline-block';
  btn.addEventListener('click', (evt) => {
    buttonClickHandler(evt, session, throttleRefreshSessionsList);
  })

  for (let i = count; i < session.children.length; i++) {
    session.children[i].style.display = 'none';
  }
}

const throttleRefreshSessionsList = throttle(showSessionList, 100);

function showSessionList() {
  for (const term of terms) {
    const sessions = term.querySelectorAll('.sessions');
    const button = term.querySelector('.sessions__button');

    for (const session of sessions) {
      for (let i = 0; i < session.children.length; i++) {
        session.children[i].style.display = 'inline-block';
      }

      if (window.innerWidth >= 580 && session.children.length > 4) {
        examinationAmountElement(button, 3, session);
      }

      if (window.innerWidth < 580 && session.children.length >= 6) {
        examinationAmountElement(button, 5, session);
      }

      if (window.innerWidth < 510 && session.children.length > 5) {
        examinationAmountElement(button, 4, session);
      }

      if (window.innerWidth < 445 && session.children.length > 4) {
        examinationAmountElement(button, 3, session);
      }
    }
  }
}

showSessionList();
sessionClickHandler();

window.addEventListener('resize', throttleRefreshSessionsList);
