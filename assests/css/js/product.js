
// smooth scroll
$(document).ready(function(){
  

  $(".navbar .nav-link").on('click', function(event) {

      if (this.hash !== "") {

          event.preventDefault();

          let hash = this.hash;

          $('html, body').animate({
              scrollTop: $(hash).offset().top
          }, 700, function(){
              window.location.hash = hash;
          });
      } 
  });
 


})






//api
window.onload = function() {
mostrarIcono(0)
const portfolioContainer = document.querySelector(".portfolio-container");
const itemsContainer = portfolioContainer;
$.ajax({
  //la url que nos interesa
  url: "https://fakestoreapi.com/products",
  method: "GET",
  success: function(products) {
    products.forEach(product => {
      //para no tener una descripcion muy larga
      let descrip = product.description;
      if (descrip.length > 140) {
        descrip = descrip.substring(0, 140) + "...";
      }
      let titulo = product.title.replace("'", " ");
      let titu = titulo.substring(0, 20)
      //crear mi html
      const div = document.createElement("div");
      div.classList.add("col-md-6", "col-lg-4", "new" , product.category.toLowerCase().substr(0, 3));
      div.innerHTML = `
        <div class="portfolio-item">
          <img src="${product.image}" class="img-fluid" alt="${titulo}">
          <div class="content-holder">
            <a class="img-popup" href="${product.image}"></a>
            <div class="text-holder">
              <h6 class="title">${product.title}</h6>
              <p class="subtitle">${descrip}</p>
              <button class="btn btn-primary" onclick="addToCart('${product.id}','${titu}','${product.price}', '${product.image}' )"> $ ${product.price}
              </button>
            </div>
          </div> 
        </div>
      `;
      
      itemsContainer.appendChild(div);

    });
    console.log(products);


    // Agregar evento de filtrado
    
  let t = $(".portfolio-container");
  t.isotope({
      filter: ".new",
      animationOptions: {
          duration: 750,
          easing: "linear",
          queue: !1
      }
  }), $(".filters a").click(function() {
      $(".filters .active").removeClass("active"), $(this).addClass("active");
      let i = $(this).attr("data-filter");
      return t.isotope({
          filter: i,
          animationOptions: {
              duration: 750,
              easing: "linear",
              queue: !1
          }
      }), !1
  }); 
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus, errorThrown);
    portfolioContainer.innerHTML=
    `
    <h6 class="section-title text-center"> La API fakeproducts esta caida u_u </h6>`
  }
});
}
let carrito = [];
let total = 0;
let cart = document.querySelector(".cart-container");
let modelCart = document.querySelector(".modal-carrito");
const closeModalBtn = document.getElementById("close-btn");

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
  modelCart.style.display = "none";
}
});

closeModalBtn.addEventListener("click", () => {
modelCart.style.display = "none";
});

cart.addEventListener("click", () => {
if (modelCart.style.display == "none") {
  modelCart.style.display = "flex";
} else {
  modelCart.style.display = "none";
}
});




function mostrarIcono(cant) {
const cartContainer = document.querySelector('.cart-container');
if (cant > 0) {
const html = `
  <div class="cart-notification">
    <span class="carrito_number">${cant}</span>
    <img src="assets/imgs/shop.svg" alt="">
  </div>
`;
cartContainer.innerHTML = html;
} else {
cartContainer.innerHTML = '';
}
}



toastr.options = {
"closeButton": false,
"debug": false,
"newestOnTop": true,
"progressBar": true,
"positionClass": "toast-bottom-right",
"preventDuplicates": false,
"onclick": null,
"showDuration": "300",
"hideDuration": "1000",
"timeOut": "5000",
"extendedTimeOut": "1000",
"showEasing": "swing",
"hideEasing": "linear",
"showMethod": "fadeIn",
"hideMethod": "fadeOut",
}



function generar_notificacion_carrito(){
toastr.success("Revisa el Carrito de Compras", "Producto agregado!")
}



function addToCart(pid, title, price, image) {
const index = carrito.findIndex(item => item.id === pid);
let priceFloat = parseFloat(price)
if (index !== -1) {
  // Si el producto ya existe en el carrito, actualizamos su cantidad
  carrito[index].cantidad += 1;
} else {
  // Si el producto no existe en el carrito, lo agregamos
  let item = {
    id: pid,
    title: title,
    price: priceFloat,
    image: image,
    cantidad: 1
  };
  carrito.push(item);
}
total += priceFloat;
generar_notificacion_carrito()
actualizarModalCarrito();
console.log(carrito.length)
mostrarIcono(carrito.length)
}


function actualizarModalCarrito() {
let modalCarritoProductos = document.querySelector('.modal-carrito__products');
modalCarritoProductos.innerHTML = '';
if (carrito.length === 0){
  modalCarritoProductos.innerHTML = '<p class="modal-carrito__text">Tu carrito está vacío</p>'; 

}

let carritoHTML = carrito.map(function(item) {
  return `
  <div class="container">
<div class="row">
  <div class="col-md-8">
    <div class="producto-carrito" data-id="${item.id}">
      <div class="row justify-content-between align-items-center">
        <div class="col-md-4">
          <img src="${item.image}" alt="${item.title}" class="img-fluid producto-carrito__imagen">
        </div>
        <div class="col-md-6 align-self-center">
          <h6 class="center producto-carrito__titulo">${item.title}</h6>
          <p class="center producto-carrito__precio">$${(item.price * item.cantidad).toFixed(2)}</p>
        </div>
        <div class="col-md-2">
          <div class="center producto-carrito__cantidad">
            <button class="btn-cantidad btn btn-sm btn-outline-secondary" data-id="${item.id}" data-action="disminuir">-</button>
            <span class="producto-carrito__cantidad-num">${item.cantidad}</span>
            <button class="btn-cantidad btn btn-sm btn-outline-secondary" data-id="${item.id}" data-action="aumentar">+</button>
            <button class="producto-carrito__eliminar btn btn-sm btn-warning btn-hover-warning p-2" id="close-btn" data-id="${item.id}"> 
            X
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<hr>
</div>

  `;
});
let absTotal = Math.abs(total).toFixed(2)
let totalHTML = `
<div class="row">
  <div class="col-md-8">
    <h4>Total: $<span id="total">${absTotal}</span></h4>
  </div>
  <div class="col-md-4">
    <button class="btn btn-primary" id="generar-resumen" onclick="generarPDF()">Generar resumen</button>
  </div>

</div>
`;
if(absTotal>0){
  modalCarritoProductos.insertAdjacentHTML('beforeend', carritoHTML.join('')+totalHTML);
}else{
  modalCarritoProductos.insertAdjacentHTML('beforeend', carritoHTML.join(''));
}
}

