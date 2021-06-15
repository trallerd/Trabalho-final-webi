const urlBase = "https://opentdb.com";
const elementos = {
  telaInicial: document.getElementById("inicial"),
  telaJogo: document.getElementById("jogo"),
  categoriaGame: document.getElementById("category"),
  dificuldadeGame: document.getElementById("difficulty"),
  botoes: {
    chosenGame: document.getElementById("chosen"),
    aleatoryGame: document.getElementById("aleatory"),
  },
};

const dificuldades = ["easy", "medium", "hard"];
const jogo = {
  category: 0,
  dificuldade: "",
};

const montaCategoria = () => {
  axios.get(`${urlBase}/api_category.php`).then((response) => {
    for (const categoria of response.data.trivia_categories) {
      const buttonc = elementos.categoriaGame;
      buttonc.innerHTML += `<option value="${categoria.id}">${categoria.name}</option>`;
      buttonc.addEventListener("click", () => {
        jogo.category.id = buttonc.value;
      });
    }
  });
};

const montaDificuldade = () => {
  for (const dif of dificuldades) {
    const buttond = elementos.dificuldadeGame;
    buttond.innerHTML += `<option value="${dif}">${dif}</option>`;
    buttond.addEventListener("click", () => {
      jogo.dificuldade = buttond.value;
    });
  }
};

montaCategoria();
montaDificuldade();
