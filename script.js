const chatbox = document.getElementById("chatbox");
const userInputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", () => {
  const userInput = userInputField.value.trim();
  if (userInput === "") return;

  chatbox.innerHTML += `<div class="user-msg">${userInput}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
  userInputField.value = "";

  fetch("https://chatbot-backend-9zbr.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: userInput })
  })
  .then(response => response.json())
  .then(data => {
    if (data.response) {
      chatbox.innerHTML += `<div class="bot-msg">${data.response}</div>`;
    } else {
      chatbox.innerHTML += `<div class="bot-msg error">Bot replied: undefined 🤖</div>`;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
  })
  .catch(error => {
    chatbox.innerHTML += `<div class="bot-msg error">Something went wrong 🛠️</div>`;
  });
});

userInputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
