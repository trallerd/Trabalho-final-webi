const urlBase = "https://opentdb.com";
const elementos = {
  telaInicial: document.getElementById("inicio"),
  telaJogo: document.getElementById("jogo"),
  telaFinal: document.getElementById("final"),
  categoriaGame: document.getElementById("category"),
  dificuldadeGame: document.getElementById("difficulty"),
  mCategoria: document.querySelector(".mostra-categoria"),
  fCategoria: document.querySelector(".final-categoria"),
  fDificuldade: document.querySelector(".final-dificuldade"),
  mPontos: document.querySelector(".mostra-pontos"),
  mRespondidas: document.querySelector(".mostra-respondidas"),
  mErros: document.querySelector(".mostra-erros"),
  mAcertos: document.querySelector(".mostra-acertos"),
  mDificuldade: document.querySelector(".mostra-dificuldade"),
  mPergunta: document.querySelector(".pergunta"),
  mResposta: document.getElementById("resposta"),
  ulGame: document.getElementById("ul-game"),
  botoes: {
    chosenGame: document.getElementById("chosen"),
    aleatoryGame: document.getElementById("aleatory"),
    sevedQUestion: document.getElementById("chose-later"),
    respondLater: document.getElementById("later"),
    back: document.getElementById("back"),
    end: document.getElementById("end-game"),
    tEnd: document.getElementById("two-end-game"),
    novamente: document.getElementById("begin"),
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
  respondLater: null,
  respondidas: 0,
  li: 0,
  flagPerg: false,
  click: false,
  erros: 0,
  acertos: 0,
  pontos: 0,
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
  elementos.categoriaGame.innerHTML = `<option value="">Chose Category</option>`;
  elementos.dificuldadeGame.innerHTML = `<option value="">Chose Difficulty</option>`;

  jogo.category = 0,
  jogo.dificuldade = "",
  jogo.pergunta = null,
  jogo.li = 0,
  jogo.click = false,


  montaCategoria();
  montaDificuldade();
  elementos.telaInicial.style.display = "flex";
  elementos.telaJogo.style.display = "none";
  elementos.telaFinal.style.display = "none";
};

iniciaGame();

elementos.botoes.chosenGame.addEventListener("click", () => {
  if (jogo.category != 0 && jogo.dificuldade != "") {
    axios
      .get(
        `${urlBase}/api.php?amount=1&category=${jogo.category}&difficulty=${jogo.dificuldade}`
      )
      .then((response) => {
        jogo.pergunta = response.data.results[0];
        jogo.category = response.data.results[0].category;
        jogo.dificuldade = response.data.results[0].difficulty;
        montaGame(true);
      });
  } else {
    alert("Chose Difficulty and Category! Or Aleatory Game!");
  }
});

elementos.botoes.aleatoryGame.addEventListener("click", () => {
  axios.get(`${urlBase}/api.php?amount=1`).then((response) => {
    jogo.pergunta = response.data.results[0];
    jogo.category = response.data.results[0].category;
    jogo.dificuldade = response.data.results[0].difficulty;
    montaGame(true);
  });
});

const montaGame = (respo) => {
  if (!respo) {
    elementos.botoes.respondLater.style.display = "none";
  }
  elementos.mCategoria.textContent = `${jogo.pergunta.category.toUpperCase()}`;
  elementos.mDificuldade.textContent = `${jogo.pergunta.difficulty.toUpperCase()}`;
  const palavra = uncodeStr(jogo.pergunta.question);
  elementos.mPergunta.textContent = `${palavra.toUpperCase()}`;

  elementos.telaInicial.style.display = "none";
  elementos.telaFinal.style.display = "none";
  elementos.telaJogo.style.display = "flex";
  mostraResposta();
};

const mostraResposta = () => {
  elementos.ulGame.innerHTML = "";
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
      elementos.ulGame.appendChild(li, elementos.ulGame.firstElementChild);
      li.addEventListener("click", () => {
        if (!jogo.click) {
          contagem(true);
          li.style.backgroundColor = "#6faf73";
          jogo.click = true;
        }
      });
    } else if (tam == 1) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(respC));
      li.classList.add("w-100");
      li.classList.add("list-group-item");
      li.classList.add("list-group-item-dark");
      li.classList.add(`${i + 1}`);
      elementos.ulGame.appendChild(li, elementos.ulGame.firstElementChild);
      li.addEventListener("click", () => {
        if (!jogo.click) {
          contagem(true);
          li.style.backgroundColor = "#6faf73";
          jogo.click = true;
        }
      });

      const li2 = document.createElement("li");
      li2.appendChild(document.createTextNode(resp[i]));
      li2.classList.add("w-100");
      li2.classList.add("list-group-item");
      li2.classList.add("list-group-item-dark");
      li2.classList.add(`${i}`);
      elementos.ulGame.appendChild(li2, elementos.ulGame.firstElementChild);
      li2.addEventListener("click", () => {
        if (!jogo.click) {
          contagem(false);
          li2.style.backgroundColor = "#f87e7e";
          li.style.backgroundColor = "#6faf73";
          jogo.click = true;
        }
      });
      break;
    }
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(resp[i]));
    li.classList.add("w-100");
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-dark");
    li.classList.add(`${i}`);
    elementos.ulGame.appendChild(li, elementos.ulGame.firstElementChild);
    li.addEventListener("click", () => {
      if (!jogo.click) {
        contagem(false);
        li.style.backgroundColor = "#f87e7e";
        document.getElementById(`${jogo.li}`).style.backgroundColor = "#6faf73";
        jogo.click = true;
      }
    });
  }
};

