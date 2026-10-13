const URL_API = "http://www.raydelto.org/agenda.php";

const formulario = document.getElementById("formContacto");
const listaContactos = document.getElementById("listaContactos");
const mensaje = document.getElementById("mensaje");

// Consultar los contactos usando get
async function cargarContactos() {
    try{
        const respuesta = await fetch(URL_API, {
            method: "GET"
        });

        if(!respuesta.ok){
            throw new Error("No se pudieron consultar los contactos.");
        }
        const contactos = await respuesta.json();

        mostrarContactos(contactos);
    } catch(error){
        listaContactos.replaceChildren();

        const fila = document.createElement("tr")
        const celda = document.createElement("td")

        celda.colSpan = 3;
        celda.textContent = "Error al cargar contactos."

        fila.appendChild(celda);
        listaContactos.appendChild(fila);

        console.error(error);
    }
}

//Mostrar los contactos en la tabla
function mostrarContactos(contactos){
    listaContactos.replaceChildren();

    if(!Array.isArray(contactos) || contactos.length === 0){
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 3;
        celda.textContent = "No hay contactos.";

        fila.appendChild(celda);
        listaContactos.appendChild(fila);
        return;
    }

    contactos.forEach(function(contacto){
        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        const celdaApellido = document.createElement("td");
        const celdaTelefono = document.createElement("td");

        celdaNombre.textContent = contacto.nombre ?? "";
        celdaApellido.textContent = contacto.apellido ?? "";
        celdaTelefono.textContent = contacto.telefono ?? "";

        fila.append(celdaNombre, celdaApellido, celdaTelefono);
        listaContactos.appendChild(fila);
    });
}

//Agregar contactos usando post 
formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    console.log("El formulario se esta ejecutando");

    const contacto = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        telefono: document.getElementById("telefono").value.trim()
    };

    if(!contacto.nombre || !contacto.apellido || !contacto.telefono){
        mensaje.textContent = "Completa todos los campos.";
        return;
    }

    try{
        mensaje.textContent = "Guardando..."
        
        const respuesta = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(contacto)
        });

        if(!respuesta.ok){
            throw new Error("No se pudo guardar ese contacto.");
        }

        mensaje.textContent = "Contacto enviado correctamente.";
        formulario.reset();

        //volver a consultar la lista actualizada
        await cargarContactos();
    } catch(error){
        mensaje.textContent = "No se pudo guardar. Revisa la conexion con el servidor.";

        console.error(error);
    }
});


//Cargar la agenda al abrir la pagina
cargarContactos();