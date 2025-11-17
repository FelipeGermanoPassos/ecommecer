// Dados mockados dos produtos
const products = [
  {
    id: 1,
    name: "Notebook Gamer",
    description: "Intel Core i7, 16GB RAM, RTX 3060",
    price: 4999.99,
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
  },
  {
    id: 2,
    name: "Smartphone Premium",
    description: "128GB, Câmera 48MP, 5G",
    price: 2499.99,
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
  },
  {
    id: 3,
    name: "Headphone Bluetooth",
    description: "Cancelamento de ruído, 30h bateria",
    price: 599.99,
    category: "Áudio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    id: 4,
    name: "Smart Watch",
    description: "Monitor cardíaco, GPS, à prova d'água",
    price: 899.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  },
  {
    id: 5,
    name: "Câmera DSLR",
    description: "24MP, 4K Video, Lente 18-55mm",
    price: 3299.99,
    category: "Fotografia",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
  },
  {
    id: 6,
    name: "Tablet 10 polegadas",
    description: "64GB, Wi-Fi + 4G, Android 13",
    price: 1299.99,
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
  },
  {
    id: 7,
    name: "Mouse Gamer RGB",
    description: "12000 DPI, 8 botões programáveis",
    price: 249.99,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  },
  {
    id: 8,
    name: "Teclado Mecânico",
    description: "RGB, Switch Blue, ABNT2",
    price: 449.99,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
  },
  {
    id: 9,
    name: 'Monitor 27" 4K',
    description: "IPS, 144Hz, HDR",
    price: 1899.99,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
  },
  {
    id: 10,
    name: "Webcam Full HD",
    description: "1080p, Microfone integrado",
    price: 349.99,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400",
  },
  {
    id: 11,
    name: "Caixa de Som Portátil",
    description: "Bluetooth 5.0, 20W, IPX7",
    price: 299.99,
    category: "Áudio",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
  },
  {
    id: 12,
    name: "SSD 1TB NVMe",
    description: "Leitura 3500MB/s, M.2",
    price: 599.99,
    category: "Armazenamento",
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400",
  },
];

// Estado da aplicação
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let filters = {
  categories: [],
  minPrice: 0,
  maxPrice: 5000,
};
let showingFavorites = false;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeFilters();
  renderProducts();
  updateCartCount();
  updateFavoritesCount();
  attachEventListeners();
});

// Inicializar filtros de categoria
function initializeFilters() {
  const categories = [...new Set(products.map((p) => p.category))];
  const categoryFilters = document.getElementById("categoryFilters");

  // Adicionar filtro "Todas"
  categoryFilters.innerHTML = `
        <label>
            <input type="checkbox" value="all" checked onchange="handleCategoryFilter(this)"> Todas
        </label>
    `;

  // Adicionar categorias individuais
  categories.forEach((category) => {
    const label = document.createElement("label");
    label.innerHTML = `
            <input type="checkbox" value="${category}" onchange="handleCategoryFilter(this)"> ${category}
        `;
    categoryFilters.appendChild(label);
  });
}

// Manipular filtro de categoria
function handleCategoryFilter(checkbox) {
  const allCheckbox = document.querySelector('input[value="all"]');

  if (checkbox.value === "all") {
    // Se "Todas" foi marcado, desmarcar outras
    if (checkbox.checked) {
      document
        .querySelectorAll('#categoryFilters input[type="checkbox"]')
        .forEach((cb) => {
          if (cb.value !== "all") cb.checked = false;
        });
      filters.categories = [];
    }
  } else {
    // Se outra categoria foi marcada, desmarcar "Todas"
    allCheckbox.checked = false;

    // Atualizar array de categorias
    if (checkbox.checked) {
      filters.categories.push(checkbox.value);
    } else {
      filters.categories = filters.categories.filter(
        (c) => c !== checkbox.value
      );
    }

    // Se nenhuma categoria selecionada, marcar "Todas"
    if (filters.categories.length === 0) {
      allCheckbox.checked = true;
    }
  }

  renderProducts();
}

// Renderizar produtos
function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  let productsToShow = showingFavorites
    ? products.filter((p) => favorites.includes(p.id))
    : products;

  // Aplicar filtros
  productsToShow = productsToShow.filter((product) => {
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    const priceMatch =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return categoryMatch && priceMatch;
  });

  if (productsToShow.length === 0) {
    productGrid.innerHTML = `
            <div class="cart-empty" style="grid-column: 1/-1;">
                <i class="fas fa-box-open"></i>
                <p>Nenhum produto encontrado</p>
            </div>
        `;
    return;
  }

  productGrid.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="product-card">
            <img src="${product.image}" alt="${
        product.name
      }" class="product-image">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="favorite-btn ${
                  favorites.includes(product.id) ? "active" : ""
                }" 
                        onclick="toggleFavorite(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="add-to-cart-btn" onclick="addToCart(${
                  product.id
                })">
                    <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Adicionar ao carrinho
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  showNotification("Produto adicionado ao carrinho!");
}

