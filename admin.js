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

const totalRegistros =
  document.getElementById("totalRegistros");

const buscador =
  document.getElementById("buscador");

const filtroEstado =
  document.getElementById("filtroEstado");

const botonesSector =
  document.querySelectorAll(".sector-btn");

// VARIABLES

let registros = [];

let sectorActual = "Campo";

// BOTONES

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

// MOSTRAR

function mostrar(lista){

  contenedor.innerHTML = "";

  totalRegistros.innerHTML =
    lista.length;

  lista.forEach((registro) => {

    let colorEstado = "#3b82f6";

    if(registro.estado === "Observacion"){
      colorEstado = "#f59e0b";
    }

    if(registro.estado === "Urgente"){
      colorEstado = "#ef4444";
    }

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

          <div class="estado"
               style="background:${colorEstado}">

            ${registro.estado}

          </div>

        </div>

        <div class="descripcion">

          ${registro.descripcion}

        </div>

        <div class="info">

          <span>
            📍 ${registro.coordenadas}
          </span>

          <span>
            🕒 ${new Date(registro.fecha).toLocaleString()}
          </span>

        </div>

        ${registro.imagen ? `

          <a href="${registro.imagen}"
             target="_blank">

            <img
              src="${registro.imagen}"
              class="preview-img"
            >

          </a>

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

      return (

        coincideNombre &&
        coincideSector &&
        coincideEstado

      );

    });

  mostrar(filtrados);

}

// EVENTOS

buscador.addEventListener("input", filtrar);

filtroEstado.addEventListener("change", filtrar);

// FIREBASE REALTIME

const q = query(

  collection(db, "registros"),

  orderBy("fecha", "desc")

);

onSnapshot(q, (snapshot) => {

  registros = [];

  snapshot.forEach((doc) => {

    registros.push(doc.data());

  });

  filtrar();

});
