import {
  setStorage,
  userIcon,
  getStorage,
  translate,
  icons,
} from "./helpers.js";

// ! HTML'den gelenler
const form = document.querySelector("form");
const input = document.querySelector("form #title");
const cancelBtn = document.querySelector("form #cancel");
const noteList = document.querySelector("ul");
const expandBtn = document.querySelector("#checkbox");
const aside = document.querySelector(".wrapper");

// ! Ortak Değişkenler
var map;
var coords = [];
var notes = getStorage("NOTES") || [];
var markerLayer = [];
// ! Olay İzleyicileri

cancelBtn.addEventListener("click", () => {
  form.style.display = "none";
  clearForm();
});

// Kullanıcının konumuna göre haritayı ekrana basma işlemi
function loadMap(coords) {
  // Harita Kurulumu
  map = L.map("map").setView(coords, 13);

  //   Haritanın nasıl gözükeceğini belirler.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  // İmleçleri tutacağımız ayrı bir katman oluşturma
  markerLayer = L.layerGroup().addTo(map);
  //    Kullanıcının bulunduğu konumu gösterme
  L.marker(coords, { icon: userIcon })
    .addTo(map)
    .bindPopup("You are here now!");

  // lokalden gelen notları ekrana basma
  renderNoteList(notes);

  // Haritada bir tıklanma olayını izleme
  map.on("click", onMapClick);
}

// Formun gönderilmesini izleme
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Formun değerlerine erişme
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;
  //   Notlar dizisine bu elemanı ekle
  notes.unshift({
    id: new Date().getTime(),
    title,
    date,
    status,
    coords,
  });
  //    Noteları listele
  renderNoteList(notes);

  // gönderilen elemanları lokale kaydetme

  setStorage(notes);

  //   Formu kapat

  form.style.display = "none";
  clearForm();
});

// İmleci ekrana basar

function renderMark(item) {
  // İmleci oluştur
  L.marker(item.coords)
    // İmleci katmana ekle
    .addTo(markerLayer)
    // Popup ekle
    .bindPopup("You are here!");
  // Popup'ı aç
}

// Notelar Listesini ekrana basar

function renderNoteList(items) {
  // Eski elemanları temizleme
  noteList.innerHTML = "";
  //   Eski imleç temizle
  markerLayer.clearLayers();
  // Her bir eleman için ekrana basma fonk. çalıştıtır
  items.forEach((ele) => {
    // Li elemanı oluştur
    const listEle = document.createElement("li");

    // data id ekleme
    listEle.dataset.id = ele.id;

    // İçeriğini belirleme
    listEle.innerHTML = `
            <div>
              <p>${ele.title}</p>
              <p><span>Date:</span> ${ele.date}</p>
              <p><span>Status:</span> ${translate[ele.status]}</p>
            </div>
            <i id="fly" class="bi bi-airplane-fill"></i>
            <i id="delete" class="bi bi-trash-fill"></i>
      `;
    //   Html'deki listeye gönderme
    noteList.appendChild(listEle);
    // Ekrana imleç bas
    renderMark(ele);
  });
}

// Kullanıcının konumunu isteme

navigator.geolocation.getCurrentPosition(
  // Kullanıcı izin veirise haritayı onun bulundupu konumdan açma
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  //   izin vermezse varsayılan konumdan aç
  () => {
    loadMap([39.57, 32, 53]);
  }
);

// Haritaya tıklanınca çalışan fonksiyonu yazma
const onMapClick = (e) => {
  // Koordinatları ortak alana aktar
  coords = [e.latlng.lat, e.latlng.lng];
  // Formu göster
  form.style.display = "flex";
  // Inputa focus atma
  input.focus();
};

// Formu temizler

function clearForm() {
  form[0].value = "";
  form[1].value = "";
  form[2].value = "";
}

// ! Silme ve uçuş

noteList.addEventListener("click", (e) => {
  const found_id = e.target.closest("li").dataset.id;

  if (e.target.id === "delete" && confirm("You sure?")) {
    // id 'sini bildiğimiz elamanı diziden çıkarma
    notes = notes.filter((note) => note.id !== Number(found_id));
    // lokali günceller
    setStorage(notes);
    // ekranı güncelle
    renderNoteList(notes);
  }
  if (e.target.id === "fly") {
    // id'sini bildiğimiz elemanın koordinatlarına erişme
    const note = notes.find((note) => note.id === Number(found_id));

    // animasyanu çalıştır
    map.flyTo(note.coords);

    // Geçici bir popup oluşturma
    var popup = L.popup().setLatLng(note.coords).setContent(note.title);

    // Küçük ekranlarda uçurulduğunda menüyü kapar
    if (window.innerWidth < 769) {
      checkbox.checked = false;
      aside.classList.add("hide");
    }

    // O koordinatlarda açma
    popup.openOn(map);
  }
});

// ! Gizle ve Göster

checkbox.addEventListener("input", (e) => {
  const isChecked = e.target.checked;

  if (isChecked) {
    aside.classList.remove("hide");
  } else {
    aside.classList.add("hide");
  }
});
