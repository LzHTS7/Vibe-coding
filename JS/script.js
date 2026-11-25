// Constantes e Regras de Negócio (Configuração isolada)
const TITLES = [
    { max: 4, label: "Dedetizador de Formigas 🐜" },
    { max: 7, label: "Guerreiro de Ferro 🛡️" },
    { max: 10, label: "Titã Indomável ⚡" },
    { max: Infinity, label: "Deus do Olimpo 👑" }
];

const ATTRIBUTES = [
    "Velocidade da Luz 💨", 
    "Resistência de Titânio 🧱", 
    "Carisma Magnético ✨", 
    "Inteligência Genial 🧠", 
    "Sorte Extrema 🍀"
];

// Funções Auxiliares (Lógica pura)
const sanitizeName = (name) => name.trim().replace(/\s+/g, '');

const getTitleByLength = (length) => {
    return TITLES.find(t => length <= t.max)?.label || "Lendário 🌟";
};

const getRandomAttribute = () => {
    return ATTRIBUTES[Math.floor(Math.random() * ATTRIBUTES.length)];
};

// Gerenciamento de UI
class AppController {
    constructor() {
        this.initEvents();
    }

    initEvents() {
        // Expondo métodos globalmente para manipulação simples via HTML inline se necessário,
        // mas mantendo estrutura limpa modular.
        window.app = this;
    }

    switchTab(mode) {
        const singleTab = document.querySelector('[data-tab="single"]');
        const compareTab = document.querySelector('[data-tab="compare"]');
        const singleDiv = document.getElementById('single-mode');
        const compareDiv = document.getElementById('compare-mode');
        
        this.hideResultCard();

        if (mode === 'single') {
            singleTab.classList.add('active');
            singleTab.setAttribute('aria-selected', 'true');
            compareTab.classList.remove('active');
            compareTab.setAttribute('aria-selected', 'false');
            
            singleDiv.classList.remove('hidden');
            compareDiv.classList.add('hidden');
        } else {
            compareTab.classList.add('active');
            compareTab.setAttribute('aria-selected', 'true');
            singleTab.classList.remove('active');
            singleTab.setAttribute('aria-selected', 'false');
            
            compareDiv.classList.remove('hidden');
            singleDiv.classList.add('hidden');
        }
    }

    showLoading(callback) {
        const loading = document.getElementById('loading');
        this.hideResultCard();
        loading.classList.remove('hidden');

        setTimeout(callback, 1200);
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showResultCard(htmlContent) {
        const card = document.getElementById('result-card');
        document.getElementById('result-content').innerHTML = htmlContent;
        card.classList.remove('hidden');
    }

    hideResultCard() {
        document.getElementById('result-card').classList.add('hidden');
    }

    handleSingleCalculation() {
        const input = document.getElementById('name-input');
        const name = input.value;
        const clean = sanitizeName(name);

        if (!clean) {
            alert('Por favor, digite um nome válido!');
            return;
        }

        this.showLoading(() => {
            const length = clean.length;
            const powerLevel = Math.min(100, length * 7 + Math.floor(Math.random() * 15));
            const weight = length * 42;
            const title = getTitleByLength(length);
            const attribute = getRandomAttribute();

            const html = `
                <div class="result-item"><strong>Nome:</strong> ${name} (${length} letras)</div>
                <div class="result-item"><strong>Título:</strong> ${title}</div>
                <div class="result-item"><strong>Nível de Força:</strong> ${powerLevel}/100</div>
                <div class="result-item"><strong>Peso Máximo Levantado:</strong> ${weight} kg</div>
                <div class="result-item"><strong>Atributo Especial:</strong> ${attribute}</div>
            `;

            this.hideLoading();
            this.showResultCard(html);
        });
    }

    handleCompareCalculation() {
        const name1Input = document.getElementById('name1-input').value;
        const name2Input = document.getElementById('name2-input').value;
        const clean1 = sanitizeName(name1Input);
        const clean2 = sanitizeName(name2Input);

        if (!clean1 || !clean2) {
            alert('Por favor, preencha ambos os nomes!');
            return;
        }

        this.showLoading(() => {
            const len1 = clean1.length;
            const len2 = clean2.length;
            let winnerText = "";

            if (len1 > len2) {
                winnerText = `🏆 <strong>${name1Input}</strong> é mais forte (tem mais letras)!`;
            } else if (len2 > len1) {
                winnerText = `🏆 <strong>${name2Input}</strong> é mais forte (tem mais letras)!`;
            } else {
                winnerText = `🤝 Empate total! Ambos têm exatamente a mesma força!`;
            }

            const html = `
                <div class="result-item"><strong>${name1Input}:</strong> ${len1} letras</div>
                <div class="result-item"><strong>${name2Input}:</strong> ${len2} letras</div>
                <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 12px 0;">
                <div class="result-item" style="font-size: 1.1rem; text-align: center;">${winnerText}</div>
            `;

            this.hideLoading();
            this.showResultCard(html);
        });
    }
}

// Inicialização da aplicação
new AppController();