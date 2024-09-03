document.addEventListener('DOMContentLoaded', function() {
    let products = document.querySelector('.products');
    
    
    async function fetchProducts(url) {
        try {
            let data = await fetch(url);
            let response = await data.json();


            // Clear existing products to avoid duplicates
            products.innerHTML = '';

            response.forEach(product => {
                let description = product.description;
                let title = product.title;
                let price = product.price;
                let id = product.id;

                products.innerHTML += `
                <div class="product" data-id="${id}" data-name="${title}" data-price="${price}">
                    <img src="${product.image}" alt="product" class="product-image" />
                    <div class="product-content">
                        <h2 class="product-title">${title.length > 18 ? title.substring(0, 18).concat(' ...') : title}</h2>
                        <h4 class="product-category">${product.category}</h4>
                        <p class="product-description">${description.length > 80 ? description.substring(0, 80).concat(' ...more') : description}</p>
                        <div class="product-price-container">
                            <h3 class="product-price">${price}</h3>
                            <button class="add-to-cart"><ion-icon name="cart-outline"></ion-icon></button>
                        </div>
                    </div>
                </div>
                `;
            });

            // Attach event listeners after products are added
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    let productElement = this.closest('.product');
                    let id = productElement.getAttribute('data-id');
                    let title = productElement.getAttribute('data-name');
                    let price = parseFloat(productElement.getAttribute('data-price'));
                    
                    addToCart(id, title, price);
                });
            });

        } catch (err) {
            console.log(err);
        }
    }

    function addToCart(id, title, price) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === id);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cartCount = (JSON.parse(localStorage.getItem('cart')) || []).reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    // Initialize cart count
    updateCartCount();

    fetchProducts('https://fakestoreapi.com/products');
});


/////////////testmoinal
let currentTestimonialIndex=0;
const testimonials = document.querySelectorAll('.testimonial');

function showTestimonial(index){
    testimonials.forEach((testimonial,i) =>{
        testimonial.classList.remove('active');
        if(i==index){
            testimonial.classList.add('active');
        }
    });
}
function nextTestimonial(){
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    showTestimonial(currentTestimonialIndex);
}
function prevTestimonial(){
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonialIndex);
}
showTestimonial(currentTestimonialIndex);

//cart
document.addEventListener('DOMContentLoaded', function() {
    function renderCartItems() {
        const cartItemsElement = document.getElementById('cart-items');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsElement.innerHTML = '';

        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
              <td>${item.title}</td>
              <td>
                <button onclick="updateQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button onclick="updateQuantity(${index}, 1)">+</button>
              </td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
              <td><button onclick="removeItem(${index})">Remove</button></td>
            `;

            cartItemsElement.appendChild(row);
        });

        updateTotalPrice();
    }

    function updateQuantity(index, delta) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index].quantity + delta > 0) {
            cart[index].quantity += delta;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    function removeItem(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    function updateTotalPrice() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    }

    function checkout() {
        const total_price=parseFloat(document.getElementById('total-price').textContent);
        if(total_price==0){
        alert('Checkout not implemented.');}
        else{
            window.location.href='index.html';
        }
    }

    window.updateQuantity = updateQuantity; 
    window.removeItem = removeItem; 
    window.checkout=checkout;

    renderCartItems();
});
