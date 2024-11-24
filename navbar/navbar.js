
document.addEventListener('DOMContentLoaded', () => {

    const currentPath = window.location.pathname;
    const navbarPath = currentPath.includes('/contact/') ? '../navbar/navbar.html' : 'navbar/navbar.html';

    fetch('navbar/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        const homeLink = document.getElementById('home-link');
        const currentPage = window.location.pathname;

        if (currentPage.endsWith('index.html') || currentPage === '/') {
            homeLink.style.display = 'none';
        }
    }).catch(error => console.error('Error loading navbar: ', error));
});
