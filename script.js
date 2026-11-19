
// =================================
// 1. SELECT HTML ELEMENTS
// =================================

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

const productCards = document.querySelectorAll(".product-card");
const addButtons = document.querySelectorAll(".add-btn");

// Store cart products
let cart = JSON.parse(localStorage.getItem("nsEliteCart")) || [];


// =================================
// 2. CREATE CART DISPLAY
// =================================

const cartPanel = document.createElement("div");

cartPanel.id = "cartPanel";

cartPanel.innerHTML = `
    <div class="cart-header">
        <h2>My Shopping Cart</h2>
        <button id="closeCart">✕</button>
    </div>

    <div id="cartItems"></div>

    <div class="cart-footer">
        <h3>Total: ₹<span id="cartTotal">0</span></h3>
        <button id="checkoutBtn">Proceed to Checkout</button>
    </div>
`;

document.body.appendChild(cartPanel);


// =================================
// 3. SAVE CART
// =================================

function saveCart() {
    localStorage.setItem("nsEliteCart", JSON.stringify(cart));
}


// =================================
// 4. UPDATE CART COUNT
// =================================

function updateCartCount() {

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    cartCount.textContent = totalItems;
}


// =================================
// 5. ADD PRODUCT TO CART
// =================================

addButtons.forEach(button => {

    button.addEventListener("click", function () {

        const card = this.closest(".product-card");

        const name = card.querySelector("h3").textContent;

        const priceText = card.querySelector(".price").childNodes[0].textContent;

        const price = Number(priceText.replace(/[₹,\s]/g, ""));

        const image = card.querySelector("img").src;

        // Check whether product already exists

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

        }

        saveCart();
        updateCartCount();
        displayCart();

        showNotification(name + " added to cart!");
    });

});


// =================================
// 6. DISPLAY CART PRODUCTS
// =================================

function displayCart() {

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = "<p>Your cart is empty!</p>";

    }

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-product-info">
                <h4>${item.name}</h4>
                <p>₹${item.price.toLocaleString("en-IN")}</p>

                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>

            <button class="remove-btn">Remove</button>
        `;

        // Increase quantity

        cartItem.querySelector(".increase").addEventListener("click", () => {

            item.quantity++;

            saveCart();
            displayCart();
            updateCartCount();

        });

        // Decrease quantity

        cartItem.querySelector(".decrease").addEventListener("click", () => {

            item.quantity--;

            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }

            saveCart();
            displayCart();
            updateCartCount();

        });

        // Remove product

        cartItem.querySelector(".remove-btn").addEventListener("click", () => {

            cart.splice(index, 1);

            saveCart();
            displayCart();
            updateCartCount();

        });

        cartItems.appendChild(cartItem);

    });

    document.getElementById("cartTotal").textContent =
        total.toLocaleString("en-IN");

}


// =================================
// 7. OPEN AND CLOSE CART
// =================================

cartBtn.addEventListener("click", function (event) {

    event.preventDefault();

    cartPanel.classList.add("active");

    displayCart();

});

document.getElementById("closeCart").addEventListener("click", () => {

    cartPanel.classList.remove("active");

});


// =================================
// 8. SUCCESS NOTIFICATION
// =================================

function showNotification(message) {

    const notification = document.createElement("div");

    notification.className = "notification";

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.remove();

    }, 2000);

}


// =================================
// 9. SEARCH PRODUCTS
// =================================

const searchInput = document.querySelector(".search input");

searchInput.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();

    productCards.forEach(card => {

        const productName = card.querySelector("h3")
            .textContent.toLowerCase();

        const category = card.querySelector(".category-name")
            .textContent.toLowerCase();

        if (
            productName.includes(searchValue) ||
            category.includes(searchValue)
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});


// =================================
// 10. NEWSLETTER SUBSCRIPTION
// =================================

const newsletterForm = document.querySelector(".newsletter-form");

newsletterForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = this.querySelector("input").value;

    showNotification("Thank you for subscribing!");

    this.reset();

});


// =================================
// 11. CHECKOUT BUTTON
// =================================

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {

        showNotification("Your cart is empty!");

    } else {

        showNotification("Checkout feature coming soon!");

    }

});


// =================================
// 12. INITIALIZE CART
// =================================

updateCartCount();
displayCart();
