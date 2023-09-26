function rmButton(id) {
    const remove = document.createElement('button');
    const icon = document.createElement('img');

    icon.src = './assets/remove.png';
    remove.id = `rm-${id}`;

    remove.append(icon);
    return remove;
}

function createTd(value) {
    const td = document.createElement('td');
    td.innerText = value;
    return td;
}

function renderEntry(entryData) {
    const row = document.createElement('tr');
    row.id = `entry-${entryData.id}`;

    const rowContent = [entryData.id, entryData.name, entryData.value, entryData.description];
    rowContent.forEach(item => {
        row.append(createTd(item));
    });
    row.append(rmButton(entryData.id));

    const body = document.querySelector('#entries');
    body.append(row);
}

async function getEntries() {
    const entries = await fetch('http://localhost:3000/entries').then(res => res.json());
    // console.log(entries);
    renderEntry(entries);
}

getEntries();