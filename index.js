const searchContent = document.querySelector(".search-content");
let arrSearch = [];
const getInput = () => {
  //вещаем событие на инпут и передаем данные из инпута в getGit
  const input = document.querySelector("input");
  input.addEventListener("change", () => {
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
  list.append(noSearch);
  searchContent.append(list);
};

const errorLimit = () => {
  //Превысили лимит
  togglList();
  const noSearch = document.createElement("div");
  noSearch.classList.add("errorLimit");
  noSearch.textContent =
    "Вы привысили лимит запросов. Попробуйте повторить позже";
  const list = document.createElement("div");
  list.classList.add("list-name");
  list.append(noSearch);
  searchContent.append(list);
};

const addResult = (e) => {
  //добавляем выбранный результат
  let result = arrSearch.find((item) => item.name == e.target.textContent);
  console.log(result);

  const name = document.createElement("div");
  name.classList.add("name");
  name.textContent = `Name: ${result.name}`;

  const author = document.createElement("div");
  author.classList.add("author");
  author.textContent = `Owner: ${result.author}`;

  const star = document.createElement("div");
  star.classList.add("star");
  star.textContent = `Stars: ${result.star}`;

  const content = document.createElement("div");
  content.classList.add("content-item");

  content.append(name);
  content.append(author);
  content.append(star);

  const deleteitem = document.createElement("button");
  deleteitem.classList.add("close");
  deleteitem.addEventListener("click", (e) => {
    const btn = e.target;
    btn.parentElement.remove();
  });

  const resultItem = document.createElement("div");
  resultItem.classList.add("result-item");
  resultItem.append(content);
  resultItem.append(deleteitem);

  const retustContent = document.querySelector(".result");
  retustContent.append(resultItem);
};

const getGit = (search) => {
  try {
    fetch(
      `https://api.github.com/search/repositories?q=${search}+language:assembly&sort=stars&order=desc`
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
        list.classList.add("list-name");
        for (let i = 0; i < lengthArr; i++) {
          arrSearch.push({
            name: r.items[i].name,
            author: r.items[i].owner.login,
            star: r.items[i].stargazers_count,
          });
          const item = document.createElement("div");
          item.classList.add("item");
          item.textContent = r.items[i].name;
          list.append(item);
          item.addEventListener("click", (e) => {
            addResult(e);
          });
          fragment.append(list);
        }
        togglList();
        searchContent.append(fragment);
      })
      .catch((e) => {});
  } catch (e) {
    console.log("ошибка", e);
  }
};

getInput();