let modalCarritoProductos = document.querySelector('.modal-carrito__products');

modalCarritoProductos.addEventListener('click', function(event) {
let target = event.target;
if (target.classList.contains('btn-cantidad')) {
  let id = target.getAttribute('data-id');
  let action = target.getAttribute('data-action');
  let item = carrito.find(function(element) {
    return element.id == id;
  });
  if (action == 'aumentar') {
    item.cantidad += 1;
    total += item.price
  } else if (action == 'disminuir') {
    item.cantidad -= 1;
    total -= item.price;
    mostrarIcono(carrito.length)
    if (item.cantidad < 1) {
      let index = carrito.indexOf(item);
      if (index > -1) {
        carrito.splice(index, 1);
        mostrarIcono(carrito.length)
      }
    }
  }
  actualizarModalCarrito();
  mostrarIcono(carrito.length)
} else if (target.classList.contains('producto-carrito__eliminar') ) {
  let id = target.getAttribute('data-id');
  let item = carrito.find(function(element) {
    mostrarIcono(carrito.length)
    return element.id == id;
  });
  let index = carrito.indexOf(item);
  if (index > -1) {
    mostrarIcono(carrito.length)
    carrito.splice(index, 1);
    total -= item.price * item.cantidad
}
actualizarModalCarrito();
mostrarIcono(carrito.length)
}
});

function actualizarModalCarrito2() {
let modalCarritoProductos = document.querySelector('.modal-carrito__products');
modalCarritoProductos.innerHTML = '';
carrito.forEach(function(producto) {
  let productoHTML = `
    <div class="producto">
      <p>${producto.title}</p>
      <p>$${producto.price}</p>
    </div>
  `;
  modalCarritoProductos.insertAdjacentHTML('beforeend', productoHTML);
});
}


function generarPDF() {
const doc = new jsPDF();

// Logo
const img = new Image();
img.src = 'https://i.ibb.co/9WQkZ10/logo.png';
doc.addImage(img, 'PNG', 10, 10, 50, 40);

// Title
doc.setFontSize(24);
doc.text('Resumen de compras', 70, 30);

// Table headers
const headers = ['Producto', 'Cantidad', 'Precio'];
const tableData = [headers];

// Table rows
let total = 0;
carrito.forEach((producto) => {
  const { title, price, cantidad } = producto;
  const subtotal = price * cantidad;
  total += subtotal;

  const row = [
    title,
    cantidad.toString(),
    `$${price.toFixed(2)}`,
  ];
  tableData.push(row);
});

// Add table
const startY = 60;
const margin = 10;
const cellWidth = (doc.internal.pageSize.getWidth() - margin * 2) / headers.length;
doc.autoTable({
  startY,
  head: [headers],
  body: tableData.slice(1),
  margin: { top: margin, right: margin, bottom: margin, left: margin },
  tableWidth: 'auto',
  columnWidth: cellWidth,
  didDrawPage: function (data) {
    // Orange line
    doc.setLineWidth(2);
    doc.setDrawColor(255, 110, 66);
    doc.line(data.settings.margin.left, data.cursor.y + 10, doc.internal.pageSize.getWidth() - data.settings.margin.right, data.cursor.y + 10);

    // Total
    doc.setFontSize(20);
    doc.setFontStyle('bold');
    const totalPosition = data.cursor.y + 30;
    doc.text(`Total: $${total.toFixed(2)}`, data.settings.margin.left, totalPosition);
  },
  headStyles: {
    fillColor: [255, 110, 66]
  }
});

// Save file
doc.save('resumen_compras.pdf');
}

const validationRules = {
  name: {
    presence: true,
    length: { minimum: 3 }
  },
  email: {
    presence: true,
    email: true
  },
  subject: {
    presence: true,
    length: { minimum: 3, maximum: 20 }
  },
  message: {
    presence: true,
    length: { minimum: 3, maximum: 400 }
  }
};

const form = document.querySelector('#contact-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  validateForm();
});

toastr.options = {
  positionClass: 'toast-bottom-right',
  preventDuplicates: true,
  closeButton: true
};

function validateForm() {
  const formData = {
    name: form.querySelector('[name="name"]').value,
    email: form.querySelector('[name="email"]').value,
    subject: form.querySelector('[name="subject"]').value,
    message: form.querySelector('[name="message"]').value
  };

  const validationErrors = validate(formData, validationRules);

  if (validationErrors) {
    Object.keys(validationErrors).forEach(function (field) {
      const errorMessages = validationErrors[field].join('<br>');
      toastr.error(errorMessages, `Error de validación en ${field}`);
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Exito',
      text: 'El mensaje fue enviado correctamente',
    });
  }
}

