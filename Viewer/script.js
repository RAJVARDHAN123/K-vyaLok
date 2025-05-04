// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnk8ApGJZd85R8eT2ryg72jUd90VEyuAQ",
  authDomain: "test-pro-e6152.firebaseapp.com",
  databaseURL: "https://test-pro-e6152-default-rtdb.firebaseio.com",
  projectId: "test-pro-e6152",
  storageBucket: "test-pro-e6152.appspot.com",
  messagingSenderId: "766763484355",
  appId: "1:766763484355:web:db970872019c63a507ce76"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Load Shayaris from Firebase
function loadShayaris() {
  const isDev = window.localStorage.getItem("logged") === "true";

  database.ref('shayaris').once('value', (snapshot) => {
    const shayaris = snapshot.val();
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = "";

    for (let key in shayaris) {
      const shayari = shayaris[key];
      const carouselItem = document.createElement('div');
      carouselItem.classList.add("card", "swiper-slide");
      const content = document.createElement('div');
      content.classList.add("card-content");
      const des = document.createElement('p');
      des.classList.add("description");
      des.textContent = shayari.text;
      des.style.whiteSpace = 'pre-line';
      const butt = document.createElement('div');
      butt.classList.add("button-group");
      butt.innerHTML=`<button class="button" onclick="download('${shayari.text}')">Download</button>
          ${`<button class="button edit-btn" onclick="edit('${key}')"><i class='e fa fa-pen'></i></button>`}`

      content.appendChild(des);
      content.appendChild(butt);
      carouselItem.appendChild(content);
      carouselInner.appendChild(carouselItem);
    }

    // Initialize Swiper after loading content
    var swiper = new Swiper(".slide-content", {
      slidesPerView: 3,
      spaceBetween: 25,
      loop: true,
      centerSlide: 'true',
      fade: 'true',
      grabCursor: 'true',
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        520: {
          slidesPerView: 2,
        },
        950: {
          slidesPerView: 3,
        },
      },
    });
  });
}

function download(text) {
  window.localStorage.setItem("s001", text);
  window.open("/Download", "_self");
}

function edit(key) {
  window.localStorage.setItem("e01", key);
  window.open("/admin", "_self");
}

// Load Shayaris when the page loads
window.onload = loadShayaris;
