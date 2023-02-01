//Récupération du localStorage
let cart = localStorage.getItem('products');
cart = JSON.parse(cart);

const cartItems = document.getElementById("cart__items");
let deleteButton = document.getElementsByClassName("deleteItem");
let changeQuantity = document.getElementsByClassName("itemQuantity");
let totalQuantity = 0;
let totalPrice = 0;
let totalQuantityElt = document.getElementById("totalQuantity");
let totalPriceElt = document.getElementById("totalPrice");

const btnSubmit = document.getElementById("order");

// Message d'erreur en cas de panier vide
if (cart === null) {
    alert('Panier vide')
}

// Récupération un par un de tous les produits du localStorage 
for (let product of cart) {
    fetch('http://localhost:3000/api/products/' + product.id)

        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        
        .then(function (api) {

            let price = api.price;
            if (product.quantity > 0) {
                totalQuantity += product.quantity;
                totalPrice += price * product.quantity;
            }
            // Récupération des informations soit depuis l'API ou depuis le LocalStorage 
            const items = `<article class="cart__item" data-id="${api._id}"  data-color="${product.color}">
            <div class="cart__item__img">
             <img src="${api.imageUrl}" alt="Photographie d'un canapé">
                </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${api.name}</h2>
                <p>${product.color}</p>
                <p>${api.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté :</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" data-old-value="${product.quantity}" max="100" value=${product.quantity}>
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
            </article>`;

            cartItems.innerHTML += items;
            totalQuantityElt.innerHTML = totalQuantity;
            totalPriceElt.innerHTML = totalPrice;

        })
        // Création d'une fonction de suppression avec l'ajout d'un eventlistener à chaque tour de boucle
        .then(function () {
            
            for (let i = 0; i < deleteButton.length; i++) {
                deleteButton[i].addEventListener('click', function () {
                    deleteProductFromCart(this);
                })
            }
        })
        // Création d'une fonction de changement de quantité avec l'ajout d'un eventlistener à chaque tour de boucle
        .then(function () {
            for (let k = 0; k < changeQuantity.length; k++) {
                changeQuantity[k].addEventListener('change', function (event) {
                    changeProductQuantityCart(this, event);
                })
            }
        })

        .catch(function (error) {
            console.log(error);
        })
}


// Fonction de changement de quantité
function changeProductQuantityCart(element, event) {

    let article = element.closest('article');
    let newQuantity = event.target.valueAsNumber;
    let productId = article.dataset.id;
    let productColor = article.dataset.color;
    let oldQuantity = element.dataset.oldValue;
    element.dataset.oldValue = newQuantity;

    
    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productId && cart[j].color === productColor) {
            cart[j].quantity = newQuantity
            localStorage.setItem('products', JSON.stringify(cart))
        }
    }
    calculTotal(productId, oldQuantity, newQuantity);
}

// Fonction de suppression de produit
function deleteProductFromCart(element) {
    let article = element.closest('article');
    let productId = article.dataset.id;
    let productColor = article.dataset.color;
    let input = article.querySelector('.itemQuantity');
    let oldQuantity = input.dataset.oldValue;

    
    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productId && cart[j].color === productColor) {
            cart.splice(j, 1);
            localStorage.setItem('products', JSON.stringify(cart));
        }
    }

    article.remove();
    calculTotal(productId, oldQuantity, 0);
}

// Fonction calcul total de la quantité et du prix 
function calculTotal(productId, oldQuantity, newQuantity) {
    fetch("http://localhost:3000/api/products/" + productId)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })

        .then(function (product) {
            let quantityDifference = 0;
            let price = product.price;
            let priceDifference = 0;

            newQuantity = parseInt(newQuantity);
            oldQuantity = parseInt(oldQuantity);

            // Cas où l'ancienne et la nouvelle quantité sont supérieur à 0
            if (newQuantity > 0 && oldQuantity > 0) {
                quantityDifference = newQuantity - oldQuantity;
                priceDifference = quantityDifference * price;

            // Cas où l'ancienne quantité est inférieur à 0 et la nouvelle quantité supérieur à 0
            } else if (newQuantity > 0 && oldQuantity < 0) {
                quantityDifference = newQuantity;
                priceDifference = quantityDifference * price;

            // Cas où l'ancienne quantité est supérieur à 0 et la nouvelle quantité est inférieur à 0   
            } else if (newQuantity <= 0 && oldQuantity > 0) {
                quantityDifference = -oldQuantity;
                priceDifference = quantityDifference * price;
            }

            totalQuantityElt.innerText = parseInt(totalQuantityElt.innerText) + quantityDifference;
            totalPriceElt.innerText = parseInt(totalPriceElt.innerText) + priceDifference;
        })

}

