const urlData = "https://pokeapi.co/api/v2/pokemon";
const color = {
  poison: "#a33da2",
  grass: "#78cd56",
  fire: "#ff411c",
  flying: "#a98ff0",
  bug: "#78cd56",
  water: "#6375fd",
  normal: "",
};

let body = document.querySelector(".body");
let input = document.querySelector(".heading__input");
let loadingScreen = document.getElementById("loading-screen");

// Hiển thị màn hình loading
const showLoading = () => {
  loadingScreen.style.display = "flex";
};

// Ẩn màn hình loading
const hideLoading = () => {
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 1000);
};

// Hàm fetch dữ liệu từ URL
const fetchData = async (url) => {
  showLoading(); 
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    body.innerHTML = `<p style="color: red;">Không thể tải dữ liệu. Vui lòng thử lại sau!</p>`;
    return null; 
  } finally {
    hideLoading();
  }
};


const clearBody = () => {
  body.innerHTML = ""; 
};

// Hàm render thẻ HTML cho danh sách Pokémon
const renderCards = async (data) => {
  return Promise.all(
    data.map(async (element) => {
      const response = await fetchData(element.url); 
      if (!response) return ""; 
      const typeList = response.types.map((e) => {
        const typeName = e.type.name;
        return ` <span style="background-color: ${
          color[typeName] || "#ccc"
        }">${typeName}</span>`;
      });
      return `
        <div class="card">
          <div class="card__id">#${response.id}</div>
          <img class="cart__img" src="${response.sprites.front_default}" alt="anh_list">
          <div class="cart__infor">
            <h3 class="name">${response.name}</h3>
            <div class="cart__infor--attr">
              ${typeList.join(" ")}
            </div>
          </div>
        </div>
      `;
    })
  );
};

// Hàm render toàn bộ danh sách Pokémon
const render = async () => {
  const dataList = await fetchData(urlData); 
  if (dataList && dataList.results) {
    clearBody();
    const HTMLArray = await renderCards(dataList.results);
    body.innerHTML = HTMLArray.join(" ");
  } else {
    body.innerHTML = "<p>Không thể tải dữ liệu</p>";
  }
};


const handleInput = (dataList) => {
  if (!dataList || !dataList.results) return;

  input.addEventListener("input", async (event) => {
    const inputValue = event.target.value.toLowerCase();
    const filteredData = dataList.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(inputValue)
    );

    showLoading(); 
    clearBody(); 
    const HTMLArray = await renderCards(filteredData); 
    body.innerHTML = HTMLArray.join(" ");
    hideLoading();
  });
};


const run = async () => {
  const dataList = await fetchData(urlData); 
  if (dataList) {
    await render(); 
    handleInput(dataList); 
  }
};


run();
