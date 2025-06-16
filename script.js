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
    if (codeContent) addCodeBubble(codeContent); 
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

const cornerVideo = document.getElementById('corner-video');
const cornerVideo2 = document.getElementById('corner-video2');
const revealBtn = document.getElementById('reveal-btn');
const heartBtn = document.getElementById('heart-btn');

revealBtn.addEventListener('click', () => {
  revealBtn.style.opacity = '0';
  revealBtn.style.pointerEvents = 'none';
  cornerVideo.style.display = 'block';
  cornerVideo.classList.remove('slide-in');
  void cornerVideo.offsetWidth;
  cornerVideo.classList.add('slide-in');
  cornerVideo.currentTime = 0;
  cornerVideo.play();
});



cornerVideo.addEventListener('ended', () => {
  cornerVideo.pause();
  cornerVideo.currentTime = cornerVideo.duration - 0.01;
});

const FRAME_THRESHOLD = 110 / 30;
let heartShown = false;

cornerVideo.addEventListener('timeupdate', () => {
  if (!heartShown && cornerVideo.currentTime >= FRAME_THRESHOLD) {
    heartBtn.style.display = 'block';
    heartShown = true;
  }
});

function handleHeartAction() {
  cornerVideo.pause();
  cornerVideo.style.display = 'none';
  cornerVideo2.style.display = 'block';
  cornerVideo2.currentTime = 0;
  cornerVideo2.play();
  heartBtn.style.display = 'none';

  const handleSlideOut = () => {
    if (cornerVideo2.duration - cornerVideo2.currentTime <= 2 && !cornerVideo2.classList.contains('slide-out-left')) {
      cornerVideo2.classList.add('slide-out-left');
      cornerVideo2.removeEventListener('timeupdate', handleSlideOut);
    }
  };

  cornerVideo2.addEventListener('timeupdate', handleSlideOut);
}

heartBtn.addEventListener('click', handleHeartAction);
heartBtn.addEventListener('touchstart', handleHeartAction);

cornerVideo2.addEventListener('ended', () => {
  cornerVideo2.style.display = 'none';
  cornerVideo2.classList.remove('slide-out-left');
  heartShown = false;
  revealBtn.style.display = 'block';
  revealBtn.style.opacity = '1';
  revealBtn.style.pointerEvents = 'auto';
});






