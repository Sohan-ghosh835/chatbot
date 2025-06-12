const chatbox = document.getElementById("chat-container");
const inputBox = document.getElementById("input-box");
const sendButton = document.getElementById("send-btn");

sendButton.addEventListener("click", async () => {
  const userMessage = inputBox.value.trim();
  if (!userMessage) return;

  addMessage("You", userMessage);
  inputBox.value = "";

  try {
    const response = await fetch("https://chatbot-backend-9zbr.onrender.com/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ message: userMessage })
});


    const data = await response.json();
    const botReply = data.response || data.reply || "Bot did not respond.";
    addMessage("Bot", botReply);
  } catch (error) {
    addMessage("Bot", "❌ Could not reach server.");
  }
});

inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendButton.click();
});

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
