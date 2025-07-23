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

    // Ordena las zonas alfabéticamente
    const zonasOrdenadas = Object.keys(zonas).sort();

    for (const zona of zonasOrdenadas) {
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
        productsList.innerHTML = '<tr><td colspan="3">Sin productos</td></tr>';
    } else {
        productos.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.nombre}</td>
                <td>${product.marca}</td>
                <td>${product.sku}</td>
            `;
            row.dataset.producto = JSON.stringify(product);
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
                <p><strong>Zona:</strong> ${prod.zona}</p>
                <p><strong>Contenedor:</strong> ${prod.contenedor}</p>
            </div>
        `).join('');
    } else {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `<div class="search-card"><p>No se encontró ningún producto.</p></div>`;
    }
}

// Formulario para agregar producto sin stock
document.getElementById('add-product-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const sku = document.getElementById('sku').value.trim();
    const zona = document.getElementById('zona').value.trim();
    const contenedor = document.getElementById('contenedor').value.trim();
    const msg = document.getElementById('add-product-msg');

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
    if (!contenedor.startsWith(zona) || !/\d/.test(contenedor)) {
        msg.textContent = 'El contenedor debe comenzar con la zona y contener al menos un número (ej: "A1", "B2", "1A").';
        msg.style.color = 'red';
        return;
    }

    const productos = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(sku)}`).then(res => res.json());
    const existente = productos.find(p => p.zona === zona && p.contenedor === contenedor && p.sku === sku);

    if (existente) {
        msg.textContent = 'Ya existe un producto con ese SKU en esa zona y contenedor.';
        msg.style.color = 'red';
        return;
    } else {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, marca, sku, zona, contenedor })
        });
        if (res.ok) {
            msg.textContent = 'Producto agregado correctamente.';
            msg.style.color = '#0077b6';
            this.reset();
            renderZones();
            mostrarNotificacion('Producto agregado correctamente', '#28a745');
        } else {
            msg.textContent = 'Error al agregar producto.';
            msg.style.color = 'red';
            mostrarNotificacion('Error al agregar producto.', '#d90429');
        }
    }
});

// Editar producto (sin stock)
async function editProduct(id) {
    const nombre = document.getElementById(`edit-nombre-${id}`).value.trim();
    const marca = document.getElementById(`edit-marca-${id}`).value.trim();
    const sku = document.getElementById(`edit-sku-${id}`).value.trim();
    const zona = document.getElementById(`edit-zona-${id}`).value.trim();
    const contenedor = document.getElementById(`edit-contenedor-${id}`).value.trim();

    if (!nombre || !marca || !sku || !zona || !contenedor) {
        mostrarNotificacion('Todos los campos deben estar completos.', '#d90429');
        return;
    }
    if (!contenedor.startsWith(zona) || !/\d/.test(contenedor)) {
        mostrarNotificacion('El contenedor debe comenzar con la zona y contener al menos un número (ej: "A1", "B2", "1A").', '#d90429');
        return;
    }

    const productos = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(sku)}`).then(res => res.json());
    const duplicado = productos.find(p => p.zona === zona && p.contenedor === contenedor && p.sku === sku && p._id !== id);
    if (duplicado) {
        mostrarNotificacion('Ya existe otro producto con esa zona, contenedor y SKU.', '#d90429');
        return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, marca, sku, zona, contenedor })
    });
    if (response.ok) {
        mostrarNotificacion('Producto actualizado', '#28a745');
        document.getElementById('delete-search-input').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        renderZones();
    } else {
        const error = await response.json();
        mostrarNotificacion(error.error || 'Error al actualizar el producto.', '#d90429');
    }
}

