// Récuperation d'un paramètre de l'URL qui se trouve être l'orderId
let url = window.location.href;
url = new URL(url);
let id = url.searchParams.get("orderId")

console.log(id);
// Affichage de l'id
document.getElementById("orderId").innerHTML = id;
