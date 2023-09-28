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

async function getEntries() {
    const entries = await fetch('http://localhost:3000/entries').then((res) =>
        res.json()
    );
    // console.log(entries);
    entries.forEach(renderEntry)
    // renderEntry(entries);
}

document.addEventListener('DOMContentLoaded', () => {
    getEntries();
});

const form = document.querySelector('form');
form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const transactionData = {
        name: document.querySelector('#name').value,
        value: document.querySelector('#value').value,
        description: document.querySelector('#description').value,
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
});

const del = document.querySelector('#removeTransaction');
del.addEventListener('click', async () => { 
    const id = prompt("Digite o id da transação que deseja remover");

    await fetch('http://localhost:3000/entries/'+id, {
        method: 'DELETE',
    });

    getEntries();
    location.reload(true);
})