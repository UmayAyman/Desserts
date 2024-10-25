document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching data...");

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
                });

                // Add the cart container
                const cartContainer = document.createElement('div');
                cartContainer.className = 'cartcontainer';
                cartContainer.innerHTML = `
                    <h3>Your Cart (0)</h3>
                    <img src="./assets/images/illustration-empty-cart.svg" alt="Cart is empty">
                    <p>Your added items will appear here</p>
                `;
                dessertsGrid.appendChild(cartContainer);
            } else {
                console.error('Expected an array, but got:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
        });
});
