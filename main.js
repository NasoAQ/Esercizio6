// Creo un async function per recuperare una lista di utenti
async function fetchUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    return users;
}

//fetchUsers()

// Recupero gli elementi nel DOM
const filterDropdown = document.querySelectorAll('.dropdown-item');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById('tableBody');
const searchButton = document.getElementById('search-button')

// Creo una funzione che mi filtri la risposta ricevuta dall'API in base alla scelta dell'utente sul dropdown
filterDropdown.forEach(item => {
// Per ogni elemento nel dropdown, passo un evento al click del mouse
    item.addEventListener('click', function() {
        const selectedFilter = this.textContent.trim();
        const filterKey = selectedFilter.charAt(0).toLowerCase() + selectedFilter.slice(1);
        searchInput.placeholder = `Search by ${selectedFilter}`;
        //console.log(searchInput.placeholder);
        searchInput.dataset.filter = filterKey;
        searchContainer.classList.remove('d-none');

        //Salvo i dati inseriti nel filtro, PROVA LOCAL STORAGE
        localStorage.setItem('selectedFilter', filterKey);

        //Richiamo la funzione per popolare la tabella
        //populateTable()
    });
});

//Creo una funzione che restituisca un array di utenti filtrati
function filterUsers(users, filterKey, searchTerm) {
    return users.filter(user => user[filterKey].toLowerCase().includes(searchTerm.toLowerCase()));
}

//Creo una funzione asincrona per "popolare" la tabella
async function populateTable() {
    const users = await fetchUsers();
    const selectedFilter = searchInput.dataset.filter;
    const searchTerm = searchInput.value.trim();

    let filteredUsers = users;
    //Controllo se il testo viene inserito nel campo di ricerca corretto
    if (selectedFilter && searchTerm) {
        //Se corrispondono, restituisco l'array utenti aggiornato
        filteredUsers = filterUsers(users, selectedFilter, searchTerm);
    }

    //Svuoto il container della tabella
    tableBody.innerHTML = '';

    //Per ogni utente trovato creo una tabella stile bootstrap
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
    
        const idCell = document.createElement('td');
        idCell.textContent = user.id;
        row.appendChild(idCell);
    
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        row.appendChild(emailCell);
    
        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);
    
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        row.appendChild(nameCell);
    
        row.classList.add('table-row');
    
        tableBody.appendChild(row);
    });
}

//Applico un listener al campo di ricerca di tipo input
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        clearTable(); 
    } else {
        populateTable();
    }
});

//Applico un listener al campo di ricerca di tipo keyup
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        populateTable();
    }
});

//Applico un listener al pulsante di ricerca di tipo click
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    populateTable();
});

//Creo una funzione per svuotare la tabella
function clearTable() {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}

//PROVA LOCAL STORAGE

// Recupera il filtro dal localStorage al caricamento della pagina
window.addEventListener('load', () => {
    const storedFilter = localStorage.getItem('selectedFilter');

    if (storedFilter) {
        const filterItem = Array.from(filterDropdown).find(item => {
            return item.textContent.trim().toLowerCase() === storedFilter.toLowerCase();
        });

        if (filterItem) {
            const selectedFilter = filterItem.textContent.trim();
            const filterKey = storedFilter;

            searchInput.placeholder = `Search by ${selectedFilter}`;
            searchInput.dataset.filter = filterKey;
            searchContainer.classList.remove('d-none');

            //populateTable();
        }
    }
});

