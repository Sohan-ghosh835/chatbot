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
    const botReply = data.response || data.reply || "Scoop did not respond.";
    renderBotResponse(botReply);
  } catch (error) {
    addMessage("Scoop", "❌ Could not reach server.");
  }
});

inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendButton.click();
});

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message");

  if (isBulletList(text)) {
    const bulletHTML = formatBullets(text);
    msg.innerHTML = `<strong>${sender}:</strong><ul>${bulletHTML}</ul>`;
  } else {
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  }

  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function isBulletList(text) {
  return /^(\s*[-*•]\s+)/m.test(text);
}

function formatBullets(text) {
  return text
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      if (/^\s*[-*•]\s+/.test(line)) {
        return `<li>${line.replace(/^[-*•]\s+/, '')}</li>`;
      } else {
        return `<p>${line}</p>`;
      }
    })
    .join('');
}

function renderBotResponse(text) {
  const codeRegex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    const beforeCode = text.slice(lastIndex, match.index).trim();
    if (beforeCode) addMessage("Scoop", beforeCode);

    const codeContent = match[1].trim();
    if (codeContent) addCodeBubble(codeContent); // Only add if code is not empty
    lastIndex = codeRegex.lastIndex;
  }

  const remaining = text.slice(lastIndex).trim();
  if (remaining) addMessage("Scoop", remaining);
}

function addCodeBubble(code) {
  const msg = document.createElement("div");
  msg.classList.add("message");

  const encodedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  msg.innerHTML = `
    <div class="code-block">
      <pre><code>${encodedCode}</code></pre>
      <button class="copy-btn">📋Copy</button>
    </div>
  `;

  const button = msg.querySelector(".copy-btn");
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Code copied to clipboard!");
    });
  });

  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function copyToClipboard(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert("Code copied to clipboard!");
  });
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
