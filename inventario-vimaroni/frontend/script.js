const API_URL = 'http://localhost:3001/api/productos';

function toggleSearchBar() {
    const searchForm = document.getElementById('search-form');
    searchForm.classList.toggle('hidden');
    if (!searchForm.classList.contains('hidden')) {
        document.getElementById('search-input').focus();
    }
}
document.getElementById('search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchProduct();
    }
});

// Render zonas y contenedores desde la BD
async function renderZones() {
    const zonesContainer = document.getElementById('zones-container');
    zonesContainer.innerHTML = '';
    const productos = await fetch(API_URL).then(res => res.json());

    // Agrupa productos por zona y contenedor
    const zonas = {};
    productos.forEach(prod => {
        if (!zonas[prod.zona]) zonas[prod.zona] = {};
        if (!zonas[prod.zona][prod.contenedor]) zonas[prod.zona][prod.contenedor] = [];
        zonas[prod.zona][prod.contenedor].push(prod);
    });

    if (productos.length === 0) {
        zonesContainer.innerHTML = '<p style="color:#0077b6;text-align:center;font-size:1.2rem;">No hay productos en el inventario.</p>';
        return;
    }

    for (const zona in zonas) {
        const zoneDiv = document.createElement('div');
        zoneDiv.className = 'zone';
        const nombreZona = zona.toLowerCase().includes('zona') ? zona : `Zona ${zona}`;
        zoneDiv.innerHTML = `<h2>${nombreZona}</h2>`;
        for (const contenedor in zonas[zona]) {
            const containerBtn = document.createElement('button');
            containerBtn.textContent = contenedor;
            containerBtn.onclick = () => showProducts(zona, contenedor, zonas[zona][contenedor]);
            zoneDiv.appendChild(containerBtn);
        }
        zonesContainer.appendChild(zoneDiv);
    }
}

function showProducts(zona, contenedor, productos) {
    document.getElementById('product-details').classList.remove('hidden');
    document.getElementById('container-name').textContent = contenedor;
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    if (!productos || productos.length === 0) {
        productsList.innerHTML = '<tr><td colspan="4">Sin productos</td></tr>';
    } else {
        productos.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.nombre}</td>
                <td>${product.marca}</td>
                <td>${product.sku}</td>
                <td>${product.stock}</td>
            `;
            productsList.appendChild(row);
        });
    }
}

function closeDetails() {
    document.getElementById('product-details').classList.add('hidden');
}

// Buscador conectado al backend
async function searchProduct() {
    const query = document.getElementById('search-input').value.trim();
    const resultDiv = document.getElementById('search-result');
    resultDiv.innerHTML = '';
    if (!query) {
        resultDiv.classList.add('hidden');
        return;
    }
    const productos = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(query)}`).then(res => res.json());
    if (productos.length > 0) {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = productos.map(prod => `
            <div class="search-card">
                <h3>Resultado encontrado:</h3>
                <p><strong>Nombre:</strong> ${prod.nombre}</p>
                <p><strong>Marca:</strong> ${prod.marca}</p>
                <p><strong>SKU:</strong> ${prod.sku}</p>
                <p><strong>Stock:</strong> ${prod.stock}</p>
                <p><strong>Zona:</strong> ${prod.zona}</p>
                <p><strong>Contenedor:</strong> ${prod.contenedor}</p>
            </div>
        `).join('');
    } else {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `<div class="search-card"><p>No se encontró ningún producto.</p></div>`;
    }
}

// Formulario para agregar producto con validaciones y actualización de stock si ya existe
document.getElementById('add-product-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const sku = document.getElementById('sku').value.trim();
    const stock = parseInt(document.getElementById('stock').value, 10);
    const zona = document.getElementById('zona').value.trim();
    const contenedor = document.getElementById('contenedor').value.trim();
    const msg = document.getElementById('add-product-msg');

    // Validaciones bonitas
    if (!nombre) {
        msg.textContent = 'Debes ingresar el nombre del producto.';
        msg.style.color = 'red';
        return;
    }
    if (!marca) {
        msg.textContent = 'Debes ingresar la marca.';
        msg.style.color = 'red';
        return;
    }
    if (!sku) {
        msg.textContent = 'Debes ingresar el SKU.';
        msg.style.color = 'red';
        return;
    }
    if (!zona) {
        msg.textContent = 'Debes ingresar la zona.';
        msg.style.color = 'red';
        return;
    }
    if (!contenedor) {
        msg.textContent = 'Debes ingresar el contenedor.';
        msg.style.color = 'red';
        return;
    }
    if (isNaN(stock) || stock < 0) {
        msg.textContent = 'Debes ingresar un stock válido.';
        msg.style.color = 'red';
        return;
    }
    // Validación: contenedor debe comenzar con la zona y tener al menos un número después
    if (!contenedor.startsWith(zona) || !/\d/.test(contenedor)) {
        msg.textContent = 'El contenedor debe comenzar con la zona y contener al menos un número (ej: "A1", "B2", "1A").';
        msg.style.color = 'red';
        return;
    }

    // Buscar si ya existe un producto con el mismo zona, contenedor y SKU
    const productos = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(sku)}`).then(res => res.json());
    const existente = productos.find(p => p.zona === zona && p.contenedor === contenedor && p.sku === sku);

    if (existente) {
        // Actualiza el stock sumando el nuevo valor
        const nuevoStock = existente.stock + stock;
        const res = await fetch(`${API_URL}/${existente._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...existente, stock: nuevoStock })
        });
        if (res.ok) {
            msg.textContent = 'Stock actualizado correctamente.';
            msg.style.color = '#0077b6';
            this.reset();
            renderZones();
        } else {
            msg.textContent = 'Error al actualizar el stock.';
            msg.style.color = 'red';
        }
    } else {
        // Si no existe, crea uno nuevo
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, marca, sku, stock, zona, contenedor })
        });
        if (res.ok) {
            msg.textContent = 'Producto agregado correctamente.';
            msg.style.color = '#0077b6';
            this.reset();
            renderZones();
        } else {
            msg.textContent = 'Error al agregar producto.';
            msg.style.color = 'red';
        }
    }
});

