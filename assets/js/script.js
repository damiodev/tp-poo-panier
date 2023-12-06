// Données d'exemple pour le tableau
let products = [
  { reference: '5K96', name: 'Savon', unitPrice: 6, quantity: 4 },
  { reference: '98Y3', name: 'Coquillette', unitPrice: 3, quantity: 8 },
  { reference: '365D', name: 'Yaourt nature', unitPrice: 8, quantity: 2 }
];

// Coûts de livraison (relais colis = 5€, a domicile = 12€)
const deliveryCosts = {
  relay: 5,
  home: 12
};

// Récupérer l'élément du tableau
let tableBody = document.querySelector('#product-table tbody');
let totalPriceElement = document.querySelector('#total-price');
let totalVatElement = document.querySelector('#total-vat');
let totalFinalElement = document.querySelector('#total-final');
let deliveryModeElement = document.querySelector('#delivery-mode');

/**
 * Met à jour les totaux des produits dans le panier s'achat.
 */
function updateTotals() {
  // Initialise le prix total.
  let totalPrice = 0;

  // Calcule le prix total pour chaque produit.
  products.forEach(product => {
    let productPrice = product.unitPrice * product.quantity;
    totalPrice += productPrice;

    // Mettre à jour le prix dans la colonne "Prix".
    document.getElementById(`price-${product.reference}`).textContent = productPrice;
  });

  // Calcule la TVA (20%).
  let totalVat = totalPrice * 0.2;

  // Ajoute le coût de livraison
  let deliveryCost = deliveryCosts[deliveryModeElement.value];
  totalPrice += deliveryCost;

  // Calcule le prix TTC
  let totalFinal = totalPrice + totalVat;

  // Met à jour les totaux dans le bas du tableau
  totalPriceElement.textContent = totalPrice;
  totalVatElement.textContent = totalVat;
  totalFinalElement.textContent = totalFinal;

  // Sauvegarde les données dans le stockage local
  saveToLocalStorage();
}

/**
 * Sauvegarde le panier dans le stockage local.
 */
function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(products)); // Convertir le tableau en chaîne de caractères.
}

/**
 * Charge le panier depuis le stockage local.
 * Si un panier est stocké localement, il est récupéré et la fonction generateTable() est appelée.
 * 
 * @param {string|null} storedCart - Le panier stocké dans le stockage local.
 * @return {Array} products - Le panier, représenté sous forme d'objet JavaScript.
 */
function loadFromLocalStorage() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    products = JSON.parse(storedCart);

    // Génère la table basée sur le panier chargé.
    generateTable();
  }
}

/**
 * Supprime un produit de la liste des produits.
 * 
 * @param {string} reference - La référence du produit à supprimer.
 */
function deleteProduct(reference) {
  // Filtrer le produit avec la référence donnée du tableau des produits.
  products = products.filter(product => product.reference !== reference);
  // Regénérer le tableau après la suppression.
  generateTable();
}

/**
 * Ajoute un nouveau produit au panier d'achat.
 * 
 * @param {string} newReference - La réference du nouveau produit.
 * @param {string} newName - Le nom du nouveau produit.
 * @param {number} newUnitPrice - Le prix unitaire du nouveau produit.
 * @param {number} newQuantity - La quantité du nouveau produit.
 * 
 * @returns 
 */
function addProduct() {
  // Récupère les valeurs du nouveau produit (via la fenêtre de dialogue).
  let newReference = prompt("Entrez la référence du nouveau produit :");
  let newName = prompt("Entrez le nom du nouveau produit :");
  let newUnitPrice = parseFloat(prompt("Entrez le prix unitaire du nouveau produit :"));
  let newQuantity = parseInt(prompt("Entrez la quantité du nouveau produit :"));

  // Vérifie si les valeurs du prix unitaire et de la quantité sont valides.
  if (!isNaN(newUnitPrice) && !isNaN(newQuantity)) {
    // Ajoute le nouveau produit à la liste des produits.
    products.push({
      reference: newReference,
      name: newName,
      unitPrice: newUnitPrice,
      quantity: newQuantity
    });

    // Regénérer le tableau après l'ajout.
    generateTable();

    // Sauvegarder les données dans le stockage local après l'ajout.
    saveToLocalStorage();
  } else {
    // Affiche un message d'erreur si les valeurs ne sont pas valides.
    alert("Veuillez saisir des valeurs numériques valides.");
  }
}

/**
 * Génère les lignes du tableau à partir des produits.
 * 
 * @param {Array} products - La liste des produits.
 * @param {HTMLTableElement} tableBody - Le corps du tableau.
 * 
 */
function generateTable() {
  // Efface le contenu actuel du tableau.
  tableBody.innerHTML = '';

  // Génère les lignes du tableau.
  products.forEach(product => {

    let row = tableBody.insertRow();

    // Ajoute les cellules de la ligne avec les informations du produit.
    row.innerHTML = `
            <td>${product.reference}</td>
            <td>${product.name}</td>
            <td>${product.unitPrice}</td>
            <td><input type="number" value="${product.quantity}" min="1" max="10" id="quantity-${product.reference}"></td>
            <td id="price-${product.reference}">${product.unitPrice * product.quantity}</td>
            <td><button onclick="deleteProduct('${product.reference}')">Supprimer</button></td>
        `;

    // Ajouter un écouteur d'événements pour la modification de la quantité.
    let quantityInput = row.querySelector(`#quantity-${product.reference}`);
    quantityInput.addEventListener('input', function () {

      product.quantity = parseInt(this.value);

      // Met à jour le prix dans la colonne "Prix"
      document.getElementById(`price-${product.reference}`).textContent = product.unitPrice * product.quantity;

      // Met à jour les totaux
      updateTotals();
    });
  });

  // Met à jour les totaux au chargement initial ou après des modifications
  updateTotals();
}

// Génére le tableau au chargement initial
loadFromLocalStorage();

// Génére le tableau au chargement initial
generateTable();