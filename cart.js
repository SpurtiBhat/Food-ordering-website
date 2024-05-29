function addItemToCart() {
    var itemName = localStorage.getItem('itemName');
    var itemPrice = localStorage.getItem('itemPrice');
    if (itemName && itemPrice) {
        addToCart(itemName, itemPrice);
    }
}

const addToCart = function(name, price) {
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    if (name == null || price == null) return;
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name, price, quantity: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    calculateBill();
}

const updateCartDisplay = function() {
    const cartBody = document.querySelector(".items");
    cartBody.innerHTML = '';
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    cartItems.forEach(item => {
        const cartRow = document.createElement("tr");
        const cartItemName = document.createElement("td");
        const cartItemPrice = document.createElement("td");
        const cartItemQuantity = document.createElement("td");
        const removeButton = document.createElement("td");

        cartItemName.innerText = item.name;
        cartItemPrice.innerText = `$${item.price}`;
        cartItemPrice.classList.add("price");
        cartItemQuantity.innerText = item.quantity;

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.onclick = () => removeFromCart(item.name);
        removeButton.appendChild(removeBtn);

        cartRow.appendChild(cartItemName);
        cartRow.appendChild(cartItemPrice);
        cartRow.appendChild(cartItemQuantity);
        cartRow.appendChild(removeButton);
        cartBody.appendChild(cartRow);
    });
}

const removeFromCart = function(name) {
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems = cartItems.filter(item => item.name !== name);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    calculateBill();
}

// Calculate total bill amount
let total = 0;
const calculateBill = () => {
    total = 0; // Reset total before calculation
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    cartItems.forEach(item => {
        total += parseFloat(item.price) * item.quantity;
    });

    if (total !== 0 && !isNaN(total)) {
        document.getElementById("bill").innerText = `$${total.toFixed(2)}`;
    } else {
        document.getElementById("bill").innerText = `$0.00`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartDisplay();
    calculateBill();
    applyFirstTimeDiscount();
});

let orderBtn = document.querySelector(".butt");
orderBtn.addEventListener("click", () => {
    if (total === 0) {
        alert("Please add something in the cart to place the order");
    } else {
        alert("Order placed!");
        localStorage.removeItem('cartItems'); // Clear cart after placing order
        updateCartDisplay();
        calculateBill();
    }
});

const applyFirstTimeDiscount = () => {
    let isFirstTimeUser = localStorage.getItem('isFirstTimeUser');
    if (!isFirstTimeUser) {
        const couponCode = generateCouponCode();
        localStorage.setItem('couponCode', couponCode);
        localStorage.setItem('isFirstTimeUser', true);
        document.getElementById('couponCode').innerText = `Use coupon code ${couponCode} for 30% off!`;
        alert(`Congratulations! Your coupon code is ${couponCode}. You've received a 30% discount on your first order.`);
    }
}

const generateCouponCode = () => {
    return 'DISCOUNT30'; // Example static code, in practice generate a unique code
}
