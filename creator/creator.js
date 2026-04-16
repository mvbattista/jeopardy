'use strict';

const ROUNDS = ['jeopardy', 'double-jeopardy'];
const DEFAULT_VALUES = [200, 400, 600, 800, 1000];

let board = {
    "jeopardy": [],
    "double-jeopardy": [],
    "final-jeopardy": { category: "", question: "", answer: "" }
};

// Tracks which question is open in the edit modal
let editCtx = { round: null, catIdx: null, qIdx: null };

// Safe HTML escaping for dynamic content
function esc(val) {
    return String(val == null ? '' : val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Rendering ────────────────────────────────────────────────────────────────

function renderBoard() {
    ROUNDS.forEach(round => {
        document.getElementById('board-' + round).innerHTML = buildRoundHTML(round);
    });
}

function buildRoundHTML(round) {
    let html = '<div class="board-row">';

    board[round].forEach((category, catIdx) => {
        html += `
            <div class="category-col">
                <div class="category-header">
                    <input
                        class="category-name-input"
                        data-round="${round}" data-cat="${catIdx}"
                        value="${esc(category.name)}"
                        placeholder="CATEGORY NAME"
                    >
                    <button class="remove-cat-btn" data-round="${round}" data-cat="${catIdx}" title="Remove category">&times;</button>
                </div>`;

        category.questions.forEach((q, qIdx) => {
          html += `
                <button class="question-tile ${q['daily-double'] ? 'dd-badge' : ''}" data-round="${round}" data-cat="${catIdx}" data-q="${qIdx}">
                    $${esc(q.value)}
                </button>`;
        });

        if (category.questions.length < 5) {
            html += `<button class="add-q-btn" data-round="${round}" data-cat="${catIdx}">+ Add Question</button>`;
        }

        html += '</div>';
    });

    if (board[round].length < 6) {
        html += `
            <div class="add-cat-col">
                <button class="add-cat-btn" data-round="${round}">+ Add Category</button>
            </div>`;
    }

    html += '</div>';
    return html;
}

// ── Board event delegation ───────────────────────────────────────────────────

document.addEventListener('click', function (e) {
    const tile = e.target.closest('.question-tile');
    if (tile) {
        openEdit(tile.dataset.round, +tile.dataset.cat, +tile.dataset.q);
        return;
    }

    const removeCat = e.target.closest('.remove-cat-btn');
    if (removeCat) {
        board[removeCat.dataset.round].splice(+removeCat.dataset.cat, 1);
        renderBoard();
        return;
    }

    const addQ = e.target.closest('.add-q-btn');
    if (addQ) {
        const cat = board[addQ.dataset.round][+addQ.dataset.cat];
        cat.questions.push({
            question: "ENTER YOUR QUESTION HERE.",
            value: DEFAULT_VALUES[cat.questions.length] * ( addQ.dataset.round == "jeopardy" ? 1 : 2 ) || 0,
            answer: "Enter the answer."
        });
        renderBoard();
        return;
    }

    const addCat = e.target.closest('.add-cat-btn');
    if (addCat) {
        board[addCat.dataset.round].push({ name: "NEW CATEGORY", questions: [] });
        renderBoard();
        return;
    }
});

// Category name: update model on input (uppercase)
document.addEventListener('input', function (e) {
    const input = e.target.closest('.category-name-input');
    if (input) {
        input.value = input.value.toUpperCase();
        board[input.dataset.round][+input.dataset.cat].name = input.value;
    }
});

// ── Edit modal ───────────────────────────────────────────────────────────────

function currentQuestion() {
    const { round, catIdx, qIdx } = editCtx;
    if (round == null) return null;
    return board[round][catIdx].questions[qIdx];
}

function openEdit(round, catIdx, qIdx) {
    editCtx = { round, catIdx, qIdx };
    const q = board[round][catIdx].questions[qIdx];

    document.getElementById('edit-question').value = q.question || '';
    document.getElementById('edit-answer').value = q.answer || '';
    document.getElementById('edit-value').value = q.value != null ? q.value : '';
    document.getElementById('edit-daily-double').checked = !!q['daily-double'];

    renderModalImageSection(q);
    $('#edit-modal').modal('show');
}

function renderModalImageSection(q) {
    const container = document.getElementById('modal-image-section');
    if (q.image != null) {
        container.innerHTML = `
            <div class="form-group">
                <label for="edit-image">Image URL</label>
                <input id="edit-image" type="text" class="form-control" value="${esc(q.image)}" placeholder="https://... or base64 data URI">
                <button id="remove-image-btn" class="btn btn-danger btn-sm" style="margin-top:6px;">Remove Image</button>
            </div>`;
        document.getElementById('edit-image').addEventListener('input', function () {
            const q = currentQuestion();
            if (q) q.image = this.value;
        });
        document.getElementById('remove-image-btn').addEventListener('click', function () {
            const q = currentQuestion();
            if (q) delete q.image;
            renderModalImageSection(q);
        });
    } else {
        container.innerHTML = `<button id="add-image-btn" class="btn btn-default btn-sm">+ Add Image</button>`;
        document.getElementById('add-image-btn').addEventListener('click', function () {
            const q = currentQuestion();
            if (q) q.image = '';
            renderModalImageSection(q);
        });
    }
}

// Live-update model from modal inputs
document.getElementById('edit-question').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
    const q = currentQuestion();
    if (q) q.question = this.value;
});

document.getElementById('edit-answer').addEventListener('input', function () {
    const q = currentQuestion();
    if (q) q.answer = this.value;
});

document.getElementById('edit-value').addEventListener('input', function () {
    const q = currentQuestion();
    if (q) q.value = this.value === '' ? '' : +this.value;
});

document.getElementById('edit-daily-double').addEventListener('change', function () {
    const q = currentQuestion();
    if (q) q['daily-double'] = this.checked;
});

document.getElementById('edit-delete-btn').addEventListener('click', function () {
    const { round, catIdx, qIdx } = editCtx;
    board[round][catIdx].questions.splice(qIdx, 1);
    $('#edit-modal').modal('hide');
});

// Re-render after modal closes to reflect any value changes on tiles
$('#edit-modal').on('hidden.bs.modal', renderBoard);

// ── Final Jeopardy ───────────────────────────────────────────────────────────

document.getElementById('fj-category').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
    board['final-jeopardy'].category = this.value;
});

document.getElementById('fj-question').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
    board['final-jeopardy'].question = this.value;
});

document.getElementById('fj-answer').addEventListener('input', function () {
    board['final-jeopardy'].answer = this.value;
});

// ── Download / Load ──────────────────────────────────────────────────────────

document.getElementById('download-btn').addEventListener('click', function () {
    const json = JSON.stringify(board, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jeopardy-board.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('load-btn').addEventListener('click', function () {
    document.getElementById('load-file-input').click();
});

document.getElementById('load-file-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        try {
            board = JSON.parse(ev.target.result);
            renderBoard();
            syncFinalJeopardy();
        } catch (_) {
            alert('Invalid JSON file. Please check the file and try again.');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
});

function syncFinalJeopardy() {
    const fj = board['final-jeopardy'] || {};
    document.getElementById('fj-category').value = fj.category || '';
    document.getElementById('fj-question').value = fj.question || '';
    document.getElementById('fj-answer').value = fj.answer || '';
}

// ── Init ─────────────────────────────────────────────────────────────────────

renderBoard();
