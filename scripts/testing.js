fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching books:", error));
