const urlBase = "https://opentdb.com";
const elementos = {
  telaInicial: document.getElementById("inicio"),
  telaJogo: document.getElementById("jogo"),
  categoriaGame: document.getElementById("category"),
  dificuldadeGame: document.getElementById("difficulty"),
  mCategoria: document.querySelector(".mostra-categoria"),
  mDificuldade: document.querySelector(".mostra-dificuldade"),
  mPergunta: document.querySelector(".pergunta"),
  mResposta: document.getElementById("resposta"),
  ulGame: document.getElementById("ul-game"),
  botoes: {
    chosenGame: document.getElementById("chosen"),
    aleatoryGame: document.getElementById("aleatory"),
    respond: document.getElementById("respond"),
    back: document.getElementById("back"),
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
  li: 0,
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

const iniciaGame = () => {
  jogo.category = 0;
  jogo.dificuldade = "";
  jogo.pergunta = null;
  jogo.li = 0;
  montaCategoria();
  montaDificuldade();
  elementos.telaInicial.style.display = "flex";
  elementos.telaJogo.style.display = "none";
};

iniciaGame();

elementos.botoes.chosenGame.addEventListener("click", () => {
  if (jogo.category != 0 && jogo.dificuldade != "") {
    iniciaGame()
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
  iniciaGame()

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

  elementos.telaInicial.style.display = "none";
  elementos.telaJogo.style.display = "flex";
};

const mostraResposta = () => {
  elementos.botoes.respond.style.display = "none";
  const rando = Math.floor(
    Math.random() * jogo.pergunta.incorrect_answers.length + 1
  );
  jogo.li = rando;
  const resp = jogo.pergunta.incorrect_answers;
  const respC = jogo.pergunta.correct_answer;
  const tam = resp.length;
  for (let i = 0; i < tam; i++) {
    if (rando == i && tam > 1) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(respC));
      li.classList.add("w-100");
      li.classList.add("list-group-item");
      li.classList.add("list-group-item-dark");
      li.id = i;
      elementos.ulGame.appendChild(li);
      li.addEventListener("click", () => {
        li.style.backgroundColor = "#6faf73";
      });
    } else if (tam == 1) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(respC));
      li.classList.add("w-100");
      li.classList.add("list-group-item");
      li.classList.add("list-group-item-dark");
      li.classList.add(`${i + 1}`);
      elementos.ulGame.appendChild(li);
      li.addEventListener("click", () => {
        li.style.backgroundColor = "#6faf73";
      });

      const li2 = document.createElement("li");
      li2.appendChild(document.createTextNode(resp[i]));
      li2.classList.add("w-100");
      li2.classList.add("list-group-item");
      li2.classList.add("list-group-item-dark");
      li2.classList.add(`${i}`);
      elementos.ulGame.appendChild(li2);
      li2.addEventListener("click", () => {
        li2.style.backgroundColor = "#f87e7e";
        li.style.backgroundColor = "#6faf73";
      });
      break;
    }
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(resp[i]));
    li.classList.add("w-100");
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-dark");
    li.classList.add(`${i}`);
    elementos.ulGame.appendChild(li);
    li.addEventListener("click", () => {
      li.style.backgroundColor = "#f87e7e";
      document.getElementById(`${jogo.li}`).style.backgroundColor = "#6faf73";
    });
  }
};

elementos.botoes.respond.addEventListener("click", () => mostraResposta());
elementos.botoes.back.addEventListener("click", () => iniciaGame());
