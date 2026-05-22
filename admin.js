import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,
  collection,
  onSnapshot,
  query

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

const totalRegistros =
  document.getElementById("totalRegistros");

const buscador =
  document.getElementById("buscador");

const filtroEstado =
  document.getElementById("filtroEstado");

const filtroFecha =
  document.getElementById("filtroFecha");

const botonesSector =
  document.querySelectorAll(".sector-btn");

const sidebar =
  document.getElementById("sidebar");

const menuToggle =
  document.getElementById("menuToggle");

const adminMain =
  document.getElementById("adminMain");

const fechaActual =
  document.getElementById("fechaActual");

// MENU

menuToggle.addEventListener("click", () => {

  sidebar.classList.toggle("hidden");

  adminMain.classList.toggle("expandido");

});

// FECHA Y HORA

function actualizarHora(){

  const ahora = new Date();

  fechaActual.innerHTML =

    ahora.toLocaleDateString("es-AR") +

    " • " +

    ahora.toLocaleTimeString("es-AR",{

      hour:"2-digit",
      minute:"2-digit"

    });

}

setInterval(actualizarHora,1000);

actualizarHora();

// FECHA AUTOMATICA

const hoy =
  new Date().toISOString().split("T")[0];

filtroFecha.value = hoy;

// VARIABLES

let registros = [];

let sectorActual = "Campo";

// SECTORES

botonesSector.forEach((boton) => {

  boton.addEventListener("click", () => {

    botonesSector.forEach((b) => {

      b.classList.remove("active");

    });

    boton.classList.add("active");

    sectorActual =
      boton.dataset.sector;

    filtrar();

  });

});

// EXPANDIR TEXTO

window.toggleTexto = function(textoId,cardId){

  const texto =
    document.getElementById(textoId);

  const card =
    document.getElementById(cardId);

  texto.classList.toggle("oculta");

  card.classList.toggle("expandido");

};

// MOSTRAR

function mostrar(lista){

  contenedor.innerHTML = "";

  totalRegistros.innerHTML =
    lista.length;

  lista.forEach((registro,index) => {

    let colorEstado = "#3b82f6";

    if(registro.estado === "Observacion"){
      colorEstado = "#f59e0b";
    }

    if(registro.estado === "Urgente"){
      colorEstado = "#ef4444";
    }

    const textoId =
      "texto" + index;

    const cardId =
      "card" + index;

    const textoLargo =
      registro.descripcion &&
      registro.descripcion.length > 180;

    contenedor.innerHTML += `

      <div class="registro-card"
           id="${cardId}">

        <div class="registro-header">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <div class="sector-mini">
              ${registro.sector}
            </div>

          </div>

          <div class="estado"
               style="background:${colorEstado}">

            ${registro.estado}

          </div>

        </div>

        <div
          class="descripcion ${textoLargo ? "oculta" : ""}"
          id="${textoId}"
        >

          ${registro.descripcion}

        </div>

        ${textoLargo ? `

          <span
            class="ver-mas"
            onclick="toggleTexto('${textoId}','${cardId}')"
          >

            Ver más

          </span>

        ` : ""}

        <div class="info">

          <span>
            📍 ${registro.coordenadas}
          </span>

          <span>
            🕒 ${registro.fecha}
          </span>

        </div>

        ${registro.imagen ? `

          <div class="foto-box">

            <img
              src="${registro.imagen}"
              class="preview-img"
            >

            <a
              href="${registro.imagen}"
              target="_blank"
              class="ver-foto"
            >

              Ver Imagen

            </a>

          </div>

        ` : ""}

      </div>

    `;

  });

}

// FILTRAR

function filtrar(){

  const texto =
    buscador.value.toLowerCase();

  const estado =
    filtroEstado.value;

  const fecha =
    filtroFecha.value;

  const filtrados =
    registros.filter((r) => {

      const coincideNombre =

        r.nombre
        .toLowerCase()
        .includes(texto);

      const coincideSector =

        r.sector === sectorActual;

      const coincideEstado =

        estado === "Todos" ||

        r.estado === estado;

      let coincideFecha = true;

      if(fecha){

        coincideFecha =
          r.fecha &&
          r.fecha.includes(fecha);

      }

      return (

        coincideNombre &&
        coincideSector &&
        coincideEstado &&
        coincideFecha

      );

    });

  mostrar(filtrados);

}

// EVENTOS

buscador.addEventListener("input", filtrar);

filtroEstado.addEventListener("change", filtrar);

filtroFecha.addEventListener("change", filtrar);

// FIREBASE

const q = query(

  collection(db, "registros")

);

onSnapshot(q, (snapshot) => {

  registros = [];

  snapshot.forEach((doc) => {

    registros.push(doc.data());

  });

  registros.reverse();

  filtrar();

});
