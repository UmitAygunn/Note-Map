// Gönderilen verileri lokal'e kaydeder

export const setStorage = (data) => {
  // GElen veriyi stringe çevirme
  const stringData = JSON.stringify(data);
  //   Lokal'e kaydetme
  localStorage.setItem("NOTES", stringData);
};

// value'lara karşılık gelen içerikler için
export const translate = {
  visit: "Visit",
  home: "Home",
  job: "Job",
  park: "Park",
};

// lokalden eleman alır ve geriye döndürür

export const getStorage = (key) => {
  const strData = localStorage.getItem(key);
  return JSON.parse(strData);
};

export var userIcon = L.icon({
  iconUrl: "/images/user.png",
  iconSize: [70, 60],
});

var homeIcon = L.icon({
  iconUrl: "/images/Home_4.png",
  iconSize: [70, 60],
});

var jobIcon = L.icon({
  iconUrl: "/images/Building_4.png",
  iconSize: [70, 60],
});

var gotoIcon = L.icon({
  iconUrl: "/images/Aeroplane_4.png",
  iconSize: [70, 60],
});

var parkIcon = L.icon({
  iconUrl: "/images/Parking_2.png",
  iconSize: [70, 60],
});

export const icons = {
  goto: gotoIcon,
  home: homeIcon,
  job: jobIcon,
  park: parkIcon,
};
