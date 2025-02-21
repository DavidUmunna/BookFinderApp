fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=AIzaSyBEPQ99SQ0ptUvFwxmotMW1bAJK68LO6yc")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching books:", error));
