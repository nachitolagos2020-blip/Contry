const estadoGPS = document.getElementById("estadoGPS");

const formulario = document.getElementById("formulario");

const mensaje = document.getElementById("mensaje");

let ubicacionActual = "No disponible";

navigator.geolocation.getCurrentPosition(

  (posicion) => {

    const lat = posicion.coords.latitude;
    const lng = posicion.coords.longitude;

    ubicacionActual =
      `https://maps.google.com/?q=${lat},${lng}`;

    estadoGPS.innerHTML =
      `📍 Latitud: ${lat.toFixed(5)}
   | Longitud: ${lng.toFixed(5)}`;

    estadoGPS.style.background = "#166534";

    formulario.classList.remove("hidden");

  },

  () => {

    estadoGPS.innerHTML =
      "❌ Debes activar la ubicación GPS";

    estadoGPS.style.background = "#991b1b";
  }

);

formulario.addEventListener("submit", (e) => {

  e.preventDefault();

  const nombre =
    document.getElementById("nombre").value;

  const estado =
    document.getElementById("estado").value;

  const descripcion =
    document.getElementById("descripcion").value;

  const foto =
    document.getElementById("foto").files[0];

  const reader = new FileReader();

  reader.onload = function(){

    const datos = {

      nombre,
      estado,
      descripcion,
      ubicacion: ubicacionActual,
      imagen: reader.result,
      fecha: new Date().toLocaleString()

    };

    const registros =
      JSON.parse(localStorage.getItem("registros")) || [];

    registros.unshift(datos);

    localStorage.setItem(
      "registros",
      JSON.stringify(registros)
    );

    mensaje.innerHTML =
      "✅ Parte enviado correctamente";

    mensaje.style.color = "#22c55e";

    formulario.reset();

  };

  if(foto){

    reader.readAsDataURL(foto);

  }

});