// Toggle favorito
function toggleFavorite(productId) {
  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
  } else {
    favorites.push(productId);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCount();
  renderProducts();
}

// Atualizar contador do carrinho
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

// Atualizar contador de favoritos
function updateFavoritesCount() {
  document.getElementById("favoritesCount").textContent = favorites.length;
}

// Salvar carrinho
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Renderizar carrinho
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    cartTotal.textContent = "R$ 0,00";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${
                      item.id
                    }, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${
                      item.id
                    }, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar quantidade
function updateQuantity(productId, change) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCart();
      updateCartCount();
    }
  }
}

// Remover do carrinho
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

// Mostrar notificação
function showNotification(message) {
  // Criar elemento de notificação simples
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Event Listeners
function attachEventListeners() {
  // Botão do carrinho
  document.getElementById("cartBtn").addEventListener("click", () => {
    renderCart();
    document.getElementById("cartModal").classList.add("active");
  });

  // Fechar carrinho
  document.getElementById("closeCart").addEventListener("click", () => {
    document.getElementById("cartModal").classList.remove("active");
  });

  // Botão de checkout
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    document.getElementById("cartModal").classList.remove("active");
    openCheckout();
  });

  // Botão de favoritos
  document.getElementById("favoritesBtn").addEventListener("click", () => {
    showingFavorites = true;
    document.getElementById("showFavorites").innerHTML =
      '<i class="fas fa-th"></i> Ver Todos';
    renderProducts();
  });

  // Toggle ver favoritos/todos
  document.getElementById("showFavorites").addEventListener("click", () => {
    showingFavorites = !showingFavorites;
    const btn = document.getElementById("showFavorites");
    btn.innerHTML = showingFavorites
      ? '<i class="fas fa-th"></i> Ver Todos'
      : '<i class="fas fa-heart"></i> Ver Favoritos';
    renderProducts();
  });

  // Filtro de preço mínimo
  document.getElementById("minPrice").addEventListener("input", (e) => {
    filters.minPrice = parseInt(e.target.value);
    document.getElementById("minPriceValue").textContent = filters.minPrice;
    renderProducts();
  });

  // Filtro de preço máximo
  document.getElementById("maxPrice").addEventListener("input", (e) => {
    filters.maxPrice = parseInt(e.target.value);
    document.getElementById("maxPriceValue").textContent = filters.maxPrice;
    renderProducts();
  });

  // Limpar filtros
  document.getElementById("clearFilters").addEventListener("click", () => {
    filters = {
      categories: [],
      minPrice: 0,
      maxPrice: 5000,
    };
    document.getElementById("minPrice").value = 0;
    document.getElementById("maxPrice").value = 5000;
    document.getElementById("minPriceValue").textContent = 0;
    document.getElementById("maxPriceValue").textContent = 5000;
    document.querySelector('input[value="all"]').checked = true;
    document
      .querySelectorAll('#categoryFilters input[type="checkbox"]')
      .forEach((cb) => {
        if (cb.value !== "all") cb.checked = false;
      });
    renderProducts();
  });

  // Fechar modal ao clicar fora
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

// Abrir checkout
function openCheckout() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("checkoutTotal").textContent = `R$ ${total.toFixed(
    2
  )}`;
  document.getElementById("checkoutModal").classList.add("active");
}

// Fechar checkout
document.getElementById("closeCheckout").addEventListener("click", () => {
  document.getElementById("checkoutModal").classList.remove("active");
});

// Formulário de checkout
document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Simular processamento
  const orderNumber = Math.floor(Math.random() * 1000000);
  document.getElementById("orderNumber").textContent = orderNumber;

  // Limpar carrinho
  cart = [];
  saveCart();
  updateCartCount();

  // Fechar checkout e mostrar sucesso
  document.getElementById("checkoutModal").classList.remove("active");
  document.getElementById("successModal").classList.add("active");

  // Limpar formulário
  document.getElementById("checkoutForm").reset();
});

// Fechar modal de sucesso
document.getElementById("closeSuccess").addEventListener("click", () => {
  document.getElementById("successModal").classList.remove("active");
});

// Animações CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
