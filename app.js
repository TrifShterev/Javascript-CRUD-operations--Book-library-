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
//function to load all items
async function getAllBooks() {
    const books = await request('http://localhost:3030/jsonstore/collections/books');
    return books;
}

//function Create 
async function createBook(book) {
    const result =  await request('http://localhost:3030/jsonstore/collections/books',{
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(book)
    });

    return result;
}

//function Update
async function updateBook(id,book) {
    const result = await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book)
    });

    return result;
}
//function Delete
async function deleteBook(id) {
    const result = await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'delete'
       
    });
    return result;
}