const pontos = (acerto, responderL) => {
  if (acerto) {
    if (!responderL) {
      if (jogo.dificuldade == "easy") {
        jogo.pontos += 5;
      } else if (jogo.dificuldade == "medium") {
        jogo.pontos += 8;
      } else if (jogo.dificuldade == "hard") {
        jogo.pontos += 10;
      } else {
        alert("error");
      }
    }else{
      if (jogo.dificuldade == "easy") {
        jogo.pontos += 3;
      } else if (jogo.dificuldade == "medium") {
        jogo.pontos += 6;
      } else if (jogo.dificuldade == "hard") {
        jogo.pontos += 8;
      } else {
        alert("error");
      }
    }
  }else if(!acerto){
    if (jogo.dificuldade == "easy") {
      jogo.pontos -= 5;
    } else if (jogo.dificuldade == "medium") {
      jogo.pontos -= 8;
    } else if (jogo.dificuldade == "hard") {
      jogo.pontos -= 10;
    } else {
      alert("error");
    }
  }
};

const contagem = (ponto) => {
  if(jogo.flagPerg){
    if (ponto) {
      jogo.respondidas++;
      jogo.acertos++;
      pontos(true,true)
    } else if (jogo.erros == 2) {
      jogo.respondidas++;
      jogo.erros++;
      pontos(false,true)
      window.stop();
      window.setTimeout(perdeu, 1000);
    } else {
      pontos(false,true)
      jogo.respondidas++;
      jogo.erros++;
    }
  }else{
    if (ponto) {
      jogo.respondidas++;
      jogo.acertos++;
      pontos(true,false)
    } else if (jogo.erros == 2) {
      jogo.respondidas++;
      jogo.erros++;
      pontos(false,false)
      window.stop();
      window.setTimeout(perdeu, 1000);
    } else {
      pontos(false,false)
      jogo.respondidas++;
      jogo.erros++;
    }
  }
};

const perdeu = () => {
  if(jogo.pontos>0){
    elementos.mPontos.style.color = "#6faf73";
  }else{
    elementos.mPontos.style.color = "#f87e7e";
  }
  elementos.mPontos.textContent = `Pontos: ${jogo.pontos}`;
  elementos.mAcertos.textContent = `Acertos: ${jogo.acertos}`;
  elementos.mErros.textContent = `Erros: ${jogo.erros}`;
  elementos.mRespondidas.textContent = `N° Respondidas: ${jogo.respondidas}`;
  elementos.fCategoria.textContent = `Categoria: ${jogo.category}`;
  elementos.fDificuldade.textContent = `Dificuldade: ${jogo.dificuldade}`;
  elementos.telaInicial.style.display = "none";
  elementos.telaFinal.style.display = "flex";
  elementos.telaJogo.style.display = "none";
};

elementos.botoes.respondLater.addEventListener("click", () => {
  if (!jogo.respondLater) {
    jogo.respondLater = jogo.pergunta;
    jogo.flagPerg = true;
    iniciaGame();
  } else {
    alert("You have a question saved! Respond that first!");
  }
});
elementos.botoes.sevedQUestion.addEventListener("click", () => {
  if (jogo.respondLater) {
    jogo.pergunta = jogo.respondLater;
    jogo.category = jogo.pergunta.category;
    jogo.dificuldade = jogo.pergunta.difficulty;
    jogo.flagPerg = true;
    montaGame(false);
  } else {
    alert("You need to save a question first!");
  }
});
elementos.botoes.back.addEventListener("click", () => iniciaGame());
elementos.botoes.novamente.addEventListener("click", () => {
  jogo.respondLater = null,
  jogo.respondidas =  0,
  jogo.erros = 0,
  jogo.acertos = 0,
  jogo.pontos = 0,

  iniciaGame()
});
elementos.botoes.end.addEventListener("click", () => perdeu());
elementos.botoes.tEnd.addEventListener("click", () => perdeu());
