(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        if (!header.classList.contains('header-scrolled')) {
            offset -= 16
        }

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function(e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
    }, true)

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });
    /**
     * Clients Slider
     */
    new Swiper('.clients-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 60
            },
            640: {
                slidesPerView: 4,
                spaceBetween: 80
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 120
            }
        }
    });

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
        let portfolioContainer = select('.portfolio-container');
        if (portfolioContainer) {
            let portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            let portfolioFilters = select('#portfolio-flters li', true);

            on('click', '#portfolio-flters li', function(e) {
                e.preventDefault();
                portfolioFilters.forEach(function(el) {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                portfolioIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
                portfolioIsotope.on('arrangeComplete', function() {
                    AOS.refresh()
                });
            }, true);
        }

    });

    /**
   
     
    
     * Animation on scroll
     */
    window.addEventListener('load', () => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        })
    });

})()




/* -------------------- tabbed content info

                                                -- only fires if tabsWrapper is found in page/view.
                                                -- clears any accidental .active classes from the code block
                                                -- starts with tab of choice (initialTab).
                                                -- checks for correct number of tabs and content blocks
                                                ---- gives user feedback/code suggestion if tabs/content blocks don't match.
                                                -- allows for unlimited tabs and/or content blocks (as desired)

                                                */

function contentTabs() {
    // set initial tab of choice
    const initialTab = 0;

    // -------------------------------------------------

    // declare vars
    let i;
    // check if container/wrapper exist
    const containerActive = document.getElementsByClassName('tabs-wrapper');
    // put all tab-items into a variable
    const tabButton = document.querySelectorAll('.tab-item');
    // put all item-contents into a variable
    const tabContent = document.querySelectorAll('.item-content');

    if (containerActive.length >= 1) {
        runTabs();
    }

    function runTabs() {
        /* maintenance mode, check amount of tab-items is same as item-content.
-- if isn't, suggest "warn" ways to ommit error messages. */
        function initChecks() {
            // clear all active classes
            clearActive();
            // check element numbers are correct
            if (tabButton.length < tabContent.length) {
                // if there are less buttons than content tabs
                console.warn(
                    'You need to have the same amount of tab-item\'s as you have content-tab\'s'
                );
                console.group(
                    'Paste this emmet shorthand inside the \'tabs-wrapper\' div and press enter/tab'
                );
                console.log('div.tab-item{tab-title}');
                console.groupEnd();
            } else if (tabContent.length < tabButton.length) {
                // if there are less content tabs than buttons
                console.warn(
                    'You need to have the same amount of content-tab\'s as you have tab-items\'s'
                );
                console.group(
                    'Paste this emmet shorthand inside the \'tabbed-content\' div and press enter/tab'
                );
                console.log(
                    'div.item-content>div.hightlights*4>h4{some title}+p{some copy}'
                );
                console.groupEnd();
            } else {
                tabContent[initialTab].classList.add('active');
            }
        }
        initChecks();

        /* self calling function to clear all active classed from group of tabs
-- if user has added active class for some wierd reason */
        function clearActive() {
            // cycle through all elements with class="tab-item" and remove "active".
            for (i = 0; i < tabContent.length; i++) {
                tabContent[i].classList.remove('active');
            }
        }

        // add event listeners to all elements with tab-item class and wait for click
        for (let tabIndex = 0; tabIndex < tabButton.length; tabIndex++) {
            tabButton[tabIndex].addEventListener('click', function() {
                // clear all active class's from the group of tabs.
                clearActive();
                // select item-content with the same index as the clicked tab-item and add an active class.
                tabContent[tabIndex].classList.toggle('active');
            });
        }
    }
}
contentTabs();