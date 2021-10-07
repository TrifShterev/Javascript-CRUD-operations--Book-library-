async function request(url,options) {
    
    const response = await fetch(url,options);


    if (response.ok!=true) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }

    const data = await response.json();
    return data;
}
//function to load all items and displays them
async function getAllBooks() {
    const books = await request('http://localhost:3030/jsonstore/collections/books');
    
   const rows = Object.entries(books).map(renderBook).join('');

    document.querySelector('tbody').innerHTML = rows;
}
function renderBook([id,book]) {
    const result = `
    <tr data-id="${id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
        </td>
    </tr>`;

    return result;
}


//function Create 
async function createBook(event) {
    event.preventDefault();
const formData = new FormData(event.target);
const book = {
    title: formData.get('title'),
    author: formData.get('author')
};

    await request('http://localhost:3030/jsonstore/collections/books',{
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(book)
    });

    event.target.reset();
    getAllBooks();
}

//function Update
async function updateBook(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const book = {
        title: formData.get('title'),
        author: formData.get('author')
    };

    await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book)
    });
    document.getElementById('createForm').style.display = 'block';
    document.getElementById('editForm').style.display = 'none';
    event.target.reset();

    getAllBooks();
    
}
//function Delete
async function deleteBook(id) {
    const result = await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'delete'
       
    });
   getAllBooks();
}

// MAin function:
//  -attach event listeners
//  -load all items and displays them
 function start() {
     //event listener on the load button
    document.getElementById('loadBooks').addEventListener('click',getAllBooks);
    //event listener on the Create button
    document.getElementById('createForm').addEventListener('submit', createBook);
    //event listener for Edit button
    document.getElementById('editForm').addEventListener('submit', updateBook);
    //listener and logic for Cancel button when editing
    document.querySelector('#editForm [type="button"]').addEventListener('click',(event)=>{
        document.getElementById('createForm').style.display = 'block';
        document.getElementById('editForm').style.display = 'none';
        event.target.reset();
    })
    //event listeners on the delete and edit buttons in the table
    document.querySelector('table').addEventListener('click',handleTableClick)
}
start();

function handleTableClick(event){

    if (event.target.className=='editBtn') {
        document.getElementById('createForm').style.display = 'none';
        document.getElementById('editForm').style.display = 'block';

const bookId = event.target.parentNode.parentNode.dataset.id;
loadBookForEditing(bookId);
        
    } else if(event.target.className=='deleteBtn'){

        const confirmed = confirm('Are you sure you want to delete this book?');

        if (confirmed) {
            const bookId = event.target.parentNode.parentNode.dataset.id;
            deleteBook(bookId);
        }
       
    }

}
 async function loadBookForEditing(id) {
    const book = await request('http://localhost:3030/jsonstore/collections/books/' + id);

    document.querySelector('#editForm [name="id"]').value = id;
    document.querySelector('#editForm [name="title"]').value = book.title;    
    document.querySelector('#editForm [name="author"]').value = book.author;
}