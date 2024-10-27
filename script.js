document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching data...");

    const cart = [];

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);

            const dessertsGrid = document.querySelector('.desserts-grid');
            dessertsGrid.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(dessert => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'products';
                    productDiv.innerHTML = `
                        <img src="${dessert.image.desktop}" alt="${dessert.name}">
                        <p>${dessert.category}</p>
                        <p><b>${dessert.name}</b></p>
                        <span class="currency"><strong>$${dessert.price.toFixed(2)}</strong></span>
                        <button class="add-to-cart">
                            <img src="./assets/images/icon-add-to-cart.svg" alt="Cart Icon" class="icon">
                            <p>Add to Cart</p>
                        </button>
                    `;
                    dessertsGrid.appendChild(productDiv);

                    productDiv.querySelector('.add-to-cart').addEventListener('click', () => {
                        addToCart(dessert);
                    });
                });

                const cartContainer = document.createElement('div');
                cartContainer.className = 'cartcontainer';
                cartContainer.innerHTML = `
                    <h3>Your Cart (0)</h3>
                    <img src="./assets/images/illustration-empty-cart.svg" alt="Cart is empty" class="empty-cart-image">
                    <p class="empty-cart-message">Your added items will appear here</p>
                    <div class="cart-items"></div>
                    <p class="subtotal" style="display: none;">Subtotal: $0.00</p>
                    <button class="confirm-order" style="display: none;">Confirm Order</button>
                `;
                dessertsGrid.appendChild(cartContainer);

                // Create a confirmation order container (modal)
                const confirmationContainer = document.createElement('div');
                confirmationContainer.className = 'confirmation-container';
                confirmationContainer.style.display = 'none'; // Initially hidden
                dessertsGrid.appendChild(confirmationContainer);

                function updateCartDisplay() {
                    const cartTitle = cartContainer.querySelector('h3');
                    const cartItemsContainer = cartContainer.querySelector('.cart-items');
                    const emptyCartImage = cartContainer.querySelector('.empty-cart-image');
                    const emptyCartMessage = cartContainer.querySelector('.empty-cart-message');
                    const subtotalElement = cartContainer.querySelector('.subtotal');
                    const confirmOrderButton = cartContainer.querySelector('.confirm-order');

                    cartItemsContainer.innerHTML = '';

                    if (cart.length > 0) {
                        cartTitle.textContent = `Your Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
                        emptyCartImage.style.display = 'none';
                        emptyCartMessage.style.display = 'none';

                        cart.forEach((item, index) => {
                            const cartItem = document.createElement('div');
                            cartItem.className = 'cart-item';
                            cartItem.style.borderBottom = '1px solid hsl(30, 18%, 87%)'; // Add bottom border
                            cartItem.style.padding = '10px 0'; // Padding for 
                            const totalItemPrice = (item.price * item.quantity).toFixed(2);
                            cartItem.innerHTML = `
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <p style="margin: 0; font-weight: bold;">${item.name}</p>
                                        <p style="margin: 0; font-weight: normal;">$${item.price.toFixed(2)} x ${item.quantity} = $${totalItemPrice}</p>
                                    </div>
                                    <button class="remove-item" data-index="${index}">
                                        <img src="assets/images/icon-remove-item.svg" alt="Remove">
                                    </button>
                                </div>
                            `;
                            cartItemsContainer.appendChild(cartItem);
                        });

                        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
                        subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
                        subtotalElement.style.display = 'block';
                        confirmOrderButton.style.display = 'block';

                    } else {
                        cartTitle.textContent = 'Your Cart (0)';
                        emptyCartImage.style.display = 'block';
                        emptyCartMessage.style.display = 'block';
                        subtotalElement.style.display = 'none';
                        confirmOrderButton.style.display = 'none';
                    }

                    // Add event listeners for remove buttons
                    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');
                    removeButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const index = button.getAttribute('data-index');
                            removeFromCart(index);
                        });
                    });
                }

                function addToCart(dessert) {
                    const existingItem = cart.find(item => item.name === dessert.name);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ ...dessert, quantity: 1 });
                    }
                    updateCartDisplay();
                }

                function removeFromCart(index) {
                    cart.splice(index, 1);
                    updateCartDisplay();
                }

                cartContainer.querySelector('.confirm-order').addEventListener('click', () => {
                    const orderDetails = cart.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: (item.price * item.quantity).toFixed(2),
                        image: item.image.desktop
                    }));

                    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

                    // Generate confirmation HTML with specified format and images
                    const confirmationHTML = `
                        <div class="confirmation-content">
                            <h2>Order Confirmed</h2>
                            <p style = "margin-bottom: 35px;">We hope you enjoyed your food!</p>
                            <ul>
                                ${orderDetails.map(item => `
                                    <li style="display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; align-items: center;">
                                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px; margin-bottom: 8px;">
                                            <span style="font-weight:normal; font-size:small;" >${item.name}  ${item.quantity}x</span>
                                        </div>
                                        <span style="font-weight:bold;">$${item.total}</span>
                                    </li>
                                `).join('')}
                            </ul>
                            <h3 style= "margin-top: 20px; margin-right: 350px">Order Total: $${totalAmount}</h3>
                            <button class="new-order-button">Start New Order</button>
                        </div>
                    `;

                    // Update confirmation container and show it as a modal
                    confirmationContainer.innerHTML = confirmationHTML;
                    confirmationContainer.style.display = 'flex'; // Use flex to center the modal

                    // Add event listener for the "Start New Order" button
                    document.querySelector('.new-order-button').addEventListener('click', () => {
                        // Reset cart and hide confirmation
                        cart.length = 0;
                        confirmationContainer.style.display = 'none'; // Hide confirmation modal
                        updateCartDisplay(); // Update cart display to reflect empty cart
                    });
                });

            } else {
                console.error('Expected an array, but got:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
        });
});
