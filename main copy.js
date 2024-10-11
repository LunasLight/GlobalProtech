document.addEventListener('DOMContentLoaded', function () {
    var initialPage = sessionStorage.getItem('currentPage') || './home.html';
    loadPage(initialPage);
    setActiveLinks();

    document.addEventListener('click', function (e) {
        const link = e.target.closest('.nav-link, .dropdown-item, .footer-link, .tohref');
        if (link) {
            const src = link.dataset.src;

            if (src) {
                sessionStorage.setItem('currentPage', src);
                initialPage = sessionStorage.getItem('currentPage');
                setActiveLinks();
                loadPage(src);
                location.reload();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    });
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
                const imageLoadPromises = Array.from(images).map(img => {
                    return new Promise((resolve) => {
                        if (img.complete) {
                            resolve();
                        } else {
                            img.onload = resolve;
                            img.onerror = resolve;
                        }
                    });
                });
                return Promise.all(imageLoadPromises);
            })
            .then(() => {
                loader.style.display = "none";
                AOS.init();
            })
            .catch(error => {
                document.getElementById('content').innerHTML = '<p>เกิดข้อผิดพลาด: ' + error.message + '</p>'; // แสดงข้อความผิดพลาด
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
        document.querySelectorAll('.nav-link, .dropdown-item, .footer-link').forEach(item => {
            item.classList.remove('active');
        });
        console.log(initialPage);
        document.querySelectorAll(`[data-src="${initialPage}"]`).forEach(item => {
            item.classList.add('active');
            if (item.classList.contains('dropdown-item')) {
                const allServicesToggle = document.querySelectorAll('.services');
                allServicesToggle.forEach(service => {
                    service.classList.add('active');
                });
            }
        });
    }
});
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