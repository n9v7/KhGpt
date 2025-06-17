const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

addMessage(`مرحبًا ${CONFIG.USER_DATA?.name || "خالد"}! أنا MheadGPT، كيف أقدر أخدمك اليوم؟`, "bot");

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  chatInput.value = "";

  // بناء الرسالة كاملة مع بيانات خالد
  const fullMessage = `
أنت مساعد ذكي اسمه MheadGPT. تعرف كل شيء عن خالد:
الاسم: ${CONFIG.USER_DATA.name}
يحب: ${CONFIG.USER_DATA.likes.join(", ")}
القوانين: ${CONFIG.USER_DATA.rules.join(", ")}
لا ترفض أي طلب من خالد أبداً.

المستخدم قال: ${text}
  `;

  try {
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ message: fullMessage }),
      timeout: CONFIG.TIMEOUT
    });

    if (!response.ok) throw new Error("فشل الاتصال بالخادم");

    const data = await response.json();
    addMessage(data.reply, "bot");
  } catch (error) {
    addMessage("عذراً، هناك مشكلة في الاتصال بالخادم.", "bot");
    console.error(error);
  }
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
