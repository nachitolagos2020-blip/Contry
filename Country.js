const estadoGPS = document.getElementById("estadoGPS");

const formulario = document.getElementById("formulario");

const mensaje = document.getElementById("mensaje");

// CAMBIAR SEGÚN EL HTML

const sector = "Campo";

// GPS

let latitud = "";
let longitud = "";

navigator.geolocation.getCurrentPosition(

  (posicion) => {

    latitud =
      posicion.coords.latitude;

    longitud =
      posicion.coords.longitude;

    estadoGPS.innerHTML =

      `📍 ${latitud.toFixed(5)}, ${longitud.toFixed(5)}`;

    formulario.classList.remove("hidden");

  },

  () => {

    estadoGPS.innerHTML =
      "❌ Debes activar la ubicación GPS";

  }

);

// ENVIAR

formulario.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nombre =
    document.getElementById("nombre").value;

  const estado =
    document.getElementById("estado").value;

  const descripcion =
    document.getElementById("descripcion").value;

  const foto =
    document.getElementById("foto").files[0];

  let imagenURL = "";

  // SUBIR FOTO

  if (foto) {

    const data = new FormData();

    data.append("file", foto);

    data.append(
      "upload_preset",
      "country_upload"
    );

    const respuesta = await fetch(

      "https://api.cloudinary.com/v1_1/dddhyrkd8/image/upload",

      {

        method: "POST",

        body: data

      }

    );

    const resultado =
      await respuesta.json();

    imagenURL =
      resultado.secure_url;

  }

  // GUARDAR EN FIREBASE

  await addDoc(

    collection(db, "registros"),

    {

      nombre,
      estado,
      descripcion,

      sector,

      coordenadas:
        latitud + "," + longitud,

      imagen:
        imagenURL,

      fecha:
        new Date().toLocaleString()

    }

  );

  // PANTALLA FINAL

  document.querySelector(".container").innerHTML = `

    <div class="success-screen">

      <div class="success-icon">
        ✅
      </div>

      <h2>
        Muchas Gracias
      </h2>

      <p>
        El parte fue enviado correctamente.
      </p>

    </div>

  `;

});
