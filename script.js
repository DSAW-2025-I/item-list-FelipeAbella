document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const clearCartBtn = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product");

                productCard.innerHTML = `
                    <img src="${product.images.thumbnail}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                `;

                productList.appendChild(productCard);
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", () => {
                    const name = button.getAttribute("data-name");
                    const price = parseFloat(button.getAttribute("data-price"));
                    addToCart(name, price);
                });
            });
        });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCart();
        updateCart();
    }

    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
                <button class="remove-item" data-name="${item.name}">X</button>
            `;

            cartItems.appendChild(li);
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const name = button.getAttribute("data-name");
                removeFromCart(name);
            });
        });
    }

    function removeFromCart(name) {
        const item = cart.find(item => item.name === name);
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.name !== name);
        }
        saveCart();
        updateCart();
    }

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    clearCartBtn.addEventListener("click", () => {
        cart = [];
        saveCart();
        updateCart();
    });

    updateCart();
});
