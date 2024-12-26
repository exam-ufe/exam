let currentIndex = -1;
let matches = [];
let debounceTimeout;

const searchBox = document.getElementById("searchBox");
const searchResults = document.getElementById("searchResults");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const navButtons = document.querySelector(".nav-buttons");

// Debounced search
searchBox.addEventListener("input", function() {
    clearTimeout(debounceTimeout); // Clear previous timeout
    debounceTimeout = setTimeout(() => {
        performSearch();
    }, 300); // 300ms delay
});

function performSearch() {
    let query = searchBox.value.toLowerCase();
    let content = document.querySelectorAll("#content p");

    // Reset highlights
    content.forEach(el => {
        el.innerHTML = el.innerText;
    });

    matches = [];
    currentIndex = -1;

    if (query) {
        content.forEach((el) => {
            let text = el.innerText;
            let regex = new RegExp(`(${query})`, 'gi');
            if (regex.test(text)) {
                el.innerHTML = text.replace(regex, `<mark class="highlight">$1</mark>`);
                matches.push(el);
            }
        });

        if (matches.length > 0) {
            searchResults.innerText = `${matches.length} result(s) found.`;
            searchResults.classList.remove("hidden");
            navButtons.classList.remove("hidden");
            scrollToMatch(0);
        } else {
            searchResults.innerText = "No matches found.";
            searchResults.classList.remove("hidden");
            navButtons.classList.add("hidden");
        }
    } else {
        searchResults.classList.add("hidden");
        navButtons.classList.add("hidden");
    }
}

function scrollToMatch(index) {
    if (matches.length > 0) {
        if (index < 0) index = matches.length - 1;
        if (index >= matches.length) index = 0;

        currentIndex = index;
        matches[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        highlightCurrent();
    }
}

function highlightCurrent() {
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('current'));
    let highlighted = matches[currentIndex].querySelectorAll('.highlight');
    if (highlighted.length) {
        highlighted[0].classList.add('current');
    }
}

prevBtn.addEventListener("click", function() {
    scrollToMatch(currentIndex - 1);
});

nextBtn.addEventListener("click", function() {
    scrollToMatch(currentIndex + 1);
});

// Trigger "Next" when Enter is pressed
searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        nextBtn.click();
        event.preventDefault();
    }
});