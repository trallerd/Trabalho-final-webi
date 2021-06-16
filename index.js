const urlBase = "https://opentdb.com";
const elementos = {
  telaInicial: document.getElementById("inicio"),
  telaJogo: document.getElementById("jogo"),
  categoriaGame: document.getElementById("category"),
  dificuldadeGame: document.getElementById("difficulty"),
  mCategoria: document.getElementById("mostra-categoria"),
  mDificuldade: document.getElementById("mostra-dificuldade"),
  mPergunta: document.getElementById("pergunta"),
  mResposta: document.getElementById("resposta"),
  ulGame: document.getElementById("ul-game"),
  botoes: {
    chosenGame: document.getElementById("chosen"),
    aleatoryGame: document.getElementById("aleatory"),
  },
};
let uncodeStr = (palavra) => {
  return palavra
    .replace("&quot;", '"')
    .replace("&#039;", "`")
    .replace("&uuml;", "ü")
    .replace("&deg;", "°");
};
const dificuldades = ["easy", "medium", "hard"];
const jogo = {
  category: 0,
  dificuldade: "",
  pergunta: null,
};

const montaCategoria = () => {
  axios.get(`${urlBase}/api_category.php`).then((response) => {
    for (const categoria of response.data.trivia_categories) {
      const buttonc = elementos.categoriaGame;
      buttonc.innerHTML += `<option value="${categoria.id}">${categoria.name}</option>`;
      buttonc.addEventListener("click", () => {
        jogo.category = buttonc.value;
      });
    }
  });
};

const montaDificuldade = () => {
  for (const dif of dificuldades) {
    const buttond = elementos.dificuldadeGame;
    buttond.innerHTML += `<option value="${dif}">${dif.toUpperCase()}</option>`;
    buttond.addEventListener("click", () => {
      jogo.dificuldade = buttond.value;
    });
  }
};

montaCategoria();
montaDificuldade();

elementos.botoes.chosenGame.addEventListener("click", () => {
  if (jogo.category != 0 && jogo.dificuldade != "") {
    axios
      .get(
        `${urlBase}/api.php?amount=1&category=${jogo.category}&difficulty=${jogo.dificuldade}`
      )
      .then((response) => {
        jogo.pergunta = response.data.results[0];
        montaGame();
      });
  } else {
    alert("Chose Difficulty and Category! Or Aleatory Game!");
  }
});

elementos.botoes.aleatoryGame.addEventListener("click", () => {
  axios.get(`${urlBase}/api.php?amount=1`).then((response) => {
    jogo.pergunta = response.data.results[0];
    montaGame();
  });
});

const montaGame = () => {
  elementos.mCategoria.textContent = `${jogo.pergunta.category.toUpperCase()}`;
  elementos.mDificuldade.textContent = `${jogo.pergunta.difficulty.toUpperCase()}`;
  const palavra = uncodeStr(jogo.pergunta.question);
  elementos.mPergunta.textContent = `${palavra.toUpperCase()}`;
  const rando = Math.floor(
    Math.random() * jogo.pergunta.incorrect_answers.length + 1
  );
  const resp = jogo.pergunta.incorrect_answers;
  const respC = jogo.pergunta.correct_answer;
  const tam = resp.length;
  for (let i = 0; i < tam; i++) {
    if (rando == i && tam > 1) {
      elementos.ulGame.innerHTML += `<li id="${i}" class="w-100 list-group-item list-group-item-dark">${respC}</li>`;
      i++;
    } else if (tam <= 1) {
      elementos.ulGame.innerHTML += `<li id="${i}" class="w-100 list-group-item list-group-item-dark">${respC}</li>`;

      elementos.ulGame.innerHTML += `<li id="${i}" class="w-100 list-group-item list-group-item-dark">${resp[i]}</li>`;

      break;
    }
    elementos.ulGame.innerHTML += `<li id="${i}" class="w-100 list-group-item list-group-item-dark">${resp[i]}</li>`;
  }
  elementos.telaInicial.style.display = "none";
  elementos.telaJogo.style.display = "flex";
};
