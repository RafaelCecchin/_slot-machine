const maxReconnectAttempts = 10;
const reconnectDelay = 250;
let reconnectAttempts = 0;

function connectWebSocket() {
    console.log("Tentando conectar ao WebSocket...");
    websocket = new WebSocket(`ws://localhost:8765`);

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
alert("Arquivo app.js carregado com sucesso!");