// Editar producto
async function editProduct(id) {
    const nombre = document.getElementById(`edit-nombre-${id}`).value.trim();
    const marca = document.getElementById(`edit-marca-${id}`).value.trim();
    const sku = document.getElementById(`edit-sku-${id}`).value.trim();
    const stock = parseInt(document.getElementById(`edit-stock-${id}`).value, 10);
    const zona = document.getElementById(`edit-zona-${id}`).value.trim();
    const contenedor = document.getElementById(`edit-contenedor-${id}`).value.trim();

    // Validaciones para editar
    if (!nombre || !marca || !sku || !zona || !contenedor || isNaN(stock) || stock < 0) {
        alert('Todos los campos deben estar completos y el stock debe ser válido.');
        return;
    }
    if (!contenedor.startsWith(zona) || !/\d/.test(contenedor)) {
        alert('El contenedor debe comenzar con la zona y contener al menos un número (ej: "A1", "B2", "1A").');
        return;
    }

    // Verifica si ya existe otro producto con ese zona, contenedor y SKU (y distinto ID)
    const productos = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(sku)}`).then(res => res.json());
    const duplicado = productos.find(p => p.zona === zona && p.contenedor === contenedor && p.sku === sku && p._id !== id);
    if (duplicado) {
        alert('Ya existe otro producto con esa zona, contenedor y SKU.');
        return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, marca, sku, stock, zona, contenedor })
    });
    if (response.ok) {
        alert('Producto actualizado');
        document.getElementById('delete-search-input').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        renderZones();
    } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar el producto.');
    }
}

function showAddProduct() {
    document.getElementById('add-product-container').classList.remove('hidden');
    document.getElementById('zones-container').classList.add('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.add('hidden');
}

function showInventario() {
    document.getElementById('add-product-container').classList.add('hidden');
    document.getElementById('zones-container').classList.remove('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.add('hidden');
    renderZones();
}

// Mostrar la sección de eliminar productos
function showDeleteProduct() {
    document.getElementById('add-product-container').classList.add('hidden');
    document.getElementById('zones-container').classList.add('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.remove('hidden');
}

// Buscar productos para eliminar/editar
document.getElementById('delete-search-input').addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        const resultDiv = document.getElementById('delete-search-result');
        resultDiv.innerHTML = '';
        if (!query) return;
        const productos = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(query)}`).then(res => res.json());
        if (productos.length > 0) {
            resultDiv.innerHTML = productos.map(prod => `
                <div class="delete-card">
                    <p><strong>Nombre:</strong> <input type="text" value="${prod.nombre}" id="edit-nombre-${prod._id}"></p>
                    <p><strong>Marca:</strong> <input type="text" value="${prod.marca}" id="edit-marca-${prod._id}"></p>
                    <p><strong>SKU:</strong> <input type="text" value="${prod.sku}" id="edit-sku-${prod._id}"></p>
                    <p><strong>Stock:</strong> <input type="number" value="${prod.stock}" id="edit-stock-${prod._id}"></p>
                    <p><strong>Zona:</strong> <input type="text" value="${prod.zona}" id="edit-zona-${prod._id}"></p>
                    <p><strong>Contenedor:</strong> <input type="text" value="${prod.contenedor}" id="edit-contenedor-${prod._id}"></p>
                    <button onclick="editProduct('${prod._id}')">Guardar cambios</button>
                    <button onclick="deleteProduct('${prod._id}')">Eliminar producto</button>
                </div>
            `).join('');
        } else {
            resultDiv.innerHTML = `<div class="delete-card"><p>No se encontró ningún producto.</p></div>`;
        }
    }
});

// Eliminar producto
async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('Producto eliminado');
    document.getElementById('delete-search-input').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    renderZones();
}
function triggerDeleteSearch() {
    const input = document.getElementById('delete-search-input');
    const event = new KeyboardEvent('keydown', {key: 'Enter'});
    input.dispatchEvent(event);
}