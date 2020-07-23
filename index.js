const conteiner = document.querySelector(".conteiner");
let countTimeout = 21;
const timerError = (t) => {
  if (countTimeout === 0 || countTimeout === 21) {
    countTimeout = t;
    let timerId = setInterval(() => {
      if (countTimeout === 1) clearTimeout(timerId);
      togglimitCount();
      countTimeout--;
      const errorLimit = document.querySelector(".errorLimit");
      const countLimit = document.createElement("span");
      if (countTimeout > 0) {
        countLimit.textContent = ` Подождите: ${countTimeout} секунд`;
      } else {
        errorLimit.style.background = "green";
        countLimit.textContent = ` Поиск можно продолжить`;
      }
      countLimit.classList.add("limitCount");
      errorLimit.appendChild(countLimit);
    }, 1000);
  } else countTimeout = t;
};
const getInput = () => {
  //вещаем событие на инпут и передаем данные из инпута в getGit
  const input = document.querySelector("input");
  input.addEventListener("input", () => {
    let form = document.forms.search;
    let search = form.elements.search;
    if (search.value === "") return togglList(); //очищаем контент если инпут пустой
    getGit(search.value);
  });
};
const togglList = () => {
  //проверяем заполененность контенра поиска
  const togglItem = document.querySelector(".list-name");
  if (togglItem !== null) togglItem.remove();
};
const togglimitCount = () => {
  //проверяем наличие счетчика
  const togglItem = document.querySelector(".limitCount");
  if (togglItem !== null) togglItem.remove();
};
const noSearchContent = () => {
  //Ничего не нашли
  togglList();
  const noSearch = document.createElement("div");
  noSearch.classList.add("noSearch");
  noSearch.textContent = "Результатов нет";
  const list = document.createElement("div");
  list.classList.add("list-name");
  list.appendChild(noSearch);
  conteiner.appendChild(list);
};
const errorLimit = () => {
  //Превысили лимит
  togglList();
  const noSearch = document.createElement("div");
  noSearch.classList.add("errorLimit");
  noSearch.textContent = "Вы привысили лимит запросов.";
  const list = document.createElement("div");
  list.classList.add("list-name");
  list.appendChild(noSearch);
  conteiner.appendChild(list);
  timerError(21);
};

const getGit = (search) => {
  try {
    fetch(
      `https://api.github.com/search/repositories?q=${search}+language:assembly&sort=stars&order=desc`
    )
      .then((r) => {
        if (!r.ok) {
          return errorLimit(20);
        }
        return r.json();
      })
      .then((r) => {
        const fragment = document.createDocumentFragment();
        if (r.items.length === 0) return noSearchContent();
        let lengthArr = r.items.length > 5 ? 5 : r.items.length; //выводим количество результатов, не больше 5
        const list = document.createElement("div");
        list.classList.add("list-name");
        for (let i = 0; i < lengthArr; i++) {
          const item = document.createElement("div");
          item.classList.add("item");
          item.textContent = r.items[i].name;
          list.appendChild(item);
          fragment.appendChild(list);
        }
        togglList();
        conteiner.appendChild(fragment);
      })
      .catch((e) => {});
  } catch (e) {
    console.log("ошибка", e);
  }
};
getInput();
