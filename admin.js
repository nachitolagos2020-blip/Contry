import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* FIREBASE */
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
const auth = getAuth(app);

/* ELEMENTOS */
const contenedor = document.getElementById("contenedorRegistros");
const totalRegistros = document.getElementById("totalRegistros");
const buscador = document.getElementById("buscador");
const filtroEstado = document.getElementById("filtroEstado");
const filtroFecha = document.getElementById("filtroFecha");
const botonesSector = document.querySelectorAll(".sector-btn");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const fechaActual = document.getElementById("fechaActual");
const modoBtn = document.getElementById("modoBtn");
const exportarPDF = document.getElementById("exportarPDF");

/* STATE */
let registros = [];
let sectorActual = "Campo";

/* LOGIN REAL */
const email = prompt("Email admin");
const password = prompt("Contraseña");

signInWithEmailAndPassword(auth,email,password)
.catch(() => {
  document.body.innerHTML = "<h2 style='color:red;text-align:center'>Acceso denegado</h2>";
});

/* UI */
menuToggle.onclick = () => sidebar.classList.toggle("hidden");

modoBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
};

if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

/* FECHA */
setInterval(() => {
  const ahora = new Date();
  fechaActual.textContent =
    ahora.toLocaleDateString("es-AR") +
    " • " +
    ahora.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
},1000);

/* SANITIZE */
function limpiarHTML(t=""){
  return t
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

/* DELETE */
window.eliminarRegistro = async (id) => {
  try {
    await deleteDoc(doc(db,"registros",id));
  } catch (e) {
    alert("Error al eliminar");
  }
};

/* CAMBIAR ESTADO */
window.cambiarEstado = async (id,estado) => {
  const estados = ["Ok","Observacion","Urgente","EnProceso","Resuelto"];

  let i = estados.indexOf(estado);
  i = (i + 1) % estados.length;

  await updateDoc(doc(db,"registros",id),{
    estado: estados[i]
  });
};

/* RENDER */
function mostrar(lista){

  contenedor.innerHTML = "";
  totalRegistros.textContent = lista.length;

  let html = "";

  lista.forEach(r => {

    const imgs = r.imagenes || (r.imagen ? [r.imagen] : []);

    html += `
      <div class="registro-card">

        <h3>${limpiarHTML(r.nombre || "")}</h3>

        <div>${limpiarHTML(r.estado || "")}</div>

        <p>${limpiarHTML(r.descripcion || "")}</p>

        <div>
          ${imgs.map(img => `<img src="${img}" width="70"/>`).join("")}
        </div>

        <button class="btn-status"
          onclick="cambiarEstado('${r.id}','${r.estado}')">
          Cambiar estado
        </button>

        <button class="btn-delete"
          onclick="eliminarRegistro('${r.id}')">
          Eliminar
        </button>

      </div>
    `;
  });

  contenedor.innerHTML = html;
}

/* FILTRO */
function filtrar(){

  const texto = buscador.value.toLowerCase();

  let filtrados = registros.filter(r =>
    r.sector === sectorActual &&
    (filtroEstado.value === "Todos" || r.estado === filtroEstado.value) &&
    (r.nombre || "").toLowerCase().includes(texto)
  );

  const prioridad = {
    Urgente:0,
    EnProceso:1,
    Observacion:2,
    Ok:3,
    Resuelto:4
  };

  filtrados.sort((a,b) =>
    (prioridad[a.estado] ?? 99) -
    (prioridad[b.estado] ?? 99)
  );

  mostrar(filtrados);
}

/* EVENTS */
buscador.oninput = filtrar;
filtroEstado.onchange = filtrar;
filtroFecha.onchange = filtrar;

botonesSector.forEach(b => {
  b.onclick = () => {
    botonesSector.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    sectorActual = b.dataset.sector;
    filtrar();
  };
});

/* FIREBASE */
const q = query(collection(db,"registros"));

onSnapshot(q,(snap)=>{
  registros = [];
  snap.forEach(d => registros.push({id:d.id,...d.data()}));
  registros.reverse();
  filtrar();
});
