let allProducts = [];

// Sayfa ilk y�klendi�inde t�m �r�nleri al
async function loadAllProducts() {
    const apiUrl = `http://127.0.0.1:5000/search?q=`;  // Parametre bo� b�rak�l�rsa t�m �r�nleri al�r

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // HTTP yan�t�n� kontrol et
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        allProducts = await response.json(); // API'den t�m �r�nleri al
        updateTable(allProducts); // Tabloyu t�m �r�nlerle g�ncelle
    } catch (error) {
        console.error('Fetch error:', error.message);
        alert('�r�nleri al�rken bir hata olu�tu. L�tfen tekrar deneyin.');
    }
}

// Sunucudan �r�n arama
async function searchProducts() {
    const query = document.getElementById('searchInput').value.trim(); // Kullan�c�n�n girdi�i sorgu

    if (query === "") {
        updateTable(allProducts); // Arama kutusu bo�sa, t�m �r�nleri g�ster
        return;
    }

    const apiUrl = `http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`; // Sorguyu g�venli hale getir

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // HTTP yan�t�n� kontrol et
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const results = await response.json(); // JSON format�ndaki sonu�lar� al
        updateTable(results); // Tabloyu yeni sonu�larla g�ncelle
    } catch (error) {
        console.error('Fetch error:', error.message);
        alert('�r�nleri ararken bir hata olu�tu. L�tfen tekrar deneyin.');
    }
}

function updateTable(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Eski tabloyu temizle

    if (products.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">Hi� �r�n bulunamad�.</td>`;
        tableBody.appendChild(row);
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');

        // Kategori ad� do�rudan product.CategoryName'den al�n�yor
        const categoryName = product.CategoryName || 'Bilinmiyor';

        row.innerHTML = `
            <td class="product-name">${product.ProductName}</td>
            <td>${product.Description}</td>
            <td><img src="/Urunler/${product.ImageUrl}" width="25px" height="25px" /></td>
            <td>${product.Price}</td>
            <td>${categoryName}</td> <!-- CategoryName burada kullan�l�yor -->
            <td>
                <a href="/Admin/Edit/${product.ProductId}">Edit</a> |
                <a href="/Admin/Details/${product.ProductId}">Details</a> |
                <a href="/Admin/Delete/${product.ProductId}">Delete</a>
            </td>
        `;
        tableBody.appendChild(row); // Yeni sat�rlar� tabloya ekle
    });
}

// Frontend filtreleme (arama kutusuna girilen metinle yerel tabloyu filtreler)
function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase(); // Kullan�c�n�n girdi�i sorgu
    const rows = document.querySelectorAll('#productTableBody tr');

    rows.forEach(row => {
        const productName = row.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(query)) {
            row.style.display = ''; // Sat�r� g�r�n�r yap
        } else {
            row.style.display = 'none'; // Sat�r� gizle
        }
    });
}

// Arama �ubu�unu s�f�rla
function resetFilter() {
    document.getElementById('searchInput').value = ''; // Arama �ubu�unu temizle
    updateTable(allProducts); // T�m �r�nleri yeniden getir
}

// Sayfa y�klendi�inde t�m �r�nleri getir
document.addEventListener('DOMContentLoaded', function () {
    loadAllProducts(); // Sayfa y�klendi�inde t�m �r�nleri getir
    document.getElementById('searchInput').addEventListener('input', filterProducts); // Arama kutusunu dinle
});
