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

const password = prompt("Contraseña");

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

  apiKey: "TU_API",
  authDomain: "TU_DOMAIN",
  projectId: "TU_PROJECT"

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

const fechaActual =
document.getElementById("fechaActual");

const menuToggle =
document.getElementById("menuToggle");

const sidebar =
document.getElementById("sidebar");

const adminMain =
document.getElementById("adminMain");

const themeToggle =
document.getElementById("themeToggle");

let registros = [];

let sectorActual = "Campo";

// MENU

menuToggle.addEventListener("click",()=>{

  sidebar.classList.toggle("hidden");

});

// TEMA

themeToggle.addEventListener("change",()=>{

  document.body.classList.toggle("dark");

});

// HORA

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

// SECTORES

botonesSector.forEach((boton)=>{

  boton.addEventListener("click",()=>{

    botonesSector.forEach((b)=>{

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

  lista.forEach((registro,index)=>{

    let colorEstado = "#22c55e";

    if(registro.estado === "Urgente"){
      colorEstado = "#ef4444";
    }

    if(registro.estado === "En Proceso"){
      colorEstado = "#9333ea";
    }

    if(registro.estado === "Resuelto"){
      colorEstado = "#22c55e";
    }

    contenedor.innerHTML += `

      <div class="registro-card">

        <input
          type="checkbox"
          class="checkbox-select"
        >

        <div class="registro-header">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <div class="sector-mini">
              ${registro.sector}
            </div>

          </div>

          <div
            class="estado"
            style="background:${colorEstado}"
          >

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
            🕒 ${registro.fecha}
          </span>

        </div>

        ${registro.imagen ? `

          <img
            src="${registro.imagen}"
            class="preview-img"
          >

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

  const filtrados = registros.filter((r)=>{

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

buscador.addEventListener("input",filtrar);

filtroEstado.addEventListener("change",filtrar);

filtroFecha.addEventListener("change",filtrar);

// FECHAS

function generarFechas(){

  const hoy = new Date();

  const fin = new Date("2026-12-31");

  while(hoy <= fin){

    const fecha =

    hoy.toISOString().split("T")[0];

    filtroFecha.innerHTML += `

      <option value="${fecha}">
        ${fecha}
      </option>

    `;

    hoy.setDate(
      hoy.getDate() + 1
    );

  }

}

generarFechas();

// FIREBASE

const q = query(
  collection(db,"registros")
);

onSnapshot(q,(snapshot)=>{

  registros = [];

  snapshot.forEach((doc)=>{

    registros.push(doc.data());

  });

  registros.reverse();

  filtrar();

});
