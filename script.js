document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching data...");

    fetch('http://127.0.0.1:8081/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Log the fetched data
            
            const dessertsContainer = document.getElementById('desserts-container');

            // Check if data is an array
            if (Array.isArray(data)) {
                data.forEach(dessert => {
                    const dessertDiv = document.createElement('div');
                    dessertDiv.innerHTML = `
                        <h2>${dessert.name}</h2>
                        <img src="${dessert.image.thumbnail}" alt="${dessert.name}">
                        <p>Category: ${dessert.category}</p>
                        <p>Price: $${dessert.price.toFixed(2)}</p>
                    `;
                    dessertsContainer.appendChild(dessertDiv);
                });
            } else {
                console.error('Expected an array, but got:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error.message); // Log a more descriptive error
        });
});
