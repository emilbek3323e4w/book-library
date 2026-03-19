const searchInput = document.getElementById('search-input');
const booksGrid = document.getElementById('books-grid');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');

let allBooks = [];

async function getBooks() {
    try{
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    booksGrid.innerHTML = '';

    const response = await fetch('https://openlibrary.org/search.json?title=harry+potter')

    if(!response.ok){
        throw new Error('Something went wrong');
    }

    const data = await response.json();
    allBooks = data.docs;
    console.log('Books', allBooks);

    loadingState.style.display = 'none'
    renderBooks(allBooks);

} catch(error){
    console.log('Error', error)
    loadingState.style.display = 'none'
    errorState.style.display = 'block'
}
}

function renderBooks(books){
    booksGrid.innerHTML = '';
    if(Array.isArray(books) && books.length > 0) {
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card'

            const title = book.title.length > 40 ? book.title.slice(0, 40) + '...' : book.title;

            const coverUrl = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : 'https://via.placeholder.com/150';
            

            bookCard.innerHTML = `
                <img src="${coverUrl}" alt="${book.title}">
                <h3>${title}</h3>
                <p>${book.author_name?.join(', ') || 'Unknown'}</p>
                <p>${book.first_publish_year || 'N/A'}</p>
            `;

            bookCard.addEventListener('click', () => {
                showBookDetail(book);
            });

            booksGrid.appendChild(bookCard);
        });
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filtered);
});

function showBookDetail(book) {
    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/150';

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${coverUrl}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author_name?.join(', ') || 'Unknown'}</p>
            <p><strong>Year:</strong> ${book.first_publish_year || 'N/A'}</p>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', getBooks);