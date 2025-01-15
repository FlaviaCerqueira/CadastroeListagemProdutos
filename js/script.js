const products = [];

function openForm() {
    document.getElementById("productForm").reset();
}

function generateProductCode() {
    return 'P' + Math.floor(Math.random() * 1000000);
}

function addProduct(name, description, value, available) {
    if (products.some(product => product.name === name)) {
        alert("Produto já cadastrado com esse nome.");
        return;
    }

    const product = {
        code: generateProductCode(),
        name,
        description,
        value,
        available
    };
    products.push(product);
    displayProducts();

    document.getElementById("productForm").reset();
}

function displayProducts() {
    const sortedProducts = products.sort((a, b) => a.value - b.value);

    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = '';

    sortedProducts.forEach(product => {
        const row = document.createElement("tr");
        row.setAttribute("data-code", product.code);

        row.innerHTML = `
            <td>${product.code}</td>
            <td><span class="editable" onclick="editProduct(this)">${product.name}</span></td>
            <td><span class="editable" onclick="editProduct(this)">${product.value.toFixed(2)}</span></td>
            <td>
                <button class="action-btn" onclick="enableEdit(this)">Editar</button>
                <button class="delete-btn" onclick="deleteProduct('${product.code}')">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function enableEdit(button) {
    const row = button.closest("tr");
    const nameCell = row.querySelector("td:nth-child(2)");
    const valueCell = row.querySelector("td:nth-child(3)");


    nameCell.innerHTML = `<input type="text" value="${nameCell.textContent.trim()}" class="editable-input">`;
    valueCell.innerHTML = `<input type="number" value="${parseFloat(valueCell.textContent.trim())}" class="editable-input">`;


    button.textContent = "Salvar";
    button.onclick = function() { saveProduct(row); };
}

function saveProduct(row) {
    const nameInput = row.querySelector("td:nth-child(2) input");
    const valueInput = row.querySelector("td:nth-child(3) input");

    const newName = nameInput.value;
    const newValue = parseFloat(valueInput.value);

    const code = row.getAttribute("data-code");

    const product = products.find(p => p.code === code);
    if (product) {
        product.name = newName;
        product.value = newValue;
    }

    displayProducts();
}

function editProduct(span) {
    const input = document.createElement("input");
    input.value = span.textContent;
    span.innerHTML = '';
    span.appendChild(input);

    input.focus();

    input.addEventListener("blur", function() {
        span.textContent = input.value;
    });
}

function deleteProduct(code) {
    const index = products.findIndex(p => p.code === code);
    if (index !== -1) {
        products.splice(index, 1);
    }
    displayProducts();
}

document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const value = parseFloat(document.getElementById("productValue").value);
    const available = document.getElementById("productAvailable").value;

    if (name && description && value && available) {
        addProduct(name, description, value, available);
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

displayProducts();