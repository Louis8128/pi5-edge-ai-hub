// 核心配置：指向树莓派的 IP
const OLLAMA_API_URL = "http://172.20.10.2:11434/api/generate";

// 配置 Markdown 解析器，开启 highlight.js 代码高亮支持
marked.setOptions({
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
    },
    breaks: true, // 允许 Markdown 中的自然回车换行
});

// 自动调整输入框高度
const inputField = document.getElementById("userInput");
inputField.addEventListener("input", function () {
    this.style.height = "24px"; // 先重置，以便缩小
    this.style.height = this.scrollHeight - 28 + "px"; // 减去 padding 动态撑开
});

async function sendMessage() {
    const chatBox = document.getElementById("chatBox");
    const sendBtn = document.getElementById("sendBtn");
    const text = inputField.value.trim();

    if (!text) return;

    // 显示用户消息 (纯文本防注入)
    appendMessage(text, "user-msg", false);

    // 重置输入框状态
    inputField.value = "";
    inputField.style.height = "24px";
    sendBtn.disabled = true;
    sendBtn.innerHTML = "思考中... ⏳";

    // 创建一个准备接收 AI 结果的气泡
    const aiBubbleContent = appendMessage("思考中...", "ai-msg", false);

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

        // 核心魔法：使用 marked.parse 将 Markdown 文本渲染为带高亮的 HTML
        aiBubbleContent.innerHTML = marked.parse(data.response);
    } catch (error) {
        aiBubbleContent.innerHTML =
            "<p style='color: red;'>⚠️ 连接树莓派失败，请检查 172.20.10.2 服务是否正常运行。</p>";
        console.error(error);
    } finally {
        sendBtn.disabled = false;
        // 恢复发送按钮的图标
        sendBtn.innerHTML = `发送 <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="margin-left: 5px; vertical-align: middle;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// 辅助函数：将消息添加到聊天界面
// isMarkdown 参数决定是否渲染 HTML（用户消息防XSS，AI消息需渲染）
function appendMessage(text, className, isMarkdown = false) {
    const chatBox = document.getElementById("chatBox");

    const msgWrapper = document.createElement("div");
    msgWrapper.className = `message ${className}`;

    const msgContent = document.createElement("div");
    msgContent.className = "msg-content";

    if (isMarkdown) {
        msgContent.innerHTML = marked.parse(text);
    } else {
        msgContent.innerText = text;
    }

    msgWrapper.appendChild(msgContent);
    chatBox.appendChild(msgWrapper);

    // 平滑滚动到底部
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
    });

    return msgContent; // 返回元素实例，方便后续修改内容
}

// 支持回车发送，Shift+回车换行
function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // 阻止默认的回车换行行为
        sendMessage();
    }
}