function showAddProduct() {
    document.getElementById('add-product-container').classList.remove('hidden');
    document.getElementById('zones-container').classList.add('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.add('hidden');
    document.getElementById('mapa-galpon-container').classList.add('hidden');
    
    // Actualizar navbar
    updateNavbar('agregar');
}

function showInventario() {
    document.getElementById('add-product-container').classList.add('hidden');
    document.getElementById('zones-container').classList.remove('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.add('hidden');
    document.getElementById('mapa-galpon-container').classList.add('hidden');
    
    // Actualizar navbar
    updateNavbar('inventario');
    renderZones();
}

function showMapaGalpon() {
    document.getElementById('add-product-container').classList.add('hidden');
    document.getElementById('zones-container').classList.add('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.add('hidden');
    document.getElementById('mapa-galpon-container').classList.remove('hidden');
    
    // Actualizar navbar
    updateNavbar('mapa');
    renderMapaGalpon();
}

function updateNavbar(activeSection) {
    // Remover clase active de todos los items
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Remover clase active del logo
    document.querySelector('.navbar-logo').classList.remove('active');
    
    // Agregar clase active al item correspondiente
    const navItems = document.querySelectorAll('.navbar-item');
    switch(activeSection) {
        case 'inventario':
            // El logo será el activo para inventario
            document.querySelector('.navbar-logo').classList.add('active');
            break;
        case 'agregar':
            navItems[0].classList.add('active'); // Ahora es el primer item
            break;
        case 'editar':
            navItems[1].classList.add('active'); // Ahora es el segundo item
            break;
        case 'mapa':
            navItems[2].classList.add('active'); // Ahora es el tercer item
            break;
    }
}

function showDeleteProduct() {
    document.getElementById('add-product-container').classList.add('hidden');
    document.getElementById('zones-container').classList.add('hidden');
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('search-result').classList.add('hidden');
    document.getElementById('delete-product-container').classList.remove('hidden');
    document.getElementById('mapa-galpon-container').classList.add('hidden');
    
    // Actualizar navbar
    updateNavbar('editar');
}

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

async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    mostrarNotificacion('Producto eliminado', '#d90429');
    document.getElementById('delete-search-input').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    renderZones();
}
function triggerDeleteSearch() {
    const input = document.getElementById('delete-search-input');
    const event = new KeyboardEvent('keydown', {key: 'Enter'});
    input.dispatchEvent(event);
}

function mostrarNotificacion(mensaje, color = "#0077b6") {
    const noti = document.getElementById('notificacion');
    noti.textContent = mensaje;
    noti.style.background = color;
    noti.style.display = 'block';
    setTimeout(() => {
        noti.style.display = 'none';
    }, 2200);
}
document.getElementById('contenedor').addEventListener('input', function() {
    const zona = document.getElementById('zona').value.trim().toUpperCase();
    let valor = this.value.trim();

    if (zona && valor && !valor.toUpperCase().startsWith(zona)) {
        if (/^\d+$/.test(valor)) {
            this.value = zona + valor;
        }
    }
});
document.getElementById('zona').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

// Función para renderizar el mapa del galpón con zonas y contenedores
async function renderMapaGalpon() {
    try {
        const productos = await fetch(API_URL).then(res => res.json());
        const marcadoresContainer = document.getElementById('marcadores-container');
        marcadoresContainer.innerHTML = '';
        
        // Obtener todas las zonas y contenedores únicos
        const zonasMap = new Map();
        const contenedoresMap = new Map();
        
        productos.forEach(producto => {
            const zonaKey = producto.zona;
            const contenedorKey = `${producto.zona}-${producto.contenedor}`;
            
            if (!zonasMap.has(zonaKey)) {
                zonasMap.set(zonaKey, {
                    zona: producto.zona,
                    contenedores: new Set()
                });
            }
            
            zonasMap.get(zonaKey).contenedores.add(producto.contenedor);
            
            if (!contenedoresMap.has(contenedorKey)) {
                contenedoresMap.set(contenedorKey, {
                    zona: producto.zona,
                    contenedor: producto.contenedor,
                    productos: []
                });
            }
            
            contenedoresMap.get(contenedorKey).productos.push(producto);
        });
        
        // Posiciones predefinidas para las zonas (puedes ajustar estas coordenadas)
        const posicionesZonas = {
            'A': { top: '15%', left: '10%' },
            'B': { top: '15%', left: '50%' },
            'C': { top: '55%', left: '10%' },
            'D': { top: '55%', left: '50%' },
            'E': { top: '80%', left: '25%' },
            'F': { top: '15%', left: '85%' }
        };
        
        // Renderizar TODAS las zonas predefinidas (aunque no tengan productos)
        Object.keys(posicionesZonas).forEach(zonaKey => {
            const zonaData = zonasMap.get(zonaKey) || { zona: zonaKey, contenedores: new Set() };
            const marcadorZona = document.createElement('div');
            marcadorZona.className = 'marcador-zona';
            marcadorZona.textContent = `Zona ${zonaKey}`;
            marcadorZona.title = `Zona ${zonaKey} - ${zonaData.contenedores.size} contenedores`;
            
            // Aplicar posición
            const posicion = posicionesZonas[zonaKey] || { top: '50%', left: '50%' };
            marcadorZona.style.top = posicion.top;
            marcadorZona.style.left = posicion.left;
            
            // Agregar evento de clic para mostrar información
            marcadorZona.addEventListener('click', () => {
                const mensaje = zonaData.contenedores.size > 0 
                    ? `Zona ${zonaKey} - ${zonaData.contenedores.size} contenedores`
                    : `Zona ${zonaKey} - Sin productos`;
                mostrarNotificacion(mensaje, '#dc3545');
            });
            
            marcadoresContainer.appendChild(marcadorZona);
        });
        
        // Renderizar contenedores (posiciones relativas a las zonas)
        contenedoresMap.forEach((contenedorData, contenedorKey) => {
            const marcadorContenedor = document.createElement('div');
            marcadorContenedor.className = 'marcador-contenedor';
            marcadorContenedor.textContent = contenedorData.contenedor;
            marcadorContenedor.title = `${contenedorData.zona}${contenedorData.contenedor} - ${contenedorData.productos.length} productos`;
            
            // Calcular posición del contenedor cerca de su zona
            const zonaPos = posicionesZonas[contenedorData.zona] || { top: '50%', left: '50%' };
            const offsetX = (parseInt(contenedorData.contenedor) - 1) * 6; // Separación horizontal
            const offsetY = Math.floor((parseInt(contenedorData.contenedor) - 1) / 3) * 8; // Separación vertical cada 3 contenedores
            
            marcadorContenedor.style.top = `calc(${zonaPos.top} + ${offsetY}% + 40px)`;
            marcadorContenedor.style.left = `calc(${zonaPos.left} + ${offsetX}%)`;
            
            // Agregar evento de clic para mostrar productos
            marcadorContenedor.addEventListener('click', () => {
                const productosInfo = contenedorData.productos.map(p => `${p.nombre} (${p.sku})`).join(', ');
                mostrarNotificacion(`${contenedorData.zona}${contenedorData.contenedor}: ${productosInfo}`, '#28a745');
            });
            
            marcadoresContainer.appendChild(marcadorContenedor);
        });
        
    } catch (error) {
        console.error('Error al cargar el mapa del galpón:', error);
        mostrarNotificacion('Error al cargar el mapa del galpón', '#d90429');
    }
}

// Inicialización
showInventario();