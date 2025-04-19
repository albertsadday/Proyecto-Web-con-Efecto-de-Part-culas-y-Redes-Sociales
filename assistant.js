class AIAssistant {
    constructor() {
        this.assistant = document.getElementById('ai-assistant');
        this.openBtn = document.getElementById('ai-assistant-btn');
        this.closeBtn = document.getElementById('close-ai');
        this.conversation = document.querySelector('.ai-conversation');
        this.input = document.getElementById('ai-message');
        this.sendBtn = document.getElementById('send-ai');
        
        this.initEvents();
        this.loadGreeting();
    }
    
    initEvents() {
        this.openBtn.addEventListener('click', () => this.toggleAssistant());
        this.closeBtn.addEventListener('click', () => this.toggleAssistant());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggleAssistant() {
        this.assistant.classList.toggle('active');
    }
    
    loadGreeting() {
        const greetings = [
            "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
            "Hola 👋, dime qué necesitas saber sobre este sitio.",
            "¡Bienvenido! Estoy aquí para ayudarte con cualquier pregunta."
        ];
        
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.addMessage(greeting, 'bot');
    }
    
    addMessage(text, sender) {
        const message = document.createElement('div');
        message.classList.add('ai-message', sender);
        message.textContent = text;
        this.conversation.appendChild(message);
        this.conversation.scrollTop = this.conversation.scrollHeight;
    }
    
    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.input.value = '';
        
        // Simular respuesta de IA (en un caso real, aquí harías una llamada a una API)
        setTimeout(() => {
            this.generateResponse(message);
        }, 1000);
    }
    
    generateResponse(message) {
        const responses = {
            'hola': ['¡Hola de nuevo!', 'Hola 😊, ¿qué más necesitas?'],
            'quién eres': 'Soy un asistente de inteligencia artificial integrado en este sitio web para ayudarte.',
            'qué puedes hacer': 'Puedo responder preguntas sobre este sitio, sus características y cómo funciona el efecto de partículas.',
            'partículas': 'El efecto de partículas es una animación interactiva creada con JavaScript. Las partículas siguen tu cursor y tienen un comportamiento dinámico.',
            'redes sociales': 'En la sección de redes sociales puedes encontrar los enlaces para contactarme en diferentes plataformas.',
            'contacto': 'Puedes contactarme a través de las redes sociales o enviando un mensaje directo desde este sitio.'
        };
        
        let response = 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?';
        
        for (const [key, value] of Object.entries(responses)) {
            if (message.toLowerCase().includes(key)) {
                if (Array.isArray(value)) {
                    response = value[Math.floor(Math.random() * value.length)];
                } else {
                    response = value;
                }
                break;
            }
        }
        
        this.addMessage(response, 'bot');
    }
}

// Inicializar el asistente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});
