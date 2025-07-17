document.addEventListener('DOMContentLoaded', () => {
    const inventoryContainer = document.getElementById('inventory-container');
    const productDetailsContainer = document.getElementById('product-details');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Agrupar contenedores por zona
            const zones = {};
            data.inventory.forEach(item => {
                const zone = item.container.charAt(0);
                if (!zones[zone]) {
                    zones[zone] = [];
                }
                zones[zone].push(item);
            });

            // Renderizar zonas y contenedores
            for (const zone in zones) {
                const zoneElement = document.createElement('div');
                zoneElement.classList.add('zone');
                zoneElement.innerHTML = `<h2>Zona ${zone}</h2>`;

                zones[zone].forEach(item => {
                    const containerElement = document.createElement('div');
                    containerElement.classList.add('container');
                    containerElement.textContent = `Contenedor ${item.container}`;
                    containerElement.addEventListener('click', () => {
                        displayProductDetails(item);
                    });
                    zoneElement.appendChild(containerElement);
                });

                inventoryContainer.appendChild(zoneElement);
            }
        });

    function displayProductDetails(item) {
        productDetailsContainer.classList.remove('hidden');
        productDetailsContainer.innerHTML = `
            <h3>Productos en Contenedor ${item.container}</h3>
            <ul id="product-list">
                ${item.products.map(product => `
                    <li>
                        <strong>Nombre:</strong> ${product.name}<br>
                        <strong>Marca:</strong> ${product.brand}<br>
                        <strong>SKU:</strong> ${product.sku}<br>
                        <strong>Stock:</strong> ${product.stock}
                    </li>
                `).join('')}
            </ul>
        `;
    }
});