// Partie formulaire 

let inputFirstname = document.getElementById("firstName");

// Regex pour les inputs firstName, lastName et city
let regexString = new RegExp(/^[A-Za-z\s]{2,}$/);

// Regex pour l'adresse
let regexAdress = new RegExp(/^[A-Za-z0-9\s]{2,}$/);

inputFirstname.addEventListener('change', function () {
    firstnameValidation(this.value);
})

// Fonction pour tester et valider l'input firstName
function firstnameValidation(value) {
    let errorFirstname = document.getElementById('firstNameErrorMsg');
    if (!regexString.test(value)) {
        errorFirstname.innerText = "Vous devez renseigner au moins deux caractères"
        return false;
    } else {
        errorFirstname.innerText = "";
        return true;
    }
}

let inputLastname = document.getElementById("lastName");

inputLastname.addEventListener('change', function () {
    lastnameValidation(this.value);
})
// Fonction pour tester et valider l'input lastName
function lastnameValidation(value) {
    let errorLastname = document.getElementById('lastNameErrorMsg');
    if (!regexString.test(value)) {
        errorLastname.innerText = "Vous devez renseigner au moins deux caractères"
        return false;
    } else {
        errorLastname.innerText = "";
        return true
    }
}

let inputAddress = document.getElementById("address");

inputAddress.addEventListener('change', function () {
    adressValidation(this.value);
})
// Fonction pour tester et valider l'input address
function adressValidation(value) {
    let errorAdress = document.getElementById('addressErrorMsg');
    if (!regexAdress.test(value)) {
        errorAdress.innerText = "Vous devez renseigner au moins deux caractères"
        return false;
    } else {
        errorAdress.innerText = "";
        return true
    }
}

let inputCity = document.getElementById("city");

inputCity.addEventListener('change', function () {
    cityValidation(this.value);
})
// Fonction pour tester et valider l'input city
function cityValidation(value) {
    let errorCity = document.getElementById('cityErrorMsg');
    if (!regexString.test(value)) {
        errorCity.innerText = "Vous devez renseigner au moins deux caractères"
        return false;
    } else {
        errorCity.innerText = "";
        return true;
    }
}
// Regex afin de valider l'adresse mail
let regexEmail = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

let inputEmail = document.getElementById("email");

inputEmail.addEventListener('change', function () {
    emailValidation(this.value);
})
// Fonction pour tester et valider l'input email
function emailValidation(value) {
    let errorEmail = document.getElementById("emailErrorMsg");
    if (!regexEmail.test(value)) {
        errorEmail.innerText = "Vous devez renseigner une adresse Email valide"
        return false;
    } else {
        errorEmail.innerText = "";
        return true;
    }
}
// Fonction pour validation du panier
btnSubmit.addEventListener('click', function (e) {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem("products"));
    // Verification si le panier n'est pas vide et que les inputs sont correctement remplis
    if (products === null || products.length < 1) {
        alert("Vous n'avez pas de produit dans le panier")
    } else if (firstnameValidation(inputFirstname.value) == true && lastnameValidation(inputLastname.value) == true &&
        adressValidation(inputAddress.value) == true && cityValidation(inputCity.value) == true &&
        emailValidation(inputEmail.value) == true) {

            const productsID = [];

            products.forEach((product) => {
                productsID.push(product.id);
            })
        
            const order = {
                contact: {
                    firstName: inputFirstname.value,
                    lastName: inputLastname.value,
                    address: inputAddress.value,
                    city: inputCity.value,
                    email: inputEmail.value,
                },
                products: productsID
            }
        
            console.log(order)
            orderProducts(order);
    } else {
        console.log('Formulaire incorrect ne peut pas être vide ou incorrect')
    }
  
})

// Envoi du panier, redirection vers la page confirmation et suppression du localStorage
function orderProducts(order) {
    console.log(order)
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    })
    
        .then(function (res) {
            console.log(res)
            if (res.ok) {
                return res.json();
            }
        })
    
        .then(function (value) {
            localStorage.clear();
            document.location.href = `confirmation.html?orderId=${value.orderId}`;
        })
        .catch(error => console.log(error))
}
