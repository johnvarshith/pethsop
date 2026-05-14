(function() {
    // Inject Premium CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        #ai-widget-container {
            font-family: 'Inter', sans-serif;
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        #ai-chat-window {
            width: 380px;
            height: 600px;
            max-height: 80vh;
            background: rgba(30, 41, 59, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin-bottom: 20px;
            transform: scale(0.95) translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        #ai-chat-window.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: auto;
        }

        .ai-chat-header {
            padding: 20px 24px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(78, 205, 196, 0.4));
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .ai-chat-title {
            color: #ffffff;
            font-weight: 600;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ai-chat-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .ai-chat-close:hover {
            background: rgba(255, 255, 255, 0.25);
        }

        .ai-chat-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        /* Custom Scrollbar */
        .ai-chat-body::-webkit-scrollbar {
            width: 6px;
        }
        .ai-chat-body::-webkit-scrollbar-track {
            background: transparent;
        }
        .ai-chat-body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
        }

        .ai-message {
            max-width: 85%;
            padding: 12px 18px;
            border-radius: 18px;
            color: #fff;
            font-size: 0.95rem;
            line-height: 1.4;
            animation: aiMessageFadeIn 0.3s ease forwards;
            opacity: 0;
            transform: translateY(10px);
        }
        
        @keyframes aiMessageFadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .ai-message.bot {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.1);
            border-bottom-left-radius: 4px;
        }

        .ai-message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #8B5CF6, #6D28D9);
            border-bottom-right-radius: 4px;
        }

        .ai-chat-footer {
            padding: 16px 20px;
            background: rgba(15, 23, 42, 0.5);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 12px;
        }

        .ai-chat-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 12px 16px;
            border-radius: 12px;
            outline: none;
            font-family: inherit;
            transition: all 0.2s;
        }
        .ai-chat-input:focus {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(139, 92, 246, 0.5);
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        .ai-chat-input::placeholder {
            color: rgba(255,255,255,0.4);
        }

        .ai-send-btn {
            background: #8B5CF6;
            color: white;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .ai-send-btn:hover {
            background: #7C3AED;
            transform: translateY(-2px);
        }

        /* Floating Button */
        #ai-fab {
            width: 64px;
            height: 64px;
            border-radius: 32px;
            background: linear-gradient(135deg, #8B5CF6, #4ECDC4);
            border: none;
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #ai-fab:hover {
            transform: scale(1.1) rotate(5deg);
        }
        #ai-fab svg {
            width: 32px;
            height: 32px;
            fill: #fff;
        }
        
        .ai-typing-indicator {
            display: flex;
            gap: 4px;
            padding: 4px 8px;
        }
        .ai-dot {
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            animation: aiBounce 1.4s infinite ease-in-out both;
        }
        .ai-dot:nth-child(1) { animation-delay: -0.32s; }
        .ai-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes aiBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Create Container
    const container = document.createElement('div');
    container.id = 'ai-widget-container';

    // Create Chat Window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'ai-chat-window';
    chatWindow.innerHTML = `
        <div class="ai-chat-header">
            <div class="ai-chat-title">
                <svg width="24" height="24" viewBox="0 0 1024 1024" fill="#ffffff">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5z"/>
                </svg>
                PawPal AI Assistant
            </div>
            <button class="ai-chat-close" id="ai-chat-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        <div class="ai-chat-body" id="ai-chat-body">
            <div class="ai-message bot">
                Hi there! 👋 I'm PawPal's AI assistant. How can I help you and your furry friends today?
            </div>
        </div>
        <form class="ai-chat-footer" id="ai-chat-form">
            <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Type your message..." autocomplete="off">
            <button type="submit" class="ai-send-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
        </form>
    `;

    // Create FAB
    const fab = document.createElement('button');
    fab.id = 'ai-fab';
    fab.innerHTML = `
        <svg viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5z"/>
        </svg>
    `;

    container.appendChild(chatWindow);
    container.appendChild(fab);
    document.body.appendChild(container);

    // Functionality
    const chatBody = document.getElementById('ai-chat-body');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const closeBtn = document.getElementById('ai-chat-close');

    let isTyping = false;

    function toggleChat() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            setTimeout(() => chatInput.focus(), 300);
        }
    }

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = \`ai-message \${sender}\`;
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'ai-message bot ai-typing-indicator-wrapper';
        div.id = 'ai-typing';
        div.innerHTML = \`
            <div class="ai-typing-indicator">
                <div class="ai-dot"></div>
                <div class="ai-dot"></div>
                <div class="ai-dot"></div>
            </div>
        \`;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById('ai-typing');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: 'smooth'
        });
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text || isTyping) return;

        addMessage(text, 'user');
        chatInput.value = '';
        isTyping = true;
        showTyping();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            hideTyping();
            
            if (response.ok && data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage("I'm sorry, I'm having a little trouble connecting to my brain right now. Please try again later!", 'bot');
            }
        } catch (error) {
            hideTyping();
            addMessage("Oops! My network connection is acting up. Could you try that again?", 'bot');
        } finally {
            isTyping = false;
        }
    });
})();
