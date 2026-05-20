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

// LOGIN SIMPLE

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

// VARIABLES

let sectorActual = "Campo";

let todosLosRegistros = [];

// BOTONES SECTOR

botonesSector.forEach((boton) => {

  boton.addEventListener("click", () => {

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

  lista.forEach((registro) => {

    let claseEstado = "ok";

    if(registro.estado === "Observacion"){
      claseEstado = "observacion";
    }

    if(registro.estado === "Urgente"){
      claseEstado = "urgente";
    }

    contenedor.innerHTML += `

      <div class="registro-card">

        <div class="registro-top">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <div class="sector-mini">
              ${registro.sector}
            </div>

          </div>

          <span class="estado ${claseEstado}">
            ${registro.estado}
          </span>

        </div>

        <div class="registro-desc">

          ${registro.descripcion}

        </div>

        <div class="registro-info">

          <span>
            📍 ${registro.coordenadas}
          </span>

          <span>
            🕒 ${registro.fecha}
          </span>

        </div>

        ${registro.imagen ? `

          <img
            src="${registro.imagen}"
            class="registro-img"
            onclick="window.open('${registro.imagen}')"
          >

        ` : ""}

      </div>

    `;

  });

}

// FILTRAR

function filtrarRegistros(){

  const valor =
    buscador.value.toLowerCase();

  const filtrados =
    todosLosRegistros.filter((r) =>

      r.sector === sectorActual &&

      r.nombre.toLowerCase()
      .includes(valor)

    );

  mostrarRegistros(filtrados);

}

// BUSCADOR

buscador.addEventListener("input", () => {

  filtrarRegistros();

});

// FIREBASE REALTIME

const q = query(

  collection(db, "registros"),

  orderBy("fecha", "desc")

);

onSnapshot(q, (snapshot) => {

  todosLosRegistros = [];

  snapshot.forEach((doc) => {

    todosLosRegistros.push(doc.data());

  });

  filtrarRegistros();

});
