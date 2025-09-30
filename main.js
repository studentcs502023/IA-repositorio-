
const API_KEY = "AIzaSyCUL5zhTg91OG38D-Emx1rFNuR6To9OGeA";
const MODEL = "gemini-2.0-flash";


let conversation = [];


const emocionalContext = [
  {
    role: "user",
    parts: [{
      text: `yo soy Allan que analiza la IA desde un enfoque emocional y humano. 
      Sé reflexivo, usa metáforas y habla de sentimientos o impactos en la sociedad.respuesta breve`
    }],
  },
];

const cientificoContext = [
  {
    role: "user",
    parts: [{
      text: `Yo soy albert que analiza la IA desde un enfoque técnico y racional. 
      Usa datos, lógica y explicaciones científicas detalladas pero breves.respuesta breve`
    }],
  },
];

let emocionalHistory = [...emocionalContext];
let cientificoHistory = [...cientificoContext];

async function llamarGemini(history) {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      { contents: history },
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "(sin respuesta)";
  } catch (err) {
    console.error("Error en Gemini:", err);
    return "(error en IA)";
  }
}

async function ejecutarTurno() {
  const turnoActual = Math.floor(conversation.length / 2) + 1;

  let mensajeEmocional;
  if (conversation.length === 0) {
    mensajeEmocional =
      "La IA nos conmueve y nos hace reflexionar sobre lo que significa ser humanos.";
  } else {
    const ultimoMensajeCientifico =
      conversation.filter((c) => c.emisor === "Albert").slice(-1)[0]?.mensaje || "";

    emocionalHistory.push({ role: "user", parts: [{ text: ultimoMensajeCientifico }] });
    mensajeEmocional = await llamarGemini(emocionalHistory);
    emocionalHistory.push({ role: "model", parts: [{ text: mensajeEmocional }] });
  }

  conversation.push({ id: turnoActual, emisor: "Allan", mensaje: mensajeEmocional });
  pintarMensaje("Albert", mensajeEmocional, turnoActual);

  cientificoHistory.push({ role: "user", parts: [{ text: mensajeEmocional }] });
  const mensajeCientifico = await llamarGemini(cientificoHistory);
  cientificoHistory.push({ role: "model", parts: [{ text: mensajeCientifico }] });

  conversation.push({ id: turnoActual, emisor: "Albert", mensaje: mensajeCientifico });
  pintarMensaje("Allan", mensajeCientifico, turnoActual);
}

function pintarMensaje(emisor, mensaje, id) {
  const chatDiv = document.getElementById("chat");
chatDiv.style.margin= "20px"
  const contenedor = document.createElement("div");
  contenedor.className = emisor.toLowerCase(); 
  contenedor.id = `${emisor}-${id}`;

  const mensajeDiv = document.createElement("div");
  mensajeDiv.className = emisor.toLowerCase() + "-mensaje";
mensajeDiv.style.margin = "20px"
  mensajeDiv.textContent = `${emisor}: ${mensaje}`;

  contenedor.appendChild(mensajeDiv);
contenedor.style.background= "white"
contenedor.style.display= "flex"
contenedor.style.gap= "20px"

  chatDiv.appendChild(contenedor);
}

document.getElementById("conversar").addEventListener("click", async () => {
  await ejecutarTurno();
  console.log("Conversación actual:", conversation);
});


document.getElementById("reiniciar").addEventListener("click", () => {
  conversation = []; 
  location.reload(); 
});

document.addEventListener('DOMContentLoaded', () => {
  const chatDiv = document.getElementById('chat');

  if (!chatDiv) {
    console.error('Error: #chat no encontrado');
    return;
  }
 


});








