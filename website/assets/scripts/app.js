// Slot Machine
const spinButton = document.querySelector('#spin-button');
const reels = document.querySelectorAll('.reel');
const reel1 = document.querySelector('#reel-1');
const reel2 = document.querySelector('#reel-2');
const reel3 = document.querySelector('#reel-3');
const user = document.querySelector('#user');

const slotImages = [
    'assets/images/slots/slot1.png',
    'assets/images/slots/slot2.png',
    'assets/images/slots/slot3.png',
    'assets/images/slots/slot4.png',
    'assets/images/slots/slot5.png',
    'assets/images/slots/slot6.png'
];

reels.forEach(reel => {
    slotImages.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Slot image';
        reel.appendChild(img);
    });
});

const casino1 = new SlotMachine(reel1, {
    active: 0,
    delay: 500,
    direction: 'up'
});
const casino2 = new SlotMachine(reel2, {
    active: 1,
    delay: 500,
});
const casino3 = new SlotMachine(reel3, {
    active: 2,
    delay: 500,
    direction: 'up'
});

spinButton.addEventListener('click', () => {
    casino1.shuffle(5);
    casino2.shuffle(5);
    casino3.shuffle(5);
});

// WebSocket
const maxReconnectAttempts = 10;
const reconnectDelay = 250;
let reconnectAttempts = 0;

function connectWebSocket() {
    console.log("Tentando conectar ao WebSocket...");
    websocket = new WebSocket(`ws://${window.location.hostname}:8765`);

    websocket.onopen = function () {
        console.log("Conexão WebSocket estabelecida");
        reconnectAttempts = 0;
    };

    websocket.onmessage = function (event) {
        console.log("Mensagem recebida do WebSocket:", event.data);
        addToQueue(event.data);
        spinButton.click();
    };

    websocket.onclose = function () {
        console.warn("Conexão WebSocket encerrada");
        attemptReconnect();
    };

    websocket.onerror = function (error) {
        console.error("Erro no WebSocket:", error);
        websocket.close();
    };
}

function attemptReconnect() {
    if (reconnectAttempts < maxReconnectAttempts) {
        const delay = reconnectDelay * Math.pow(2, reconnectAttempts);
        console.log(`Tentando reconectar em ${delay / 1000} segundos...`);
        setTimeout(() => {
            reconnectAttempts++;
            connectWebSocket();
        }, delay);
    } else {
        console.error("Número máximo de tentativas de reconexão atingido.");
    }
}

function getLocalStorage(type) {
    return JSON.parse(localStorage.getItem(type));
}

function setLocalStorage(type, data) {
    localStorage.setItem(type, JSON.stringify(data));
}

function addToQueue(message) {
    data = JSON.parse(message);
    type = data.type;

    queue = getLocalStorage(type) || [];
    queue.push(data);
    setLocalStorage(type, queue);
}

function getFromQueue(type) {
    queue = getLocalStorage(type) || [];

    if (queue.length === 0) return null;

    const item = queue.shift();
    setLocalStorage(type, queue);
    return item;
}

connectWebSocket();
