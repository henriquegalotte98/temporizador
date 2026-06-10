// Variáveis globais
let loopAtivo = false;
let numeroAtual = 1;
let tempoMaximo = 200; // Default 200 segundos
let timerPromise = null;

// Elementos DOM
const displayElement = document.getElementById("displayCount");
const currentConfigElement = document.getElementById("currentConfig");
const customTimeInput = document.getElementById("customTimeInput");

// Áudios - apenas o beep longo
const longBeep = new Audio('./Assets/Sounds/long_beep.mp3');

// Delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função para definir o tempo padrão (200)
function setDefaultTime() {
    tempoMaximo = 200;
    customTimeInput.value = 200;
    updateConfigDisplay();
    
    // Se o loop não estiver ativo, mostra uma prévia
    if (!loopAtivo) {
        displayElement.textContent = "0";
        numeroAtual = 1;
    }
    
    // Feedback visual
    showFeedback("✅ Tempo padrão de 200 segundos definido!", "success");
}

// Função para definir tempo personalizado
function setCustomTime() {
    let novoTempo = parseInt(customTimeInput.value);
    
    // Validação
    if (isNaN(novoTempo) || novoTempo < 1) {
        showFeedback("❌ Por favor, digite um número válido maior que 0!", "error");
        customTimeInput.value = tempoMaximo;
        return;
    }
    
    // Limite máximo de 999 segundos (opcional)
    if (novoTempo > 999) {
        showFeedback("⚠️ Limite máximo é 999 segundos!", "warning");
        novoTempo = 999;
        customTimeInput.value = 999;
    }
    
    tempoMaximo = novoTempo;
    updateConfigDisplay();
    
    // Se o loop não estiver ativo, reseta o contador
    if (!loopAtivo) {
        numeroAtual = 1;
        displayElement.textContent = "0";
    }
    
    showFeedback(`✅ Tempo personalizado: ${tempoMaximo} segundos!`, "success");
}

// Função para iniciar o loop
function startLoop() {
    if (loopAtivo) {
        showFeedback("⏸️ O timer já está rodando!", "info");
        return;
    }
    
    loopAtivo = true;
    executarLoop();
    showFeedback(`🎬 Loop iniciado! Contando de 1 a ${tempoMaximo}`, "success");
}

// Função para parar o loop
function stopLoop() {
    loopAtivo = false;
    showFeedback("⏹️ Loop parado!", "info");
}

// Função principal que executa o loop de 1 a tempoMaximo
async function executarLoop() {
    while (loopAtivo) {
        // Loop de 1 até tempoMaximo
        for (numeroAtual = 1; numeroAtual <= tempoMaximo; numeroAtual++) {
            // Verifica se foi solicitado parada
            if (!loopAtivo) {
                console.log("Loop interrompido pelo usuário");
                return;
            }
            
            // Atualiza o display
            displayElement.textContent = numeroAtual;
            console.log(`Contando: ${numeroAtual} / ${tempoMaximo}`);
            
            // SÓ toca beep quando chegar no final do ciclo
            if (numeroAtual === tempoMaximo) {
                // Beep longo para indicar que completou o ciclo
                if (longBeep) {
                    longBeep.currentTime = 0;
                    longBeep.play().catch(e => console.log("Áudio não disponível"));
                }
                console.log(`🔄 CICLO COMPLETO! Voltando ao 1...`);
            }
            
            // Aguarda 1 segundo
            await delay(1000);
        }
        
        // Quando chegar ao fim, reinicia automaticamente
        console.log(`🏁 Ciclo de ${tempoMaximo} segundos concluído! Reiniciando...`);
    }
}

// Função para resetar o timer manualmente (opcional)
function resetTimer() {
    if (!loopAtivo) {
        numeroAtual = 1;
        displayElement.textContent = "0";
        showFeedback("🔄 Timer resetado para 0", "info");
    } else {
        showFeedback("⚠️ Pare o timer antes de resetar!", "warning");
    }
}

// Atualiza o texto de configuração atual
function updateConfigDisplay() {
    currentConfigElement.innerHTML = `⚙️ Configuração atual: <strong>${tempoMaximo} segundos</strong> (loop de 1 a ${tempoMaximo})`;
}

// Feedback visual para o usuário
function showFeedback(message, type) {
    // Cria elemento temporário de feedback
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.style.position = "fixed";
    feedback.style.bottom = "20px";
    feedback.style.left = "50%";
    feedback.style.transform = "translateX(-50%)";
    feedback.style.padding = "10px 20px";
    feedback.style.borderRadius = "5px";
    feedback.style.zIndex = "1000";
    feedback.style.animation = "fadeInOut 2s ease-in-out";
    
    // Cores diferentes para cada tipo
    switch(type) {
        case "success":
            feedback.style.background = "#4CAF50";
            break;
        case "error":
            feedback.style.background = "#f44336";
            break;
        case "warning":
            feedback.style.background = "#ff9800";
            break;
        default:
            feedback.style.background = "#2196F3";
    }
    
    feedback.style.color = "white";
    feedback.style.fontWeight = "bold";
    feedback.style.textAlign = "center";
    
    document.body.appendChild(feedback);
    
    // Remove após 2 segundos
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Adiciona animação CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Inicialização
updateConfigDisplay();
customTimeInput.value = 200;
displayElement.textContent = "0";

// Opcional: Tecla Enter para aplicar tempo personalizado
customTimeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        setCustomTime();
    }
});