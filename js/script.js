//Elementos Dom
let btnSearch = null;
let elFilteredPeople = null;
let elStatistics = null;
let txtName = null;
// Variáveis
let people = [];
let filtredPeople = [];
let totalGenderM = null;
let totalGenderF = null;
let sumAges = null;
let avgAges = null;


// Iniciando a criação de funções e criação de elementos Dom

window.addEventListener('load', () => {
  btnSearch = document.querySelector("#btnSearch");
  elFilteredPeople = document.querySelector("#peoples");
  elStatistics = document.querySelector("#statistics");
  txtName = document.querySelector("#search");
  AddEvent();
  fetchPeople();
});

// Função que é responsável pelo recebimento dos dados vindos da API. API => ARRAY
async function fetchPeople() {
  const res = await fetch("https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo");
  const json = await res.json();
  people = json.results.map(person => {
    const {
      name,
      picture,
      gender,
      dob
    } = person;
    return {
      gender,
      name: `${name.first}  ${name.last}`,
      picture: picture.thumbnail,
      age: dob.age
    }
  });
};

//Funcão que faz a renderização dos elementos na TELA.
function render() {
  renderFilteredPeople();
  renderStatistics();
}

function renderStatistics() {
  // Calculando quantas pessoas são do sexo masculino
  totalGenderM = filtredPeople.reduce((acumulator, current) => {
    if (current.gender === "male") {
      acumulator++;
    }
    return acumulator;
  }, 0)

  // Calculando quantas pessoas são do sexo feminino
  totalGenderF = filtredPeople.reduce((acumulator, current) => {
    if (current.gender === "female") {
      acumulator++;
    }
    return acumulator;
  }, 0)

  // Calculando a soma das idades
  sumAges = filtredPeople.reduce((acumulator, current) => {
    return acumulator + parseInt(current.age);
  }, 0)

  // Calculando a média das idades
  avgAges = Math.abs((sumAges / filtredPeople.length));

  elStatistics.innerHTML +=
    `<h4>Statistics</h4>
  <p>Sexo Masculino: <b>${totalGenderM}</b></p>
  <p>Sexo Feminino: <b>${totalGenderF}</b></p>
  <p>Soma das Idades: <b>${sumAges}</b></p>
  <p>Média das Idades: <b>${avgAges}</b></p>
  `;
}

function renderFilteredPeople() {
  let peopleHTML = `<h4>${filtredPeople.length} users founded</h4><div>`
  filtredPeople.forEach(person => {
    const {
      name,
      picture,
      age
    } = person;
    let personHTML =
      `<div class="row valign-wrapper">
        <div class="col s2">
          <img class="circle responsive-img" src="${picture}" alt="${name}"/>
        </div>
        <div class="col s9">
          <span>${name} , ${age} anos</span>
        </div>
      </div>`;
    peopleHTML += personHTML;
  });
  peopleHTML += "</div>"
  elFilteredPeople.innerHTML = peopleHTML;
}

// Adicionando eventos ao input e ao botão
function AddEvent() {
  btnSearch.addEventListener('click', (e) => {
    filterPeople(txtName.value);
    elStatistics.innerHTML = '';
    render();
  });
  txtName.addEventListener('keyup', () => {
    filterPeople(txtName.value);
    elStatistics.innerHTML = '';
    render();
  })
}

// Filtrando os dados e ordenando
function filterPeople(text) {
  filtredPeople = people.filter((person => person.name.includes(text))).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}
