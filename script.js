const products = [
  {id:101,name:"Olive Embroidered Co-ord Set",cat:"Suits",price:899,badge:"NEW",image:"olive-set.jpg"},
  {id:102,name:"Berry Floral Co-ord Set",cat:"Suits",price:899,badge:"NEW",image:"berry-set.jpg"},
  {id:103,name:"Pink Floral Printed Suit Set",cat:"Suits",price:899,badge:"BESTSELLER",image:"pink-floral-set.jpg"},
  {id:104,name:"Plum Leaf Print Co-ord Set",cat:"Suits",price:899,badge:"NEW",image:"plum-leaf-set.jpg"},
  {id:105,name:"Ivory Floral Printed Suit Set",cat:"Suits",price:899,badge:"",image:"ivory-floral-set.jpg"},
  {id:106,name:"Brown Printed Co-ord Set",cat:"Suits",price:899,badge:"",image:"brown-print-set.jpg"}
];

let cart = JSON.parse(localStorage.getItem("kaynatCart") || "[]");
let selectedCategory = "All";

function money(n){return n.toLocaleString("en-IN")}

function setCategory(cat){
  selectedCategory=cat;
  document.getElementById("categoryFilter").value=cat;
  renderProducts();
}

function toggleSearch(){
  const bar=document.getElementById("searchBar");
  bar.classList.toggle("open");
  if(bar.classList.contains("open")) document.getElementById("searchInput").focus();
}

function renderProducts(){
  const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
  const cat=document.getElementById("categoryFilter")?.value||selectedCategory;
  const sort=document.getElementById("sortFilter")?.value||"featured";

  let list=products.filter(p=>
    (cat==="All"||p.cat===cat) &&
    (p.name+" "+p.cat).toLowerCase().includes(q)
  );

  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);

  document.getElementById("products").innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-image real-product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button class="wish" onclick="this.textContent=this.textContent==='♡'?'♥':'♡'" aria-label="Add to wishlist">♡</button>
      </div>
      <div class="product-info">
        <small>${p.cat}</small>
        <h3>${p.name}</h3>
        <span class="price">₹${money(p.price)}</span>
        <button class="add" onclick="addToCart(${p.id})">Add +</button>
      </div>
    </article>
  `).join("") || "<p>No products found. Try another search.</p>";
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p) return;
  cart.push(p);
  saveCart();
  openCart();
}

function saveCart(){
  localStorage.setItem("kaynatCart",JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  document.getElementById("cartCount").textContent=cart.length;
  const items=document.getElementById("cartItems");

  if(!cart.length){
    items.innerHTML='<div style="padding:40px 0;text-align:center;color:#756b67">Your bag is waiting for something beautiful.</div>';
    document.getElementById("cartTotal").textContent="0";
    return;
  }

  items.innerHTML=cart.map((p,i)=>`
    <div class="cart-item">
      <img class="mini" src="${p.image}" alt="">
      <div>
        <h4>${p.name}</h4>
        <p>₹${money(p.price)}</p>
      </div>
      <button class="remove" onclick="removeItem(${i})">Remove</button>
    </div>
  `).join("");

  document.getElementById("cartTotal").textContent=money(
    cart.reduce((s,p)=>s+p.price,0)
  );
}

function removeItem(i){
  cart.splice(i,1);
  saveCart();
}

function openCart(){
  document.getElementById("cart").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}

function closeCart(){
  document.getElementById("cart").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function checkout(){
  if(!cart.length){
    alert("Please add an item to your bag first.");
    return;
  }
  const total=cart.reduce((s,p)=>s+p.price,0);
  location.href="payment.html?amount="+total;
}

function subscribe(e){
  e.preventDefault();
  document.getElementById("subMsg").textContent="Thank you! You're on the Kaynat list.";
  document.getElementById("email").value="";
}

renderProducts();
updateCart();
