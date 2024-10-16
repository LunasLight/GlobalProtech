document.addEventListener('DOMContentLoaded', function () {
    var initialPage = sessionStorage.getItem('currentPage') || 'home.html';
    const historyStack = JSON.parse(sessionStorage.getItem('historyStack')) || [];
    const forwardStack = [];

    loadPage(initialPage);
    setActiveLinks();

    window.history.replaceState({ page: initialPage }, '', '');

    document.addEventListener('click', function (e) {
        const link = e.target.closest('.nav-link, .dropdown-item, .footer-link, .tohref');
        if (link) {
            const src = link.dataset.src;

            if (src) {
                historyStack.push(initialPage);
                sessionStorage.setItem('historyStack', JSON.stringify(historyStack));
                sessionStorage.setItem('currentPage', src);
                initialPage = sessionStorage.getItem('currentPage');
                setActiveLinks();
                loadPage(src);
                window.history.pushState({ page: src }, '', '');
                forwardStack.length = 0;
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    });

    window.onpopstate = function (event) {
        if (event.state) {
            const currentPage = event.state.page;

            if (historyStack.length > 0) {
                forwardStack.push(sessionStorage.getItem('currentPage'));
                sessionStorage.setItem('currentPage', currentPage);
                loadPage(currentPage);
                location.reload();
            }

            if (historyStack.length === 0) {
                sessionStorage.setItem('currentPage', './home.html');
                loadPage('./home.html');
                location.reload();
            }
        }
    };

    function loadPage(url) {
        const loader = document.getElementById("preloader");
        loader.style.display = "block";
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('content').innerHTML = data;
                updateBackground(url);
                const images = document.querySelectorAll('#content img');
                const imageLoadPromises = Array.from(images).map(img => new Promise(resolve => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }
                }));
                return Promise.all(imageLoadPromises);
            })
            .then(() => {
                loader.style.display = "none";
                AOS.init();
            })
            .catch(error => {
                document.getElementById('content').innerHTML = '<p>เกิดข้อผิดพลาด: ' + error.message + '</p>';
            });
    }

    function updateBackground(url) {
        const body = document.body;
        const backgrounds = {
            'home.html': './img/Background.png',
        };
        if (backgrounds[url]) {
            body.style.backgroundImage = `url('${backgrounds[url]}')`;
        } else {
            body.style.backgroundImage = "none";
        }
        body.classList.remove('bodyBackground1', 'bodyBackground2');
        if (backgrounds[url] === backgrounds['home.html']) {
            body.classList.add('bodyBackground1');
        } else {
            body.classList.add('bodyBackground2');
        }
    }

    function setActiveLinks() {
        document.querySelectorAll('.nav-link, .dropdown-item, .footer-link,.articles').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll(`[data-src="${initialPage}"]`).forEach(item => {
            item.classList.add('active');
            if (item.classList.contains('dropdown-item')) {
                const allServicesToggle = document.querySelectorAll('.services');
                allServicesToggle.forEach(service => {
                    service.classList.add('active');
                });
            }
        });
        if (['article1.html', 'article2.html', 'article3.html', 'article4.html', 'article5.html'].includes(initialPage)) {
            const allArticles = document.querySelectorAll('.articles');
            allArticles.forEach(article => {
                article.classList.add('active');
            });
        }
    }
    document.getElementById('serviceLink').addEventListener('click', function () {
        const dropdownElement = document.getElementById('navbarDropdownMenuLink');
        const dropdownMenu = dropdownElement.nextElementSibling;
        const isOpen = dropdownMenu.classList.contains('show');

        dropdownMenu.classList.toggle('show', !isOpen);
        dropdownElement.classList.toggle('show', !isOpen);
        dropdownElement.setAttribute('aria-expanded', !isOpen);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function () {
        const header = document.getElementById('top-header');
        const dropdownElement = document.getElementById('navbarNavDropdown');
        const logoheader = document.getElementById('logo-header');
        if (window.scrollY > 0) {
            header.classList.add('bg-white');
            if (dropdownElement.classList.contains('show')) {
                dropdownElement.classList.remove('show');
            }
            if (logoheader.classList.contains('col-lg-12')) {
                logoheader.classList.remove('col-lg-12');
                logoheader.classList.add('col-lg-8');
            }
        } else {
            header.classList.remove('bg-white');
            if (logoheader.classList.contains('col-lg-8')) {
                logoheader.classList.remove('col-lg-8');
                logoheader.classList.add('col-lg-12');
            }
        }
    });
});