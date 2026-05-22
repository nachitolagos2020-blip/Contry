import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOGIN

const password =
  prompt("Contraseña");

if(password !== "country2026"){

  document.body.innerHTML = `

    <div class="login-error">

      Contraseña incorrecta

    </div>

  `;

  throw new Error("Sin acceso");

}

// FIREBASE

const firebaseConfig = {

  apiKey: "AIzaSyDVI76qVw8v00Kr6sG537oIP2yw4AdR5-g",

  authDomain: "contry-c4953.firebaseapp.com",

  projectId: "contry-c4953",

  storageBucket: "contry-c4953.firebasestorage.app",

  messagingSenderId: "775091873432",

  appId: "1:775091873432:web:93331d930a4aa1063c52ed"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ELEMENTOS

const contenedor =
  document.getElementById("contenedorRegistros");

const buscador =
  document.getElementById("buscador");

const totalRegistros =
  document.getElementById("totalRegistros");

const botonesSector =
  document.querySelectorAll(".sector-btn");

const filtroEstado =
  document.getElementById("filtroEstado");

const filtroFecha =
  document.getElementById("filtroFecha");

const horaActual =
  document.getElementById("horaActual");

const layout =
  document.getElementById("layout");

const toggleMenu =
  document.getElementById("toggleMenu");

// FECHA AUTOMÁTICA

const hoy = new Date();

const año = hoy.getFullYear();

const mes =
  String(hoy.getMonth() + 1)
  .padStart(2,"0");

const dia =
  String(hoy.getDate())
  .padStart(2,"0");

filtroFecha.value =
  `${año}-${mes}-${dia}`;

// HORA

function actualizarHora(){

  const ahora = new Date();

  horaActual.innerHTML =

    ahora.toLocaleDateString() +

    " • " +

    ahora.toLocaleTimeString();

}

setInterval(actualizarHora,1000);

actualizarHora();

// MENU

toggleMenu.addEventListener("click", () => {

  layout.classList.toggle("minimized");

});

// VARIABLES

let sectorActual = "Campo";

let todosLosRegistros = [];

// BOTONES

botonesSector.forEach((boton) => {

  boton.addEventListener("click", () => {

    botonesSector.forEach((b) =>
      b.classList.remove("active")
    );

    boton.classList.add("active");

    sectorActual =
      boton.dataset.sector;

    filtrarRegistros();

  });

});

// MOSTRAR

function mostrarRegistros(lista){

  contenedor.innerHTML = "";

  totalRegistros.innerHTML =
    lista.length;

  lista.forEach((registro,index) => {

    let colorEstado = "#2563eb";

    if(registro.estado === "Observacion"){
      colorEstado = "#eab308";
    }

    if(registro.estado === "Urgente"){
      colorEstado = "#ef4444";
    }

    const textoLargo =
      registro.descripcion.length > 180;

    const textoCorto =
      registro.descripcion.substring(0,180);

    contenedor.innerHTML += `

      <div class="registro-card">

        <div class="registro-header">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <div class="sector-mini">
              ${registro.sector}
            </div>

          </div>

          <span
            class="estado"
            style="background:${colorEstado}"
          >

            ${registro.estado}

          </span>

        </div>

        <div
          class="descripcion"
          id="desc-${index}"
        >

          ${textoLargo ? textoCorto + "..." : registro.descripcion}

          ${textoLargo ? `

            <button
              class="ver-mas"
              onclick="toggleTexto(${index},
              \`${registro.descripcion}\`,
              \`${textoCorto}\`)"

            >

              Ver más

            </button>

          ` : ""}

        </div>

        <div class="info">

          <span>
            📍 ${registro.coordenadas}
          </span>

          <span>
            🕒 ${registro.fecha}
          </span>

        </div>

        ${registro.imagen ? `

          <button
            class="foto-btn"
            onclick="toggleImagen(${index})"
          >

            Ver Foto

          </button>

          <img
            src="${registro.imagen}"
            class="preview-img"
            id="img-${index}"
          >

        ` : ""}

      </div>

    `;

  });

}

// TOGGLE FOTO

window.toggleImagen = (id) => {

  document
    .getElementById(`img-${id}`)
    .classList.toggle("active");

};

// TOGGLE TEXTO

window.toggleTexto = (id,texto,corto) => {

  const box =
    document.getElementById(`desc-${id}`);

  if(box.classList.contains("expandido")){

    box.classList.remove("expandido");

    box.innerHTML = `

      ${corto}...

      <button
        class="ver-mas"
        onclick="toggleTexto(${id},
        \`${texto}\`,
        \`${corto}\`)"

      >

        Ver más

      </button>

    `;

  }else{

    box.classList.add("expandido");

    box.innerHTML = `

      ${texto}

      <button
        class="ver-mas"
        onclick="toggleTexto(${id},
        \`${texto}\`,
        \`${corto}\`)"

      >

        Ver menos

      </button>

    `;

  }

};

// FILTRAR

function filtrarRegistros(){

  const valor =
    buscador.value.toLowerCase();

  const estadoFiltro =
    filtroEstado.value;

  const fechaFiltro =
    filtroFecha.value;

  const filtrados =
    todosLosRegistros.filter((r) => {

      const coincideSector =
        r.sector === sectorActual;

      const coincideBusqueda =
        r.nombre.toLowerCase()
        .includes(valor);

      const coincideEstado =

        estadoFiltro === "" ||

        r.estado === estadoFiltro;

      const coincideFecha =

        fechaFiltro === "" ||

        r.fecha.includes(
          fechaFiltro.split("-").reverse().join("/")
        );

      return(

        coincideSector &&
        coincideBusqueda &&
        coincideEstado &&
        coincideFecha

      );

    });

  mostrarRegistros(filtrados);

}

// EVENTOS

buscador.addEventListener("input",filtrarRegistros);

filtroEstado.addEventListener("change",filtrarRegistros);

filtroFecha.addEventListener("change",filtrarRegistros);

// FIREBASE

const q = query(

  collection(db,"registros"),

  orderBy("fecha","desc")

);

onSnapshot(q,(snapshot) => {

  todosLosRegistros = [];

  snapshot.forEach((doc) => {

    todosLosRegistros.push(doc.data());

  });

  filtrarRegistros();

});
