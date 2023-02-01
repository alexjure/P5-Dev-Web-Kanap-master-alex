// Récuperation d'un paramètre de l'URL qui se trouve être l'id 
let url = window.location.href;
url = new URL(url); 
let id = url.searchParams.get("id")

// Affichage du produit
function getProduct(id) {
    // Récupération de l'id
    fetch("http://localhost:3000/api/products/" + id)
        .then(function (res) {
            if (res.ok) {
                console.log(res)
                return res.json();
            }
        })
        // Création du produit
        .then(function (product) {
            console.log(product)
            
            let img = document.createElement("img");
            img.src = product.imageUrl;
            img.alt = product.altTxt;
            
            document.querySelector(".item__img").appendChild(img);

            let title = document.getElementById('title')
            title.innerText = product.name

            let price = document.getElementById('price')
            price.innerText = product.price

            let description = document.getElementById('description')
            description.innerText = product.description
            
            // Récupération des différentes couleurs du produit
            for (let color of product.colors) {
                const productColor = document.createElement('option');
                document.querySelector('#colors').appendChild(productColor);
                productColor.innerText = color;
                productColor.value = color;
            }
            
            const btn = document.getElementById('addToCart');
            // Récupération d'un événement sur le bouton (clic sur le bouton)
            btn.addEventListener('click', function () {

                // Récupération de la couleur choisie
                let colors = document.getElementById('colors')
                let color = colors.value;
                console.log(color)

                // Récupération de la quantité choisie
                let quantitySelected = document.getElementById('quantity')
                let quantity = quantitySelected.value;

                // Messages en cas d'erreurs
                if (color === '') {
                    alert('Merci de choisir une couleur')
                } else if (quantity <= 0 || quantity >= 100) {
                    alert('Merci de choisir une quantité');
                } else {

                    // Création du localStorage
                    let cart = localStorage.getItem('products');

                    if (cart === null) {
                        cart = [];
                    } else {
                        cart = JSON.parse(cart);
                    }
            
                    let newItem = true;

                    let productOrder = {
                        id: product._id,
                        quantity: Number(quantity),
                        color: color
                    }

                    for (let product of cart) {
                        // Verification si le produit existe dans le localstorage et addition de la quantité
                        if (product.id === id && product.color === color) {
                            product.quantity += Number(quantity);
                            newItem = false;
                        }
                    }
                    // Ajout du produit dans le localStorage si il n'existe pas dedans
                    if (newItem === true) {
                        cart.push(productOrder)
                    }
                     
                    localStorage.setItem('products', JSON.stringify(cart));
                    alert('Votre produit a bien été enregistrée');
                }
            })
        })
        
        .catch(function (error) {
            console.log(error);
        })
}

// Initialisation de la fonction au chargement de la page
getProduct(id);

