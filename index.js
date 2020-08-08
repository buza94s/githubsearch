const searchContent = document.querySelector(".search-content");
let arrResultSearch = [];
const getInput = () => {
  //вешаем событие на инпут и передаем данные из инпута в getGit
  const inputSearch = document.querySelector("input");
  inputSearch.addEventListener("change", () => {
    let formSearch = document.forms.search;
    let resultInputSearch = formSearch.elements.search;
    if (resultInputSearch.value === "") return removeList(); //очищаем контент если инпут пустой
    resultSearchGit(resultInputSearch.value);
  });
};

const removeList = () => {
  //проверяем заполененность контента поиска
  const togglItem = document.querySelector(".list-name");
  if (togglItem !== null) togglItem.remove();
};

const noSearchContent = () => {
  //Ничего не нашли
  removeList();
  const noResultSearch = document.createElement("div");
  noResultSearch.classList.add("noSearch");
  noResultSearch.textContent = "Результатов нет";
  const divElementlist = document.createElement("div");
  divElementlist.classList.add("list-name");
  divElementlist.append(noSearch);
  searchContent.append(divElementlist);
};

const errorLimit = () => {
  //Превысили лимит
  removeList();
  const noSearch = document.createElement("div");
  noSearch.classList.add("errorLimit");
  noSearch.textContent =
    "Вы привысили лимит запросов. Попробуйте повторить позже";
  const divElementlist = document.createElement("div");
  divElementlist.classList.add("list-name");
  divElementlist.append(noSearch);
  searchContent.append(divElementlist);
};

const addResult = (e) => {
  //добавляем выбранный результат
  let resultContent = arrResultSearch.find((item) => item.id == e.target.id);

  const name = document.createElement("div");
  name.classList.add("result-item__content-name");
  name.textContent = `Name: ${resultContent.name}`;

  const author = document.createElement("div");
  author.classList.add("result-item__content-author");
  author.textContent = `Owner: ${resultContent.author}`;

  const star = document.createElement("div");
  star.classList.add("result-item__content-star");
  star.textContent = `Stars: ${resultContent.star}`;

  const content = document.createElement("div");
  content.classList.add("result-item__content");

  content.append(name);
  content.append(author);
  content.append(star);

  const buttonElementdelete = document.createElement("button");
  buttonElementdelete.classList.add("result-item__close", "close");
  buttonElementdelete.addEventListener("click", (e) => {
    const btn = e.target;
    btn.parentElement.remove();
  });

  const resultItem = document.createElement("div");
  resultItem.classList.add("result__item", "result-item");
  resultItem.append(content);
  resultItem.append(deleteitem);

  const retustContent = document.querySelector(".result");
  retustContent.append(resultItem);
};

const resultSearchGit = (search) => {
  try {
    fetch(
      `https://api.github.com/search/repositories?q=${search}&sort=stars&order=desc`
    )
      .then((r) => {
        if (!r.ok) {
          return errorLimit();
        }
        return r.json();
      })
      .then((r) => {
        const fragment = document.createDocumentFragment();
        if (r.items.length === 0) return noSearchContent();
        let lengthArr = r.items.length > 5 ? 5 : r.items.length; //выводим количество результатов, не больше 5
        const list = document.createElement("div");
        list.classList.add("search-content__list-name", "list-name");
        for (let i = 0; i < lengthArr; i++) {
          arrResultSearch.push({
            id: r.items[i].id,
            name: r.items[i].name,
            author: r.items[i].owner.login,
            star: r.items[i].stargazers_count,
          });
          const item = document.createElement("div");
          item.classList.add("list-name__item");
          item.setAttribute("id", `${r.items[i].id}`);
          item.textContent = r.items[i].name;
          list.append(item);
          item.addEventListener("click", (e) => {
            addResult(e);
          });
          fragment.append(list);
        }
        removeList();
        searchContent.append(fragment);
      })
      .catch((e) => {});
  } catch (e) {
    console.log("ошибка", e);
  }
};

getInput();
