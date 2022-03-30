//var SERVER = 'http://localhost:3001/books';
var SERVER = 'http://localhost:8080/bookrestwildfly-1.0-SNAPSHOT/webresources/com.example.bookrestwildfly.book';

/*
 Adds an event listener to the submit button. Retreieves attributes from html form and puts them
 into attributes. Checks for nulls. Opens a http request and puts variables in url string. Sends
 request with attributes in url string to the server. Emtpys the table and rebuilds the tale with
 the update rows.

 */
function htmlCreateBook() {
    // Get create form
    var form = document.getElementById('new-book');



    // Add create form event listener
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bid = document.getElementById('new-book-bid').value || null;
        var author = document.getElementById('new-book-author').value || null;
        var status = document.getElementById('new-book-status').value || null;
        var title = document.getElementById('new-book-title').value || null;
        if (bid === null || author === null || status === null || title === null) {
            emptyForm();
            return;
        }

        var data = JSON.stringify({
            "bid": bid,
            "author": author,
            "status": status,
            "title": title
        });


        var req = new XMLHttpRequest();
        req.withCredentials = true;
        var url = `${SERVER}`;

        req.open('POST', url, true);
        req.onload = function () {
            console.log(req.status);
            if (req.status === 204) {
                emptyForm();
                emptyBooksTable();
                htmlReadBooks();
            }
        };
        req.setRequestHeader("Content-Type", "application/json");
        req.send(data);
    });
}
function emptyForm() {
    /**
     * Empty new shift form
     */
    document.getElementById('new-book-author').value = null;
    document.getElementById('new-book-status').value = null;
    document.getElementById('new-book-title').value = null;
}

function htmlReadBooks() {
    /**
     * Build books table from database read over HTML
     */
    var req = new XMLHttpRequest();
    req.open('GET', SERVER, true);
    req.onload = function () {

        if (req.status === 200) {
            emptyBooksTable();
            var books = JSON.parse(req.responseText);
            fillBooksTable(books);
        }
    };
    req.send();
}

function emptyBooksTable() {
    /**
     * Empty books table data
     */
    var table = document.getElementById('books-table');
    Array.from(table.children).slice(1).forEach(function () {
        table.removeChild(table.children[1]);
    });
}

function fillBooksTable(books) {
    /**
     * Fill books table with data
     */
    books.forEach(function (book) {
        appendBooksTableRow(book);
    });
}

function appendBooksTableRow(book) {
    /**
     * Append books table row with data
     */
    var bid = book.bid;
    var author = book.author;
    var status = book.status;
    var title = book.title;

    // Get table
    var table = document.getElementById('books-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${bid}`;
    table.appendChild(tableRow);

    // Append book ID table cell
    var bidCell = document.createElement('div');
    bidCell.style.display = 'table-cell';
    var bidInput = document.createElement('input');
    bidInput.id = `book-id-${bid}`;
    bidInput.disabled = true;
    bidInput.name = 'shift-id';
    bidInput.value = bid;
    bidCell.appendChild(bidInput);
    tableRow.appendChild(bidCell);

    // Append book first name table cell
    var authorCell = document.createElement('div');
    authorCell.style.display = 'table-cell';
    var authorInput = document.createElement('input');
    authorInput.id = `book-author-${bid}`;
    authorInput.type = 'text';
    authorInput.name = 'book-author';
    authorInput.value = author;
    authorCell.appendChild(authorInput);
    tableRow.appendChild(authorCell);

    // Append book last name table cell
    var statusCell = document.createElement('div');
    statusCell.style.display = 'table-cell';
    var statusInput = document.createElement('input');
    statusInput.id = `book-last-name-${bid}`;
    statusInput.type = 'text';
    statusInput.name = 'book-status';
    statusInput.value = status;
    statusCell.appendChild(statusInput);
    tableRow.appendChild(statusCell);

    // Append orders assigned table cell
    var titleCell = document.createElement('div');
    titleCell.style.display = 'table-cell';
    var titleInput = document.createElement('input');
    titleInput.id = `book-title-${bid}`;
    titleInput.type = 'text';
    titleInput.name = 'book-title';
    titleInput.value = title;
    titleCell.appendChild(titleInput);
    tableRow.appendChild(titleCell);

    // Append update table cell
    var updateCell = document.createElement('div');
    updateCell.style.display = 'table-cell';
    var updateInput = document.createElement('input');
    updateInput.id = `update-${bid}`;
    updateInput.type = 'button';
    updateInput.name = 'update';
    updateInput.value = 'Update';
    updateCell.appendChild(updateInput);
    tableRow.appendChild(updateCell);

    // Add update event listener
    updateInput.addEventListener('click', function (e) {
        e.preventDefault();
        var book = {
            bid: bidInput.value,
            author: authorInput.value,
            status: statusInput.value,
            title: titleInput.value
        };
        htmlUpdateBook(book);
    });

    // Append book table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${bid}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click', function (e) {
        e.preventDefault();
        htmlDeleteBook(bid);
    });
}

function htmlUpdateBook(book) {
    /**
     * Update Books table with database update over HTML
     */
    var bid = book.bid;
    var author = book.author;
    var status = book.status;
    var title = book.title;

    var data = JSON.stringify({
        "bid": bid,
        "author": author,
        "status": status,
        "title": title
    });


    var req = new XMLHttpRequest();
    var url = `${SERVER}/${bid}`;
    req.open('PUT', url, true);
    req.onload = function () {
        if (req.status === 204) {
            emptyBooksTable();
            htmlReadBooks();
        }
    };
    req.setRequestHeader("Content-Type", "application/json");
    req.send(data);
}

function htmlDeleteBook(bid) {
    /**
     * Delete from books table with database delete over HTML
     */
    var req = new XMLHttpRequest();
    var url = `${SERVER}/${bid}`;
    req.open('DELETE', url, true);
    req.onload = function () {
        if (req.status === 204) {
            emptyBooksTable();
            htmlReadBooks();
        }
    };
    req.send();
}

/**
 * Main
 */

document.addEventListener('DOMContentLoaded', htmlCreateBook());
document.addEventListener('DOMContentLoaded', htmlReadBooks());
