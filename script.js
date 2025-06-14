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

  if (sender === "Scoop") {
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      const encodedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `
        <div class="code-block">
          <pre><code>${encodedCode}</code></pre>
          <button class="copy-btn" onclick="copyToClipboard(\`${code.replace(/`/g, "\\`")}\`)">📋Copy</button>
        </div>`;
    });
  }

  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}


const chatContainer = document.getElementById("chat-container");

function adjustPadding() {
  const isScrollVisible = chatContainer.scrollHeight > chatContainer.clientHeight;
  chatContainer.style.paddingRight = isScrollVisible ? "5px" : "15px";
}

window.addEventListener("load", adjustPadding);
window.addEventListener("resize", adjustPadding);

const observer = new MutationObserver(adjustPadding);
observer.observe(chatContainer, { childList: true, subtree: true });

const hamburger = document.getElementById("hamburger");
const sidePanel = document.getElementById("side-panel");

hamburger.addEventListener("click", () => {
  sidePanel.classList.toggle("active");
});

function copyToClipboard(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert("Code copied to clipboard!");
  });
}
