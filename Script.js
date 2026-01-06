const categories = ["Ettor", "Tvåor", "Treor", "Fyror", "Femmor", "Sexor", "Ett par", "Två par", "Triss", "Fyrtal", "Stege", "Kåk", "Chans", "Yatzy"];
let players = [
    { name: "Spelare 1", scores: {}, prob: 50, color: "#4cd964" },
    { name: "Spelare 2", scores: {}, prob: 50, color: "#ff3b30" }
];

// Starta appen
function init() {
    renderBoard();
    updatePrognosis();
}

function renderBoard() {
    const board = document.getElementById('game-board');
    let html = `<table><tr><th>Kategori</th>${players.map(p => `<th>${p.name}</th>`).join('')}</tr>`;

    categories.forEach(cat => {
        html += `<tr><td>${cat}</td>`;
        players.forEach((p, pIdx) => {
            const val = p.scores[cat] !== undefined ? p.scores[cat] : "";
            html += `<td><input type="number" value="${val}" onchange="setScore(${pIdx}, '${cat}', this.value)"></td>`;
        });
        html += `</tr>`;
    });
    html += `</table>`;
    board.innerHTML = html;
}

function setScore(pIdx, cat, val) {
    if (val === "") {
        delete players[pIdx].scores[cat];
    } else {
        players[pIdx].scores[cat] = parseInt(val);
    }
    updatePrognosis();
}

// Monte Carlo Simulation
function updatePrognosis() {
    const iterations = 5000;
    let wins = new Array(players.length).fill(0);

    for (let i = 0; i < iterations; i++) {
        let totals = players.map(p => {
            let sum = 0;
            categories.forEach(cat => {
                if (p.scores[cat] !== undefined) {
                    sum += p.scores[cat];
                } else {
                    sum += simulateCategory(cat);
                }
            });
            return sum;
        });
        const winner = totals.indexOf(Math.max(...totals));
        wins[winner]++;
    }

    const probBar = document.getElementById('probability-bar');
    probBar.innerHTML = "";
    
    players.forEach((p, i) => {
        p.prob = (wins[i] / iterations) * 100;
        const segment = document.createElement('div');
        segment.className = "prob-segment";
        segment.style.width = `${p.prob}%`;
        segment.style.backgroundColor = p.color;
        segment.innerText = `${Math.round(p.prob)}%`;
        segment.style.fontSize = "10px";
        segment.style.textAlign = "center";
        probBar.appendChild(segment);
    });
}

function simulateCategory(cat) {
    const dice = () => Math.floor(Math.random() * 6) + 1;
    // Enkel uppskattning för simulering
    if (["Ettor", "Tvåor", "Treor", "Fyror", "Femmor", "Sexor"].includes(cat)) {
        return Math.random() > 0.5 ? 3 * (categories.indexOf(cat) + 1) : 0;
    }
    if (cat === "Yatzy") return Math.random() < 0.04 ? 50 : 0;
    return Math.floor(Math.random() * 15) + 5;
}

function rollDice() {
    const diceDivs = document.querySelectorAll('.die');
    diceDivs.forEach(d => {
        d.innerText = Math.floor(Math.random() * 6) + 1;
    });
}

init();
