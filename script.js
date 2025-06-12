const inputBox = document.getElementById("input-box");
const sendBtn = document.getElementById("send-btn");
const chatContainer = document.getElementById("chat-container");

sendBtn.addEventListener("click", async () => {
  const message = inputBox.value.trim();
  if (!message) return;

  appendMessage("You", message);
  inputBox.value = "";

  const response = await fetch("https://chatbot-backend-9zbr.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  appendMessage("Bot", data.response);
  speak(data.response); // Add this line

});

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message";
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = false;

document.addEventListener("keydown", e => {
  if (e.key === "v") {
    recognition.start();
  }
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  inputBox.value = transcript;
  sendBtn.click();
};

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}
