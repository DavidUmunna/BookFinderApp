document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const bookDisplay = document.getElementById('bookDisplay');
    const paginationControls = document.getElementById('paginationControls');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('loading');
    loadingIndicator.textContent = 'Loading...';
    document.body.appendChild(loadingIndicator);

    let currentPage = 1;
    let totalPages = 1;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1;
        fetchBooks(searchInput.value, currentPage);
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchBooks(searchInput.value, currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchBooks(searchInput.value, currentPage);
        }
    });

    function fetchBooks(query, page) {
        const apiEndpoint = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${(page - 1) * 10}&key=AIzaSyBEPQ99SQ0ptUvFwxmotMW1bAJK68LO6yc`;
        showLoading(true);
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                displayBooks(data.items);
                totalPages = Math.ceil(data.totalItems / 10);
                updatePaginationControls();
                showLoading(false);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                showError('Failed to fetch books. Please try again later.');
                showLoading(false);
            });
    }

    function displayBooks(books) {
        bookDisplay.innerHTML = '';
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
                <h2>${book.volumeInfo.title}</h2>
                <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
                <p>${book.volumeInfo.description?.substring(0, 100) || 'No description available.'}...</p>
                <a href="${book.volumeInfo.infoLink}" target="_blank" class="download-button">Download</a>
            `;
            bookElement.addEventListener('click', () => {
                openModal(book);
            });
            bookDisplay.appendChild(bookElement);
        });
    }

    function updatePaginationControls() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    function openModal(book) {
        const modal = document.getElementById('newsModal');
        const modalTitle = document.querySelector('.modal-title');
        const modalImage = document.querySelector('.modal-image');
        const modalDescription = document.querySelector('.modal-description');
        const modalContent = document.querySelector('.modal-content p');

        modalTitle.textContent = book.volumeInfo.title;
        modalImage.src = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150';
        modalDescription.textContent = book.volumeInfo.authors?.join(', ') || 'Unknown Author';
        modalContent.textContent = book.volumeInfo.description || 'No description available.';
        modal.style.display = 'block';

        const closeModal = document.querySelector('.close');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    function showLoading(isLoading) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
});