function loadFooter() {
    let footerPath = '';

    if (window.location.pathname.includes('/pages/articles/')) {
        footerPath = '../footer.html';
    } else if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        footerPath = 'pages/footer.html';
    } else {
        footerPath = 'footer.html';
    }

    fetch(footerPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load footer from ${footerPath}`);
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}