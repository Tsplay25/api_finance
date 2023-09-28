const name = document.querySelector('#name');
const value = document.querySelector('#value');
const description = document.querySelector('#description');

function createTd(value) {
    const td = document.createElement('td');
    td.innerText = value;
    return td;
}

function renderEntry(entryData) {
    const row = document.createElement('tr');
    row.id = `entry-${entryData.id}`;

    const rowContent = [
        entryData.id,
        entryData.name,
        entryData.value,
        entryData.description,
    ];

    rowContent.forEach((item) => {
        row.append(createTd(item));
    });

    const body = document.querySelector('#entries');
    body.append(row);
}

async function updateBalance() {
    const balance = document.querySelector('#balance');
    let sum = 0;

    const getBalance = await fetch('http://localhost:3000/entries').then(
        (res) => res.json()
    );

    getBalance.forEach((entry) => {
        if (entry.type === 'debit') sum -= parseFloat(entry.value);
        else if (entry.type === 'credit') sum += parseFloat(entry.value);
    });

    const brl = sum.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    balance.innerText = brl;
}

const debit = document.querySelector('#debit');
debit.addEventListener('click', (ev) => {
    ev.preventDefault();

    value.classList = 'debitValue';
});

const credit = document.querySelector('#credit');
credit.addEventListener('click', (ev) => {
    ev.preventDefault();

    value.classList = 'creditValue';
});

// GET
async function getEntries() {
    const entries = await fetch('http://localhost:3000/entries').then((res) =>
        res.json()
    );

    entries.forEach(renderEntry);
}

document.addEventListener('DOMContentLoaded', () => {
    getEntries();
    updateBalance();
});

// POST
const form = document.querySelector('form');
form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    let type;

    console.log(value.classList);
    if (value.classList.value === 'debitValue') type = 'debit';
    else if (value.classList.value === 'creditValue') type = 'credit';
    console.log(type);

    const transactionData = {
        name: name.value,
        value: parseFloat(value.value),
        description: description.value,
        type: type,
    };

    const response = await fetch('http://localhost:3000/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
    });

    const saveTransaction = await response.json();
    form.reset();
    renderEntry(saveTransaction);
    updateBalance();
});

// DELETE
const del = document.querySelector('#removeTransaction');
del.addEventListener('click', async () => {
    const id = prompt('Digite o id da transação que deseja remover');

    await fetch('http://localhost:3000/entries/' + id, {
        method: 'DELETE',
    });

    getEntries();
    updateBalance();
    location.reload(true);
});

// EDIT
const edit = document.querySelector('#editTransaction');
edit.addEventListener('click', async () => {
    const id = prompt('Digite o id da transação que deseja editar');

    const entry = await fetch('http://localhost:3000/entries/' + id).then(
        (res) => res.json()
    );

    let data = {
        name: entry.name,
        value: entry.value,
        description: entry.description,
    };

    const newName = prompt(
        `O nome atual é: "${data.name}", digite o novo nome:`
    );
    const newValue = prompt(
        `O valor atual é: "${data.value}", digite o novo valor:`
    );
    const newDescription = prompt(
        `A descrição atual é: "${data.description}", digite a nova descrição:`
    );

    data.name = newName;
    data.value = newValue;
    data.description = newDescription;

    await fetch('http://localhost:3000/entries/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    updateBalance();
    location.reload(true);
});
