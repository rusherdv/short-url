import showNotification from "./notification";
import "toastify-js/src/toastify.css"

function getrandom() {
  const random_string =
    Math.random().toString(32).substring(2, 5) +
    Math.random().toString(32).substring(2, 5);
  return random_string;
}
  
export function add(state, action) {
  try {
    const url = new URL(action.data);
    if (exists(state, url.toString())) {
      showNotification('URL already exists', 'error')
      throw new Error("url-exists");
    }
    const shortUrl = getrandom();
    const temp = [...state.items];
    temp.push({ url: url.toString(), shortUrl, views: 0, ips: [] });
    console.log(temp);
    localStorage.setItem("urls", JSON.stringify(temp));
    showNotification('Added to database', 'success')
    return { items: [...temp] };
  } catch (e) {
      if(e.message != 'url-exists'){
          showNotification('Invalid URL', 'error')
      }
      return state;
  }
}
  
export function load(state, action) {
  const data = localStorage.getItem("urls") ?? "[]";
  const temp = JSON.parse(data);
  return { items: [...temp] };
}
  
export function addView(state, action) {
  const temp = [...state.items];
  const item = temp.find((item) => item.shortUrl === action.data);
  item.views++;
  const ipExists = item.ips.find((newIp) => newIp === action.ip)
  console.log(ipExists)
  if(ipExists){
    console.log("IP alredy registered")
  }else{
    item.ips.push(action.ip);
  }

  localStorage.setItem("urls", JSON.stringify(temp));
  return { items: [...temp] };
}
  
export function exists(state, url) {
  return !!state.items.find((item) => item.url === url);
}


export function getIP() {
  return fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => data.ip)
    .catch(error => {
      console.error('Error al obtener la IP:', error);
      return null; // Opcional: Devuelve un valor predeterminado en caso de error
    });
}