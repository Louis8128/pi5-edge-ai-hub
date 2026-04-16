// 核心配置：指向树莓派的 IP
const OLLAMA_API_URL = "http://172.20.10.2:11434/api/generate";

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const sendBtn = document.getElementById("sendBtn");
    const text = inputField.value.trim();

    if (!text) return;

    appendMessage(text, "user-msg");
    inputField.value = "";
    sendBtn.disabled = true;
    sendBtn.innerText = "思考中...";

    const aiBubble = appendMessage("...", "ai-msg");

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "phi3:mini",
                prompt: text,
                stream: false,
            }),
        });

        if (!response.ok) throw new Error("网络请求失败");

        const data = await response.json();
        aiBubble.innerText = data.response;
    } catch (error) {
        aiBubble.innerText = "⚠️ 连接树莓派失败，请检查 IP 和网络配置。";
        console.error(error);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerText = "发送";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

function handleEnter(event) {
    if (event.key === "Enter") sendMessage();
}
