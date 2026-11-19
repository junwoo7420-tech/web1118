function average(list) {
    let sum = 0;
    for (const m of list) {
        sum += m.rating;
    }
    return sum / list.length;
}

function best(list) {
    const max = Math.max(...list.map(m => m.rating));
    return list.find(m => m.rating === max);
}

function filterByRating(list, min) {
    return list.filter(m => m.rating >= min);
}

function yearsSince(dateStr) {
    return new Date().getFullYear() - new Date(dateStr).getFullYear();
}

function posterUrl(path, size) {
    return "https://image.tmdb.org/t/p/" + size + path;
}

console.log("평균:", average(movies));
console.log("최고:", best(movies).title);
console.log("8점 이상:", filterByRating(movies, 8).length + "편");

function renderCards(list) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) { card.classList.add("hot"); }
        card.innerHTML = `
        <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">
        <span class="badge">${m.rating}</span>
        <div class="info">
        <h2>${m.title}</h2>
        <p class="year">${m.year}</p>
        <button class="like" type="button">♥</button>
        </div>`;
        board.appendChild(card);
    }
    document.getElementById("count").textContent = list.length + "편";
    updateLikeCount();
    if (list.length === 0) { board.classList.add("is-empty"); } else { board.classList.remove("is-empty"); }
}

function sortBy(list, key, desc) {
    const copy = [...list];
    copy.sort((a, b) => {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
        return a[key] - b[key];
    });
    if (desc) copy.reverse();
    return copy;
}

function applySort() {
    renderCards(getView());
}

applySort();

document.getElementById("q").addEventListener("input", (e) => {
    renderCards(getView());
});

function getView() {
    const keyword = document.getElementById("q").value.trim().toLowerCase();
    const found = movies.filter(m => m.title.toLowerCase().includes(keyword));
    const key = document.getElementById("sort").value;
    return sortBy(found, key, key !== "title");
}

document.getElementById("sort").addEventListener("change", applySort);

document.querySelector(".board").addEventListener("click", (e) => {
    if (e.target.classList.contains("like")) {
        e.target.classList.toggle("liked");
        updateLikeCount();
    }
});

function updateLikeCount() {
    document.getElementById("likeCount").textContent = document.querySelectorAll(".liked").length;
}

document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        e.target.value = "";
        renderCards(getView());
    }
});

const liked = JSON.parse(localStorage.getItem("liked") || "[]");
function saveLiked() {
    localStorage.setItem("liked", JSON.stringify(liked));
}

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});