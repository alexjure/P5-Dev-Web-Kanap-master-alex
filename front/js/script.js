// Création d'une variable permettant de récupérer les éléments du DOM
let itemsContainer = document.getElementById('items');

// Récupération de l'API et des produits
function getProducts() {
    fetch("http://localhost:3000/api/products")

        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })

        // Appel de la fonction displayproducts
        .then(function (products) {
            for (let product of products) {
                displayproducts(product)
            }
        })
        
        .catch(function (err) {
            console.log(err);
        })

 }

getProducts();

// Création des cartes des produits
function displayproducts(product) {
    console.log(product);
    
    let anchor = document.createElement("a");
    anchor.href = "./product.html?id=" + product._id;
    
    let article = document.createElement("article");
    
    let img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    
    let title = document.createElement("h3");
    title.classList.add("productName");
    title.innerText = product.name
    
    
    let description = document.createElement("p");
    description.classList.add('productDescription');
    description.innerText = product.description;
    
    
    anchor.appendChild(article);
    
    article.appendChild(img);
    article.appendChild(title);
    article.appendChild(description);
  
    itemsContainer.appendChild(anchor);
}



