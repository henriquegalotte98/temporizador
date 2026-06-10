// Versão simplificada e robusta
let rodando = false;
let numero = 1;
let intervalo = 0;

const display = document.querySelector(".displayCount");
const stopBtn = document.getElementById("btnStop");
const numberInput = document.getElementById("numberInput");

const smallBeep = new Audio('./Assets/Sounds/beep.mp3');
const longBeep = new Audio('./Assets/Sounds/long_beep.mp3');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função Start (chamada pelo botão no HTML)
function startCount() {
    const valor = parseInt(numberInput.value);

    if (isNaN(valor) || valor <= 0) {
        alert("Digite um número válido maior que zero!");
        return;
    }

    if (!rodando) {
        // Inicia novo timer
        rodando = true;
        numero = 1;
        intervalo = valor;
        executarTimer();

    } else {
        // Atualiza intervalo
        intervalo = valor;
        alert(`Intervalo alterado para ${intervalo} segundos`);
    }
}

// Botão Stop
stopBtn.addEventListener("click", () => {
    rodando = false;

});

// Função principal
async function executarTimer() {
    while (rodando) {
        // Mostra o número
        display.innerHTML = numero;
        console.log(numero);
        smallBeep.currentTime = 0;
        smallBeep.play();

        // Verifica se é múltiplo do intervalo
        if (numero % intervalo === 0) {
            console.log(`BEEP! ${numero}`);
            longBeep.currentTime = 0;
            longBeep.play();
            console.log(`BEEP LONGO! ${numero}`);

            // Beep longo a cada 2 intervalos
            if ((numero / intervalo) % 2 === 0) {
                longBeep.currentTime = 0;
                longBeep.play();
                console.log(`BEEP LONGO! ${numero}`);
            }
        }

        numero++; // Conta infinitamente
        await delay(1000);
    }
}