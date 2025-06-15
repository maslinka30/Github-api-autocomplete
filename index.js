class GitHubReposApp {
    constructor() {
        this.searchInput = document.querySelector('.search');
        this.searchResults = document.querySelector('.search-results');
        this.container = document.querySelector('.container');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 500));
        this.searchResults.addEventListener('click', this.handleResultClick.bind(this));
        this.container.addEventListener('click', this.handleCardClick.bind(this));
    }

    handleSearch(e) {
        const query = e.target.value.trim();
            fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`)
        .then(response => response.json())
        .then(data => this.displayResults(data.items));
    }

    displayResults(repos) {
        this.searchResults.innerHTML = '';
        repos.forEach(repo => {
            const li = document.createElement('li');
            li.className = 'search-item';
            li.textContent = `${repo.name} (${repo.owner.login})`;
            li.dataset.repo = JSON.stringify({
                name: repo.name,
                owner: repo.owner.login,
                stars: repo.stargazers_count
            });
            this.searchResults.appendChild(li);
        });
        this.searchResults.style.display = 'block';
    }

    handleResultClick(e) {
        if (e.target.classList.contains('search-item')) {
            const repoData = JSON.parse(e.target.dataset.repo);
            this.addRepositoryCard(repoData);
            this.searchInput.value = '';
            this.searchResults.style.display = 'none';
        }
    }

    addRepositoryCard(repo) {
        const card = document.createElement('div');
        card.innerHTML = `
            <button data-action="delete">X</button>
            <p>Name: ${repo.name}</p>
            <p>Owner: ${repo.owner}</p>
            <p>Stars: ${repo.stars}</p>
        `;
        this.container.appendChild(card);
    }

    handleCardClick(e) {
        if (e.target.getAttribute('data-action') === 'delete') {
            e.target.parentElement.remove();
        }
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GitHubReposApp();});