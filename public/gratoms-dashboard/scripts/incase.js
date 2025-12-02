// // //Removing Preloader
// // // setTimeout(function() {
// // //     var preloader = document.getElementById('preloader')
// // //     if (preloader) {
// // //         preloader.classList.add('preloader-hide');
// // //     }
// // // }, 150);

// // document.addEventListener('DOMContentLoaded', () => {
// //     'use strict'

// //     //Global Variables
// //     let isPWA = true; // Enables or disables the service worker and PWA
// //     let isAJAX = true; // AJAX transitions. Requires local server or server
// //     var pwaName = "PayApp"; //Local Storage Names for PWA
// //     var pwaRemind = 1; //Days to re-remind to add to home
// //     var pwaNoCache = false; //Requires server and HTTPS/SSL. Will clear cache with each visit

// //     //Setting Service Worker Locations scope = folder | location = service worker js location
// //     var pwaScope = "/";
// //     var pwaLocation = "/_service-worker.js";

// //     //Place all your custom Javascript functions and plugin calls below this line
// //     function init_template() {
// //         //Caching Global Variables
// //         var i, e, el, evt, event; //https://www.w3schools.com/js/js_performance.asp

// //         var cardStack = document.querySelectorAll('.card-stack .card');
// //         if (cardStack[0]) {
// //             var cardHeight = document.querySelectorAll('.card-stack')[0].getAttribute('data-stack-height');
// //             for (let i = 0; i < cardStack.length; i++) {
// //                 cardStack[i].style.height = +cardHeight + 20 + 'px';
// //                 cardStack[i].style.marginBottom = (-1) * (+cardHeight) + "px"
// //                 cardStack[i].style.zIndex = 70 - i;
// //                 cardStack[i].style.transform = "scale(0." + (99 - (i * 10)) + ")";
// //             }

// //             var btnExpandCards = document.querySelectorAll('.btn-stack-click')[0];
// //             var cardStackClick = document.querySelectorAll('.card-stack-click')[0];
// //             var cardStacked = document.querySelectorAll('.card-stack')[0];
// //             var cardStackInfo = document.querySelectorAll('.btn-stack-info')[0]

// //             function stackEffect() {
// //                 if (cardStacked.classList.contains('card-stack-active')) {
// //                     cardStackInfo.classList.remove('disabled');
// //                     btnExpandCards.classList.add('disabled');
// //                     cardStackClick.classList.remove('no-click');
// //                     cardStacked.classList.remove('card-stack-active');
// //                 } else {
// //                     cardStackInfo.classList.add('disabled');
// //                     btnExpandCards.classList.remove('disabled');
// //                     cardStackClick.classList.add('no-click');
// //                     cardStacked.classList.add('card-stack-active');
// //                 }

// //             }
// //             cardStackClick.addEventListener('click', function(e) {
// //                 stackEffect()
// //             })
// //             btnExpandCards.addEventListener('click', function(e) {
// //                 stackEffect()
// //             })
// //         }


// //         //Activating the Page - Required to improve CLS Performance
// //         document.querySelectorAll('#page')[0].style.display = "block";

// //         //Image Sliders
// //         var splide = document.getElementsByClassName('splide');
// //         if (splide.length) {
// //             var singleSlider = document.querySelectorAll('.single-slider');
// //             if (singleSlider.length) {
// //                 singleSlider.forEach(function(e) {
// //                     var single = new Splide('#' + e.id, {
// //                         type: 'loop',
// //                         autoplay: true,
// //                         interval: 4000,
// //                         perPage: 1,
// //                     }).mount();
// //                     var sliderNext = document.querySelectorAll('.slider-next');
// //                     var sliderPrev = document.querySelectorAll('.slider-prev');
// //                     sliderNext.forEach(el => el.addEventListener('click', el => {
// //                         single.go('>');
// //                     }));
// //                     sliderPrev.forEach(el => el.addEventListener('click', el => {
// //                         single.go('<');
// //                     }));
// //                 });
// //             }

// //             var doubleSlider = document.querySelectorAll('.double-slider');
// //             if (doubleSlider.length) {
// //                 doubleSlider.forEach(function(e) {
// //                     var double = new Splide('#' + e.id, {
// //                         type: 'loop',
// //                         autoplay: true,
// //                         interval: 4000,
// //                         arrows: false,
// //                         perPage: 2,
// //                     }).mount();
// //                 });
// //             }

// //             var tripleSlider = document.querySelectorAll('.triple-slider');
// //             if (tripleSlider.length) {
// //                 tripleSlider.forEach(function(e) {
// //                     var triple = new Splide('#' + e.id, {
// //                         type: 'loop',
// //                         autoplay: true,
// //                         interval: 4000,
// //                         arrows: false,
// //                         perPage: 3,
// //                         perMove: 1,
// //                     }).mount();
// //                 });
// //             }

// //             var quadSlider = document.querySelectorAll('.quad-slider');
// //             if (quadSlider.length) {
// //                 quadSlider.forEach(function(e) {
// //                     var quad = new Splide('#' + e.id, {
// //                         type: 'loop',
// //                         autoplay: true,
// //                         interval: 4000,
// //                         arrows: false,
// //                         perPage: 4,
// //                         perMove: 1,
// //                     }).mount();
// //                 });
// //             }
// //         }

// //         //Don't jump when Empty Links
// //         const emptyHref = document.querySelectorAll('a[href="#"]')
// //         emptyHref.forEach(el => el.addEventListener('click', e => {
// //             e.preventDefault();
// //             return false;
// //         }));

// //         //Opening Submenu
// //         function submenus() {
// //             var subTrigger = document.querySelectorAll('[data-submenu]');
// //             if (subTrigger.length) {
// //                 var submenuActive = document.querySelectorAll('.submenu-active')[0];
// //                 if (submenuActive) {
// //                     var subData = document.querySelectorAll('.submenu-active')[0].getAttribute('data-submenu');
// //                     var subId = document.querySelectorAll('#' + subData);
// //                     var subIdNodes = document.querySelectorAll('#' + subData + ' a');
// //                     var subChildren = subIdNodes.length
// //                     var subHeight = subChildren * 43;
// //                     subId[0].style.height = subHeight + 'px';
// //                 }

// //                 subTrigger.forEach(el => el.addEventListener('click', e => {
// //                     const subData = el.getAttribute('data-submenu');
// //                     var subId = document.querySelectorAll('#' + subData);
// //                     var subIdNodes = document.querySelectorAll('#' + subData + ' a');
// //                     var subChildren = subIdNodes.length
// //                     var subHeight = subChildren * 43;
// //                     if (el.classList.contains('submenu-active')) {
// //                         subId[0].style.height = '0px';
// //                         el.classList.remove('submenu-active');
// //                     } else {
// //                         subId[0].style.height = subHeight + 'px';
// //                         el.classList.add('submenu-active');
// //                     }
// //                     return false
// //                 }));
// //             }
// //         }

// //         //Activate Selected Menu
// //         function activatePage() {
// //             var activeMenu = document.querySelectorAll('[data-menu-active]');
// //             if (activeMenu) {
// //                 var activeData = activeMenu[0].getAttribute('data-menu-active');
// //                 var activeID = document.querySelectorAll('#' + activeData)[0]
// //                 activeID.classList.add('list-group-item-active')
// //                 if (activeID.parentNode.classList.contains('list-submenu')) {
// //                     var triggerSub = activeID.parentNode.getAttribute('id')
// //                     document.querySelectorAll('[data-submenu="' + triggerSub + '"]')[0].classList.add('submenu-active');
// //                     submenus();
// //                 }
// //             }
// //         }

// //         //Search Page
// //         var searchField = document.querySelectorAll('[data-search]');
// //         if (searchField.length) {
// //             var searchResults = document.querySelectorAll('.search-results')
// //             var searchNoResults = document.querySelectorAll('.search-no-results');
// //             var searchTotal = document.querySelectorAll(".search-results div")[0].childElementCount;

// //             function searchFunction() {
// //                 var searchStr = searchField[0].value;
// //                 var searchVal = searchStr.toLowerCase();
// //                 if (searchVal != '') {
// //                     searchResults[0].classList.remove('disabled-search-list');
// //                     var searchFilterItem = document.querySelectorAll('[data-filter-item]');
// //                     for (let i = 0; i < searchFilterItem.length; i++) {
// //                         var searchData = searchFilterItem[i].getAttribute('data-filter-name');
// //                         if (searchData.includes(searchVal)) {
// //                             searchFilterItem[i].classList.remove('disabled');
// //                         } else {
// //                             searchFilterItem[i].classList.add('disabled');
// //                         }
// //                         var disabledResults = document.querySelectorAll(".search-results div")[0].getElementsByClassName("disabled").length;
// //                         if (disabledResults === searchTotal) {
// //                             searchNoResults[0].classList.remove('disabled');
// //                         } else {
// //                             searchNoResults[0].classList.add('disabled');
// //                         }
// //                     }
// //                 }
// //                 if (searchVal === '') {
// //                     searchResults[0].classList.add('disabled-search-list');
// //                     searchNoResults[0].classList.add('disabled');
// //                     var searchFilterItem = document.querySelectorAll('[data-filter-item]');
// //                     for (let i = 0; i < searchFilterItem.length; i++) {
// //                         searchFilterItem[i].classList.remove('disabled');
// //                     }
// //                 }
// //                 if (searchVal.length === 0) {
// //                     searchResults[0].classList.add('disabled-search-list');
// //                     searchNoResults[0].classList.add('disabled');
// //                     var searchFilterItem = document.querySelectorAll('[data-filter-item]');
// //                     for (let i = 0; i < searchFilterItem.length; i++) {
// //                         searchFilterItem[i].classList.remove('disabled');
// //                     }
// //                 }
// //             };
// //             searchField[0].addEventListener('change', function() {
// //                 searchFunction();
// //             })
// //             searchField[0].addEventListener('keyup', function() {
// //                 searchFunction();
// //             })
// //             searchField[0].addEventListener('keydown', function() {
// //                 searchFunction();
// //             })
// //             searchField[0].addEventListener('click', function() {
// //                 searchFunction();
// //             })
// //         }

// //         //Back Button
// //         const backButton = document.querySelectorAll('[data-back-button]');
// //         if (backButton.length) {
// //             backButton.forEach(el => el.addEventListener('click', e => {
// //                 e.stopPropagation;
// //                 e.preventDefault;
// //                 window.history.go(-1);
// //             }));
// //         }

// //         //Auto Activate OffCanvas
// //         var autoActivateMenu = document.querySelectorAll('[data-auto-activate]')[0];
// //         if (autoActivateMenu) {
// //             setTimeout(function() {
// //                 var autoActivate = new bootstrap.Offcanvas(autoActivateMenu)
// //                 autoActivate.show();
// //             }, 600)
// //         }

// //         //Open Offcanvas and Hide Automatically
// //         var autoHide = document.querySelectorAll('[data-auto-hide-target]')
// //         autoHide.forEach(el => el.addEventListener('click', e => {
// //             var offCanvasID = el.getAttribute('data-auto-hide-target');
// //             var offCanvasTime = el.getAttribute('data-auto-hide-time');
// //             var autoHideMenu = document.querySelectorAll(offCanvasID)[0];
// //             var canvasIdenter = new bootstrap.Offcanvas(autoHideMenu);
// //             canvasIdenter.show();
// //             setTimeout(function() {
// //                 canvasIdenter.hide();
// //             }, offCanvasTime)
// //         }));

// //         //Card Extender
// //         const cards = document.getElementsByClassName('card');

// //         function card_extender() {
// //             for (let i = 0; i < cards.length; i++) {
// //                 if (cards[i].getAttribute('data-card-height') === "cover") {
// //                     if (window.matchMedia('(display-mode: fullscreen)').matches) {
// //                         var windowHeight = window.outerHeight;
// //                     }
// //                     if (!window.matchMedia('(display-mode: fullscreen)').matches) {
// //                         var windowHeight = window.innerHeight;
// //                     }
// //                     var coverHeight = windowHeight + 'px';
// //                 }
// //                 if (cards[i].hasAttribute('data-card-height')) {
// //                     var getHeight = cards[i].getAttribute('data-card-height');
// //                     cards[i].style.height = getHeight + 'px';
// //                     if (getHeight === "cover") {
// //                         var totalHeight = getHeight
// //                         cards[i].style.height = coverHeight
// //                     }
// //                 }
// //             }
// //         }
// //         if (cards.length) {
// //             card_extender();
// //             window.addEventListener("resize", card_extender);
// //         }

// //         //Dark Mode
// //         function darkMode() {
// //             var toggleDark = document.querySelectorAll('[data-toggle-theme]');

// //             function activateDarkMode() {
// //                 document.getElementById('theme-check').setAttribute('content', '#1f1f1f')
// //                 document.body.classList.add('theme-dark');
// //                 document.body.classList.remove('theme-light', 'detect-theme');
// //                 for (let i = 0; i < toggleDark.length; i++) {
// //                     toggleDark[i].checked = "checked"
// //                 };
// //                 localStorage.setItem(pwaName + '-Theme', 'dark-mode');
// //                 removeTransitions();
// //                 setTimeout(function() {
// //                     addTransitions();
// //                 }, 650);
// //             }

// //             function activateLightMode() {
// //                 document.getElementById('theme-check').setAttribute('content', '#FFFFFF')
// //                 document.body.classList.add('theme-light');
// //                 document.body.classList.remove('theme-dark', 'detect-theme');
// //                 for (let i = 0; i < toggleDark.length; i++) {
// //                     toggleDark[i].checked = false
// //                 };
// //                 localStorage.setItem(pwaName + '-Theme', 'light-mode');
// //                 removeTransitions();
// //                 setTimeout(function() {
// //                     addTransitions();
// //                 }, 650);
// //             }

// //             function setColorScheme() {
// //                 const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
// //                 const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
// //                 const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
// //                 window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
// //                 window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
// //                 if (isDarkMode) activateDarkMode();
// //                 if (isLightMode) activateLightMode();
// //             }

// //             //Activating Dark Mode
// //             var darkModeSwitch = document.querySelectorAll('[data-toggle-theme]')
// //             darkModeSwitch.forEach(el => el.addEventListener('click', e => {
// //                 if (document.body.className == "theme-light") {
// //                     removeTransitions();
// //                     activateDarkMode();
// //                 } else if (document.body.className == "theme-dark") {
// //                     removeTransitions();
// //                     activateLightMode();
// //                 }
// //                 setTimeout(function() {
// //                     addTransitions();
// //                 }, 350);
// //             }));

// //             //Set Color Based on Remembered Preference.
// //             if (localStorage.getItem(pwaName + '-Theme') == "dark-mode") {
// //                 for (let i = 0; i < toggleDark.length; i++) {
// //                     toggleDark[i].checked = "checked"
// //                 };
// //                 document.body.className = 'theme-dark';
// //             }
// //             if (localStorage.getItem(pwaName + '-Theme') == "light-mode") {
// //                 document.body.className = 'theme-light';
// //             }
// //             if (document.body.className == "detect-theme") {
// //                 setColorScheme();
// //             }

// //             //Detect Dark/Light Mode
// //             const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
// //             darkModeDetect.forEach(el => el.addEventListener('click', e => {
// //                 document.body.classList.remove('theme-light', 'theme-dark');
// //                 document.body.classList.add('detect-theme')
// //                 setTimeout(function() {
// //                     setColorScheme();
// //                 }, 50)
// //             }))

// //             function removeTransitions() {
// //                 document.body.classList.add('no-ani');
// //             }

// //             function addTransitions() {
// //                 document.body.classList.remove('no-ani');
// //             }
// //         }
// //         darkMode();


// //         //File Upload
// //         const inputArray = document.getElementsByClassName('upload-file');
// //         if (inputArray.length) {
// //             inputArray[0].addEventListener('change', prepareUpload, false);

// //             function prepareUpload(event) {
// //                 if (this.files && this.files[0]) {
// //                     var img = document.getElementById('image-data');
// //                     img.src = URL.createObjectURL(this.files[0]);
// //                     img.classList.add('mt-4', 'mb-3', 'mx-auto');
// //                 }
// //                 const files = event.target.files;
// //                 const fileName = files[0].name;
// //                 const fileSize = (files[0].size / 1000).toFixed(2) + 'kb';
// //                 const textBefore = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-before');
// //                 const textAfter = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-after');
// //                 document.getElementsByClassName('upload-file-name')[0].innerHTML = textBefore + ' ' + fileName + ' - ' + fileSize + ' - ' + textAfter;
// //                 document.getElementsByClassName('upload-file-name')[0].classList.add('pb-3');
// //             }
// //         }

// //         //Activating Off Canvas
// //         var offCanvasBoxes = document.querySelectorAll('.offcanvas');
// //         if (offCanvasBoxes) {
// //             setTimeout(function() {
// //                 offCanvasBoxes.forEach(function(e) {
// //                     e.style.display = "block";
// //                 })
// //             }, 250)
// //         }

// //         //Calling Functions Required After External Menus are Loaded
// //         var dataMenuLoad = document.querySelectorAll('[data-menu-load]')
// //         dataMenuLoad.forEach(function(e) {
// //             var menuLoad = e.getAttribute('data-menu-load')
// //             fetch(menuLoad)
// //                 .then(data => data.text())
// //                 .then(html => e.innerHTML = html)
// //                 .then(data => {
// //                     setTimeout(function() {
// //                         if (dataMenuLoad[dataMenuLoad.length - 1] === e) {
// //                             darkMode();
// //                             submenus();
// //                             pageHighlights();
// //                             activatePage();
// //                         }
// //                     }, 500);
// //                 }).catch(function() {
// //                     e.innerHTML = "<h5 class='font-16 px-4 py-4 mb-0'>Please use a Local Server such as AMPPS or WAMP to see externally loaded menus or put " + pwaName + " files on your server. <br> To load menus from inside your HTML you must remove the data-menu-load=`your-menu.html` and copy what is inside your-menu.html in this div. <br>Using external menus, editing a single menu will show in all pages. <br><br> For more information please read the Documentation -> Menu Chapter.</h5>";
// //                 });

// //         })

// //         //Adding Local Storage for Visited Links
// //         var checkVisited = document.querySelectorAll('.check-visited');
// //         if (checkVisited) {
// //             function check_visited_links() {
// //                 var visited_links = JSON.parse(localStorage.getItem(pwaName + '_Visited_Links')) || [];
// //                 var links = document.querySelectorAll('.check-visited a');
// //                 for (let i = 0; i < links.length; i++) {
// //                     var that = links[i];
// //                     that.addEventListener('click', function(e) {
// //                         var clicked_url = this.href;
// //                         if (visited_links.indexOf(clicked_url) == -1) {
// //                             visited_links.push(clicked_url);
// //                             localStorage.setItem(pwaName + '_Visited_Links', JSON.stringify(visited_links));
// //                         }
// //                     })
// //                     if (visited_links.indexOf(that.href) !== -1) {
// //                         that.className += ' visited-link';
// //                     }
// //                 }
// //             }
// //             check_visited_links();
// //         }

// //         //Scrolling Header
// //         var scrollItems = document.querySelectorAll('.header-auto-show')
// //         if (scrollItems.length) {
// //             var scrollHeader = document.querySelectorAll('.header-auto-show');
// //             window.addEventListener('scroll', function() {
// //                 if (document.querySelectorAll('.scroll-ad, .header-auto-show').length) {
// //                     function showHeader() {
// //                         scrollHeader[0].classList.add('header-active');
// //                     }

// //                     function hideHeader() {
// //                         scrollHeader[0].classList.remove('header-active');
// //                     }
// //                     var window_height = window.outerWidth;
// //                     var total_scroll_height = document.documentElement.scrollTop
// //                     let inside_header = total_scroll_height <= 30;
// //                     var passed_header = total_scroll_height >= 30;
// //                     let inside_footer = (window_height - total_scroll_height + 1000) <= 150
// //                     if (scrollHeader.length) {
// //                         inside_header ? hideHeader() : null
// //                         passed_header ? showHeader() : null
// //                     }
// //                 }
// //             });
// //         }

// //         //Stepper
// //         var stepperAdd = document.querySelectorAll('.stepper-add');
// //         var stepperSub = document.querySelectorAll('.stepper-sub');
// //         if (stepperAdd.length) {
// //             stepperAdd.forEach(el => el.addEventListener('click', event => {
// //                 var currentValue = el.parentElement.querySelector('input').value
// //                 el.parentElement.querySelector('input').value = +currentValue + 1
// //             }))

// //             stepperSub.forEach(el => el.addEventListener('click', event => {
// //                 var currentValue = el.parentElement.querySelector('input').value
// //                 el.parentElement.querySelector('input').value = +currentValue - 1
// //             }))
// //         }

// //         //Link List Toggle
// //         var linkListToggle = document.querySelectorAll('[data-trigger-switch]:not([data-toggle-theme])');
// //         if (linkListToggle.length) {
// //             linkListToggle.forEach(el => el.addEventListener('click', event => {
// //                 var switchData = el.getAttribute('data-trigger-switch');
// //                 el.classList.add('no-click');
// //                 setTimeout(function() {
// //                     el.classList.remove('no-click');
// //                 }, 270)
// //                 var getCheck = document.getElementById(switchData);
// //                 getCheck.checked ? getCheck.checked = false : getCheck.checked = true;
// //             }))
// //         }


// //         //Header Date
// //         var headerLarge = document.querySelectorAll('.header-date')[0];
// //         if (headerLarge) {
// //             var weekID = new Date();
// //             var weekdayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// //             var monthID = new Date();
// //             var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// //             var dayID = new Date();
// //             var dayName = dayID.getDate();
// //             var daySuffix = 'th';
// //             if (dayName === 1) {
// //                 daySuffix = 'st'
// //             };
// //             if (dayName === 2) {
// //                 daySuffix = 'nd'
// //             };
// //             if (dayName === 3) {
// //                 daySuffix = 'rd'
// //             };
// //             if (dayName === 21) {
// //                 daySuffix = 'st'
// //             };
// //             if (dayName === 22) {
// //                 daySuffix = 'nd'
// //             };
// //             if (dayName === 22) {
// //                 daySuffix = 'rd'
// //             };
// //             if (dayName === 31) {
// //                 daySuffix = 'st'
// //             };
// //             headerLarge.innerHTML += weekdayName[weekID.getDay()] + ' ' + dayName + daySuffix + ' ' + monthNames[monthID.getMonth()]
// //         }

// //         //Form Validation
// //         var bootstrapForms = document.querySelectorAll('.needs-validation')
// //         // Loop over them and prevent submission
// //         Array.prototype.slice.call(bootstrapForms).forEach(function(bootstrapForms) {
// //             bootstrapForms.addEventListener('submit', function(event) {
// //                 if (!bootstrapForms.checkValidity()) {
// //                     event.preventDefault();
// //                     event.stopPropagation();
// //                 } else {
// //                     //Remove the code below to allow form submission.
// //                     event.preventDefault();
// //                     event.stopPropagation();
// //                     qrFunction(event);
// //                 }
// //                 bootstrapForms.classList.add('was-validated')
// //             }, false)
// //         })

// //         //Form Label Activate on Write
// //         var formLabel = document.querySelectorAll('.form-label input, .form-label select, .form-label textarea');
// //         formLabel.forEach(el => el.addEventListener('input', event => {
// //             if (el.value == '') {
// //                 el.parentElement.querySelectorAll('label')[0].classList.remove('form-label-active');
// //             }
// //             if (el.value !== '') {
// //                 el.parentElement.querySelectorAll('label')[0].classList.add('form-label-active')
// //             }
// //         }));

// //         //Copyright Year
// //         setTimeout(function() {
// //             var copyrightYear = document.querySelectorAll('.copyright-year');
// //             if (copyrightYear) {
// //                 copyrightYear.forEach(function(e) {
// //                     var dteNow = new Date();
// //                     const intYear = dteNow.getFullYear();
// //                     e.textContent = intYear;
// //                 });
// //             }
// //         }, 500);

// //         //Creating Offline Alert Messages
// //         var addOfflineClasses = document.querySelectorAll('.offline-message');
// //         if (!addOfflineClasses.length) {
// //             const offlineAlert = document.createElement('p');
// //             const onlineAlert = document.createElement('p');
// //             offlineAlert.className = 'offline-message bg-red-dark shadow-bg shadow-bg-s color-white';
// //             offlineAlert.innerHTML = '<i class="bi bi-wifi-off pe-2"></i> No internet connection detected';
// //             onlineAlert.className = 'online-message bg-green-dark shadow-bg shadow-bg-s color-white';
// //             onlineAlert.innerHTML = '<i class="bi bi-wifi pe-2"></i> You are back online.';
// //             document.querySelectorAll('#page')[0].appendChild(offlineAlert);
// //             document.querySelectorAll('#page')[0].appendChild(onlineAlert);
// //         }

// //         //Online / Offline Settings
// //         //Activating and Deactivating Links Based on Online / Offline State
// //         function offlinePage() {
// //             var anchorsDisabled = document.querySelectorAll('a');
// //             anchorsDisabled.forEach(function(e) {
// //                 var hrefs = e.getAttribute('href');
// //                 if (hrefs.match(/.html/)) {
// //                     e.classList.add('show-offline');
// //                     e.setAttribute('data-link', hrefs);
// //                     e.setAttribute('href', '#');
// //                 }
// //             });
// //             var showOffline = document.querySelectorAll('.show-offline');
// //             showOffline.forEach(el => el.addEventListener('click', event => {
// //                 document.getElementsByClassName('offline-message')[0].classList.add('offline-message-active');
// //                 setTimeout(function() {
// //                     document.getElementsByClassName('offline-message')[0].classList.remove('offline-message-active');
// //                 }, 1500)
// //             }));
// //         }

// //         function onlinePage() {
// //             var anchorsEnabled = document.querySelectorAll('[data-link]');
// //             anchorsEnabled.forEach(function(e) {
// //                 var hrefs = e.getAttribute('data-link');
// //                 if (hrefs.match(/.html/)) {
// //                     e.setAttribute('href', hrefs);
// //                     e.removeAttribute('data-link', '');
// //                 }
// //             });
// //         }

// //         //Defining Offline/Online Variables
// //         var offlineMessage = document.getElementsByClassName('offline-message')[0];
// //         var onlineMessage = document.getElementsByClassName('online-message')[0];

// //         //Online / Offline Status
// //         function isOnline() {
// //             onlinePage();
// //             offlineMessage.classList.remove('offline-message-active');
// //             onlineMessage.classList.add('online-message-active');
// //             setTimeout(function() {
// //                 onlineMessage.classList.remove('online-message-active');
// //             }, 2000)
// //             console.info('Connection: Online');
// //         }

// //         function isOffline() {
// //             offlinePage();
// //             onlineMessage.classList.remove('online-message-active');
// //             offlineMessage.classList.add('offline-message-active');
// //             setTimeout(function() {
// //                 offlineMessage.classList.remove('offline-message-active');
// //             }, 2000)
// //             console.info('Connection: Offline');
// //         }

// //         var simulateOffline = document.querySelectorAll('.simulate-offline');
// //         var simulateOnline = document.querySelectorAll('.simulate-online');
// //         if (simulateOffline.length) {
// //             simulateOffline[0].addEventListener('click', function() {
// //                 isOffline()
// //             });
// //             simulateOnline[0].addEventListener('click', function() {
// //                 isOnline()
// //             });
// //         }

// //         //Check if Online / Offline
// //         function updateOnlineStatus(event) {
// //             var condition = navigator.onLine ? "online" : "offline";
// //             isOnline();
// //         }

// //         function updateOfflineStatus(event) {
// //             isOffline();
// //         }
// //         window.addEventListener('online', updateOnlineStatus);
// //         window.addEventListener('offline', updateOfflineStatus);

    

// //         //PWA Settings
// //         if (isPWA === true) {
// //             //Defining PWA Windows
// //             var iOS_PWA = document.querySelectorAll('#menu-install-pwa-ios')[0];
// //             if (iOS_PWA) {
// //                 var iOS_Window = new bootstrap.Offcanvas(iOS_PWA)
// //             }
// //             var Android_PWA = document.querySelectorAll('#menu-install-pwa-android')[0];
// //             if (Android_PWA) {
// //                 var Android_Window = new bootstrap.Offcanvas(Android_PWA)
// //             }

// //             var checkPWA = document.getElementsByTagName('html')[0];
// //             if (!checkPWA.classList.contains('isPWA')) {
// //                 if ('serviceWorker' in navigator) {
// //                     window.addEventListener('load', function() {
// //                         navigator.serviceWorker.register(pwaLocation, {
// //                             scope: pwaScope
// //                         }).then(function(registration) {
// //                             registration.update();
// //                         })
// //                     });
// //                 }

              
// //                 //Trigger Install Prompt for Android
// //                 const pwaWindows = document.querySelectorAll('#menu-install-pwa-android, #menu-install-pwa-ios');
// //                 if (pwaWindows.length) {
// //                     if (isMobile.Android()) {
// //                         if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
// //                             function showInstallPrompt() {
// //                                 setTimeout(function() {
// //                                     if (!window.matchMedia('(display-mode: fullscreen)').matches) {
// //                                         console.log('Triggering PWA Window for Android')
// //                                         Android_Window.show()
// //                                     }
// //                                 }, 3500);
// //                             }
// //                             var deferredPrompt;
// //                             window.addEventListener('beforeinstallprompt', (e) => {
// //                                 e.preventDefault();
// //                                 deferredPrompt = e;
// //                                 showInstallPrompt();
// //                             });
// //                         }
// //                         const pwaInstall = document.querySelectorAll('.pwa-install');
// //                         pwaInstall.forEach(el => el.addEventListener('click', e => {
// //                             deferredPrompt.prompt();
// //                             deferredPrompt.userChoice
// //                                 .then((choiceResult) => {
// //                                     if (choiceResult.outcome === 'accepted') {
// //                                         console.log('Added');
// //                                     } else {
// //                                         localStorage.setItem(pwaName + '-PWA-Timeout-Value', now);
// //                                         localStorage.setItem(pwaName + '-PWA-Prompt', 'install-rejected');
// //                                         setTimeout(function() {
// //                                             if (!window.matchMedia('(display-mode: fullscreen)').matches) {
// //                                                 Android_Window.show()
// //                                             }
// //                                         }, 50);
// //                                     }
// //                                     deferredPrompt = null;
// //                                 });
// //                         }));
// //                         window.addEventListener('appinstalled', (evt) => {
// //                             Android_Window.hide()
// //                         });
// //                     }
// //                     //Trigger Install Guide iOS
// //                     if (isMobile.iOS()) {
// //                         if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
// //                             setTimeout(function() {
// //                                 if (!window.matchMedia('(display-mode: fullscreen)').matches) {
// //                                     console.log('Triggering PWA Window for iOS');
// //                                     iOS_Window.show()
// //                                 }
// //                             }, 3500);
// //                         }
// //                     }
// //                 }
// //             }
// //             checkPWA.setAttribute('class', 'isPWA');
// //         }

// //         //Remove Bootstrap OffCanvas Overflow on Load
// //         setTimeout(function() {
// //             var body = document.body;
// //             body.removeAttribute('style')
// //         }, 100);

// //         //Page Highlights
// //         function pageHighlights() {
// //             var highlightData = document.querySelectorAll('[data-change-highlight]');
// //             highlightData.forEach(el => el.addEventListener('click', e => {
// //                 var highlight = el.getAttribute('data-change-highlight');
// //                 var pageHighlight = document.querySelectorAll('.page-highlight');
// //                 if (pageHighlight.length) {
// //                     pageHighlight.forEach(function(e) {
// //                         e.remove();
// //                     });
// //                 }
// //                 var loadHighlight = document.createElement("link");
// //                 loadHighlight.rel = "stylesheet";
// //                 loadHighlight.className = "page-highlight";
// //                 loadHighlight.type = "text/css";
// //                 loadHighlight.href = 'styles/highlights/' + highlight + '.css';
// //                 document.getElementsByTagName("head")[0].appendChild(loadHighlight);
// //                 document.body.setAttribute('data-highlight', 'highlight-' + highlight)
// //                 localStorage.setItem(pwaName + '-Highlight', highlight)
// //             }))
// //             var rememberHighlight = localStorage.getItem(pwaName + '-Highlight');
// //             if (rememberHighlight) {
// //                 document.body.setAttribute('data-highlight', rememberHighlight);
// //                 var loadHighlight = document.createElement("link");
// //                 loadHighlight.rel = "stylesheet";
// //                 loadHighlight.className = "page-highlight";
// //                 loadHighlight.type = "text/css";
// //                 loadHighlight.href = 'styles/highlights/' + rememberHighlight + '.css';
// //                 if (!document.querySelectorAll('.page-highlight').length) {
// //                     document.getElementsByTagName("head")[0].appendChild(loadHighlight);
// //                     document.body.setAttribute('data-highlight', 'highlight-' + rememberHighlight)
// //                 }
// //             }
// //         }
// //         pageHighlights();

// //         //Lazy Loading
// //         var lazyLoad = new LazyLoad();

// //         // Check Documentation folder for detailed explanations on
// //         // Externally loading Javascript files for better performance.

// //         var plugIdent, plugClass, plugMain, plugCall;
// //         var plugLoc = "plugins/"

// //         let plugins = [{
// //                 //Example of how to call an external script.
// //                 id: 'uniqueID', // to detect if loaded and unload if no longer required.
// //                 plug: 'pluginName/plugin.js', // the main plugin javascript file
// //                 call: 'pluginName/pluginName-call.js', // the plugin call functions
// //                 style: 'pluginName/pluginName-style.css', // the plugin stylesheet
// //                 trigger: '.pluginTriggerClass' // the class inside the page that will activate plugin load
// //             },
// //             {
// //                 id: 'apex-chart',
// //                 plug: 'apex/apexcharts.js',
// //                 call: 'apex/apex-call.js',
// //                 trigger: '.chart'
// //             },
// //             {
// //                 id: 'demo-functions', // can be deleted
// //                 call: 'demo/demo.js', // can be deleted
// //                 trigger: '.demo-boxed' // can be deleted
// //             }
// //         ];

// //         //External Script Loader
// //         for (let i = 0; i < plugins.length; i++) {
// //             //Remove Previous Calls
// //             if (document.querySelectorAll('.' + plugins[i].id + '-c').length) {
// //                 document.querySelectorAll('.' + plugins[i].id + '-c')[0].remove();
// //             }

// //             //Load Plugins
// //             var plugTrigger = document.querySelectorAll(plugins[i].trigger)
// //             if (plugTrigger.length) {
// //                 var loadScript = document.getElementsByTagName('script')[1],
// //                     loadScriptJS = document.createElement('script');
// //                 loadScriptJS.type = 'text/javascript'
// //                 loadScriptJS.className = plugins[i].id + '-p'
// //                 loadScriptJS.src = plugLoc + plugins[i].plug
// //                 loadScriptJS.addEventListener('load', function() {
// //                     //Once plugin is loaded, load the call.
// //                     if (plugins[i].call !== undefined) {
// //                         var callFn = document.getElementsByTagName('script')[2],
// //                             callJS = document.createElement('script');
// //                         callJS.type = 'text/javascript'
// //                         callJS.className = plugins[i].id + '-c'
// //                         callJS.src = plugLoc + plugins[i].call
// //                         callFn.parentNode.insertBefore(callJS, callFn);
// //                     }
// //                 });
// //                 //If plugin doesn't exist, load it
// //                 if (!document.querySelectorAll('.' + plugins[i].id + '-p').length && plugins[i].plug !== undefined) {
// //                     loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
// //                 } else {
// //                     //If plugin doesn't exist, only load the call function
// //                     setTimeout(function() {
// //                         var loadScript = document.getElementsByTagName('script')[1],
// //                             loadScriptJS = document.createElement('script');
// //                         loadScriptJS.type = 'text/javascript'
// //                         loadScriptJS.className = plugins[i].id + '-c'
// //                         loadScriptJS.src = plugLoc + plugins[i].call;
// //                         loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
// //                     }, 50);
// //                 }
// //                 //If Style doesn't exist in array, don't do anything
// //                 if (plugins[i].style !== undefined) {
// //                     //if style already exists, don't re-add to page.
// //                     if (!document.querySelectorAll('.' + plugins[i].id + '-s').length) {
// //                         var loadCSS = document.createElement("link");
// //                         loadCSS.className = plugins[i].id + '-s';
// //                         loadCSS.rel = "stylesheet";
// //                         loadCSS.type = "text/css";
// //                         loadCSS.href = plugLoc + plugins[i].style;
// //                         document.getElementsByTagName("head")[0].appendChild(loadCSS);
// //                     }
// //                 }
// //             }
// //         }
// //     }

// //     //Fix Scroll for AJAX pages.
// //     if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

// //     //End of Init Template
// //     if (isAJAX === true) {
// //         if (window.location.protocol !== "file:") {
// //             const options = {
// //                 containers: ["#page"],
// //                 cache: false,
// //                 animateHistoryBrowsing: false,
// //                 plugins: [
// //                     new SwupPreloadPlugin()
// //                 ],
// //                 linkSelector: 'a:not(.external-link):not(.default-link):not([href^="https"]):not([href^="http"]):not([data-gallery])'
// //             };
// //             const swup = new Swup(options);
// //             document.addEventListener('swup:pageView', (e) => {
// //                 init_template();
// //             })
// //         }
// //     }

// //     init_template();
// // });


// // // const confirmModal = document.getElementById('confirmModal');
// // // if (confirmModal) {
// // //   new bootstrap.Modal(confirmModal);
// // // }

// // // const myToast = document.getElementById('myToast');
// // // if (myToast) {
// // //   new bootstrap.Toast(myToast);
// // // }

// // // const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
// // // if (tooltipTriggerList.length > 0) {
// // //   tooltipTriggerList.map(function (tooltipTriggerEl) {
// // //     return new bootstrap.Tooltip(tooltipTriggerEl);
// // //   });
// // // }




// //Removing Preloader
// // setTimeout(function() {
// //     var preloader = document.getElementById('preloader')
// //     if (preloader) {
// //         preloader.classList.add('preloader-hide');
// //     }
// // }, 150);

// //Removing Preloader
// // setTimeout(function() {
// //     var preloader = document.getElementById('preloader')
// //     if (preloader) {
// //         preloader.classList.add('preloader-hide');
// //     }
// // }, 150);

// document.addEventListener('DOMContentLoaded', () => {
//     'use strict'

//     //Global Variables
//     let isPWA = true; // Enables or disables the service worker and PWA
//     let isAJAX = true; // AJAX transitions. Requires local server or server
//     var pwaName = "PayApp"; //Local Storage Names for PWA
//     var pwaRemind = 1; //Days to re-remind to add to home
//     var pwaNoCache = false; //Requires server and HTTPS/SSL. Will clear cache with each visit

//     //Setting Service Worker Locations scope = folder | location = service worker js location
//     var pwaScope = "/";
//     var pwaLocation = "/_service-worker.js";

//     //Place all your custom Javascript functions and plugin calls below this line
//     function init_template() {
//         //Caching Global Variables
//         var i, e, el, evt, event; //https://www.w3schools.com/js/js_performance.asp

//         var cardStack = document.querySelectorAll('.card-stack .card');
//         if (cardStack[0]) {
//             var cardHeight = document.querySelectorAll('.card-stack')[0].getAttribute('data-stack-height');
//             for (let i = 0; i < cardStack.length; i++) {
//                 cardStack[i].style.height = +cardHeight + 20 + 'px';
//                 cardStack[i].style.marginBottom = (-1) * (+cardHeight) + "px"
//                 cardStack[i].style.zIndex = 70 - i;
//                 cardStack[i].style.transform = "scale(0." + (99 - (i * 10)) + ")";
//             }

//             var btnExpandCards = document.querySelectorAll('.btn-stack-click')[0];
//             var cardStackClick = document.querySelectorAll('.card-stack-click')[0];
//             var cardStacked = document.querySelectorAll('.card-stack')[0];
//             var cardStackInfo = document.querySelectorAll('.btn-stack-info')[0]

//             function stackEffect() {
//                 if (cardStacked.classList.contains('card-stack-active')) {
//                     cardStackInfo.classList.remove('disabled');
//                     btnExpandCards.classList.add('disabled');
//                     cardStackClick.classList.remove('no-click');
//                     cardStacked.classList.remove('card-stack-active');
//                 } else {
//                     cardStackInfo.classList.add('disabled');
//                     btnExpandCards.classList.remove('disabled');
//                     cardStackClick.classList.add('no-click');
//                     cardStacked.classList.add('card-stack-active');
//                 }
//             }
//             cardStackClick.addEventListener('click', function(e) {
//                 stackEffect()
//             })
//             btnExpandCards.addEventListener('click', function(e) {
//                 stackEffect()
//             })
//         }

//         //Activating the Page - Required to improve CLS Performance
//         document.querySelectorAll('#page')[0].style.display = "block";

//         //Image Sliders
//         var splide = document.getElementsByClassName('splide');
//         if (splide.length) {
//             var singleSlider = document.querySelectorAll('.single-slider');
//             if (singleSlider.length) {
//                 singleSlider.forEach(function(e) {
//                     var single = new Splide('#' + e.id, {
//                         type: 'loop',
//                         autoplay: true,
//                         interval: 4000,
//                         perPage: 1,
//                     }).mount();
//                     var sliderNext = document.querySelectorAll('.slider-next');
//                     var sliderPrev = document.querySelectorAll('.slider-prev');
//                     sliderNext.forEach(el => el.addEventListener('click', el => {
//                         single.go('>');
//                     }));
//                     sliderPrev.forEach(el => el.addEventListener('click', el => {
//                         single.go('<');
//                     }));
//                 });
//             }

//             var doubleSlider = document.querySelectorAll('.double-slider');
//             if (doubleSlider.length) {
//                 doubleSlider.forEach(function(e) {
//                     var double = new Splide('#' + e.id, {
//                         type: 'loop',
//                         autoplay: true,
//                         interval: 4000,
//                         arrows: false,
//                         perPage: 2,
//                     }).mount();
//                 });
//             }

//             var tripleSlider = document.querySelectorAll('.triple-slider');
//             if (tripleSlider.length) {
//                 tripleSlider.forEach(function(e) {
//                     var triple = new Splide('#' + e.id, {
//                         type: 'loop',
//                         autoplay: true,
//                         interval: 4000,
//                         arrows: false,
//                         perPage: 3,
//                         perMove: 1,
//                     }).mount();
//                 });
//             }

//             var quadSlider = document.querySelectorAll('.quad-slider');
//             if (quadSlider.length) {
//                 quadSlider.forEach(function(e) {
//                     var quad = new Splide('#' + e.id, {
//                         type: 'loop',
//                         autoplay: true,
//                         interval: 4000,
//                         arrows: false,
//                         perPage: 4,
//                         perMove: 1,
//                     }).mount();
//                 });
//             }
//         }

//         //Don't jump when Empty Links
//         const emptyHref = document.querySelectorAll('a[href="#"]')
//         emptyHref.forEach(el => el.addEventListener('click', e => {
//             e.preventDefault();
//             return false;
//         }));

//         //Opening Submenu
//         function submenus() {
//             var subTrigger = document.querySelectorAll('[data-submenu]');
//             if (subTrigger.length) {
//                 var submenuActive = document.querySelectorAll('.submenu-active')[0];
//                 if (submenuActive) {
//                     var subData = document.querySelectorAll('.submenu-active')[0].getAttribute('data-submenu');
//                     var subId = document.querySelectorAll('#' + subData);
//                     var subIdNodes = document.querySelectorAll('#' + subData + ' a');
//                     var subChildren = subIdNodes.length
//                     var subHeight = subChildren * 43;
//                     subId[0].style.height = subHeight + 'px';
//                 }

//                 subTrigger.forEach(el => el.addEventListener('click', e => {
//                     const subData = el.getAttribute('data-submenu');
//                     var subId = document.querySelectorAll('#' + subData);
//                     var subIdNodes = document.querySelectorAll('#' + subData + ' a');
//                     var subChildren = subIdNodes.length
//                     var subHeight = subChildren * 43;
//                     if (el.classList.contains('submenu-active')) {
//                         subId[0].style.height = '0px';
//                         el.classList.remove('submenu-active');
//                     } else {
//                         subId[0].style.height = subHeight + 'px';
//                         el.classList.add('submenu-active');
//                     }
//                     return false
//                 }));
//             }
//         }

//         //Activate Selected Menu
//         function activatePage() {
//             var activeMenu = document.querySelectorAll('[data-menu-active]');
//             if (activeMenu) {
//                 var activeData = activeMenu[0].getAttribute('data-menu-active');
//                 var activeID = document.querySelectorAll('#' + activeData)[0]
//                 activeID.classList.add('list-group-item-active')
//                 if (activeID.parentNode.classList.contains('list-submenu')) {
//                     var triggerSub = activeID.parentNode.getAttribute('id')
//                     document.querySelectorAll('[data-submenu="' + triggerSub + '"]')[0].classList.add('submenu-active');
//                     submenus();
//                 }
//             }
//         }

//         //Search Page
//         var searchField = document.querySelectorAll('[data-search]');
//         if (searchField.length) {
//             var searchResults = document.querySelectorAll('.search-results')
//             var searchNoResults = document.querySelectorAll('.search-no-results');
//             var searchTotal = document.querySelectorAll(".search-results div")[0].childElementCount;

//             function searchFunction() {
//                 var searchStr = searchField[0].value;
//                 var searchVal = searchStr.toLowerCase();
//                 if (searchVal != '') {
//                     searchResults[0].classList.remove('disabled-search-list');
//                     var searchFilterItem = document.querySelectorAll('[data-filter-item]');
//                     for (let i = 0; i < searchFilterItem.length; i++) {
//                         var searchData = searchFilterItem[i].getAttribute('data-filter-name');
//                         if (searchData.includes(searchVal)) {
//                             searchFilterItem[i].classList.remove('disabled');
//                         } else {
//                             searchFilterItem[i].classList.add('disabled');
//                         }
//                         var disabledResults = document.querySelectorAll(".search-results div")[0].getElementsByClassName("disabled").length;
//                         if (disabledResults === searchTotal) {
//                             searchNoResults[0].classList.remove('disabled');
//                         } else {
//                             searchNoResults[0].classList.add('disabled');
//                         }
//                     }
//                 }
//                 if (searchVal === '') {
//                     searchResults[0].classList.add('disabled-search-list');
//                     searchNoResults[0].classList.add('disabled');
//                     var searchFilterItem = document.querySelectorAll('[data-filter-item]');
//                     for (let i = 0; i < searchFilterItem.length; i++) {
//                         searchFilterItem[i].classList.remove('disabled');
//                     }
//                 }
//                 if (searchVal.length === 0) {
//                     searchResults[0].classList.add('disabled-search-list');
//                     searchNoResults[0].classList.add('disabled');
//                     var searchFilterItem = document.querySelectorAll('[data-filter-item]');
//                     for (let i = 0; i < searchFilterItem.length; i++) {
//                         searchFilterItem[i].classList.remove('disabled');
//                     }
//                 }
//             };
//             searchField[0].addEventListener('change', function() {
//                 searchFunction();
//             })
//             searchField[0].addEventListener('keyup', function() {
//                 searchFunction();
//             })
//             searchField[0].addEventListener('keydown', function() {
//                 searchFunction();
//             })
//             searchField[0].addEventListener('click', function() {
//                 searchFunction();
//             })
//         }

//         //Back Button
//         const backButton = document.querySelectorAll('[data-back-button]');
//         if (backButton.length) {
//             backButton.forEach(el => el.addEventListener('click', e => {
//                 e.stopPropagation;
//                 e.preventDefault;
//                 window.history.go(-1);
//             }));
//         }

//         //Auto Activate OffCanvas
//         var autoActivateMenu = document.querySelectorAll('[data-auto-activate]')[0];
//         if (autoActivateMenu) {
//             setTimeout(function() {
//                 var autoActivate = new bootstrap.Offcanvas(autoActivateMenu)
//                 autoActivate.show();
//             }, 600)
//         }

//         //Open Offcanvas and Hide Automatically
//         var autoHide = document.querySelectorAll('[data-auto-hide-target]')
//         autoHide.forEach(el => el.addEventListener('click', e => {
//             var offCanvasID = el.getAttribute('data-auto-hide-target');
//             var offCanvasTime = el.getAttribute('data-auto-hide-time');
//             var autoHideMenu = document.querySelectorAll(offCanvasID)[0];
//             var canvasIdenter = new bootstrap.Offcanvas(autoHideMenu);
//             canvasIdenter.show();
//             setTimeout(function() {
//                 canvasIdenter.hide();
//             }, offCanvasTime)
//         }));

//         //Card Extender
//         const cards = document.getElementsByClassName('card');

//         function card_extender() {
//             for (let i = 0; i < cards.length; i++) {
//                 if (cards[i].getAttribute('data-card-height') === "cover") {
//                     if (window.matchMedia('(display-mode: fullscreen)').matches) {
//                         var windowHeight = window.outerHeight;
//                     }
//                     if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                         var windowHeight = window.innerHeight;
//                     }
//                     var coverHeight = windowHeight + 'px';
//                 }
//                 if (cards[i].hasAttribute('data-card-height')) {
//                     var getHeight = cards[i].getAttribute('data-card-height');
//                     cards[i].style.height = getHeight + 'px';
//                     if (getHeight === "cover") {
//                         var totalHeight = getHeight
//                         cards[i].style.height = coverHeight
//                     }
//                 }
//             }
//         }
//         if (cards.length) {
//             card_extender();
//             window.addEventListener("resize", card_extender);
//         }

//         //Dark Mode
//         function darkMode() {
//             var toggleDark = document.querySelectorAll('[data-toggle-theme]');

//             function activateDarkMode() {
//                 document.getElementById('theme-check').setAttribute('content', '#1f1f1f')
//                 document.body.classList.add('theme-dark');
//                 document.body.classList.remove('theme-light', 'detect-theme');
//                 for (let i = 0; i < toggleDark.length; i++) {
//                     toggleDark[i].checked = "checked"
//                 };
//                 localStorage.setItem(pwaName + '-Theme', 'dark-mode');
//                 removeTransitions();
//                 setTimeout(function() {
//                     addTransitions();
//                 }, 650);
//             }

//             function activateLightMode() {
//                 document.getElementById('theme-check').setAttribute('content', '#FFFFFF')
//                 document.body.classList.add('theme-light');
//                 document.body.classList.remove('theme-dark', 'detect-theme');
//                 for (let i = 0; i < toggleDark.length; i++) {
//                     toggleDark[i].checked = false
//                 };
//                 localStorage.setItem(pwaName + '-Theme', 'light-mode');
//                 removeTransitions();
//                 setTimeout(function() {
//                     addTransitions();
//                 }, 650);
//             }

//             function setColorScheme() {
//                 const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
//                 const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
//                 const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
//                 window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
//                 window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
//                 if (isDarkMode) activateDarkMode();
//                 if (isLightMode) activateLightMode();
//             }

//             //Activating Dark Mode
//             var darkModeSwitch = document.querySelectorAll('[data-toggle-theme]')
//             darkModeSwitch.forEach(el => el.addEventListener('click', e => {
//                 if (document.body.className == "theme-light") {
//                     removeTransitions();
//                     activateDarkMode();
//                 } else if (document.body.className == "theme-dark") {
//                     removeTransitions();
//                     activateLightMode();
//                 }
//                 setTimeout(function() {
//                     addTransitions();
//                 }, 350);
//             }));

//             //Set Color Based on Remembered Preference.
//             if (localStorage.getItem(pwaName + '-Theme') == "dark-mode") {
//                 for (let i = 0; i < toggleDark.length; i++) {
//                     toggleDark[i].checked = "checked"
//                 };
//                 document.body.className = 'theme-dark';
//             }
//             if (localStorage.getItem(pwaName + '-Theme') == "light-mode") {
//                 document.body.className = 'theme-light';
//             }
//             if (document.body.className == "detect-theme") {
//                 setColorScheme();
//             }

//             //Detect Dark/Light Mode
//             const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
//             darkModeDetect.forEach(el => el.addEventListener('click', e => {
//                 document.body.classList.remove('theme-light', 'theme-dark');
//                 document.body.classList.add('detect-theme')
//                 setTimeout(function() {
//                     setColorScheme();
//                 }, 50)
//             }))

//             function removeTransitions() {
//                 document.body.classList.add('no-ani');
//             }

//             function addTransitions() {
//                 document.body.classList.remove('no-ani');
//             }
//         }
//         darkMode();

//         //File Upload
//         const inputArray = document.getElementsByClassName('upload-file');
//         if (inputArray.length) {
//             inputArray[0].addEventListener('change', prepareUpload, false);

//             function prepareUpload(event) {
//                 if (this.files && this.files[0]) {
//                     var img = document.getElementById('image-data');
//                     img.src = URL.createObjectURL(this.files[0]);
//                     img.classList.add('mt-4', 'mb-3', 'mx-auto');
//                 }
//                 const files = event.target.files;
//                 const fileName = files[0].name;
//                 const fileSize = (files[0].size / 1000).toFixed(2) + 'kb';
//                 const textBefore = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-before');
//                 const textAfter = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-after');
//                 document.getElementsByClassName('upload-file-name')[0].innerHTML = textBefore + ' ' + fileName + ' - ' + fileSize + ' - ' + textAfter;
//                 document.getElementsByClassName('upload-file-name')[0].classList.add('pb-3');
//             }
//         }

//         //Activating Off Canvas
//         var offCanvasBoxes = document.querySelectorAll('.offcanvas');
//         if (offCanvasBoxes) {
//             setTimeout(function() {
//                 offCanvasBoxes.forEach(function(e) {
//                     e.style.display = "block";
//                 })
//             }, 250)
//         }

//         //Calling Functions Required After External Menus are Loaded
//         var dataMenuLoad = document.querySelectorAll('[data-menu-load]')
//         dataMenuLoad.forEach(function(e) {
//             var menuLoad = e.getAttribute('data-menu-load')
//             fetch(menuLoad)
//                 .then(data => data.text())
//                 .then(html => e.innerHTML = html)
//                 .then(data => {
//                     setTimeout(function() {
//                         if (dataMenuLoad[dataMenuLoad.length - 1] === e) {
//                             darkMode();
//                             submenus();
//                             pageHighlights();
//                             activatePage();
//                         }
//                     }, 500);
//                 }).catch(function() {
//                     e.innerHTML = "<h5 class='font-16 px-4 py-4 mb-0'>Please use a Local Server such as AMPPS or WAMP to see externally loaded menus or put " + pwaName + " files on your server. <br> To load menus from inside your HTML you must remove the data-menu-load=`your-menu.html` and copy what is inside your-menu.html in this div. <br>Using external menus, editing a single menu will show in all pages. <br><br> For more information please read the Documentation -> Menu Chapter.</h5>";
//                 });
//         })

//         //Adding Local Storage for Visited Links
//         var checkVisited = document.querySelectorAll('.check-visited');
//         if (checkVisited) {
//             function check_visited_links() {
//                 var visited_links = JSON.parse(localStorage.getItem(pwaName + '_Visited_Links')) || [];
//                 var links = document.querySelectorAll('.check-visited a');
//                 for (let i = 0; i < links.length; i++) {
//                     var that = links[i];
//                     that.addEventListener('click', function(e) {
//                         var clicked_url = this.href;
//                         if (visited_links.indexOf(clicked_url) == -1) {
//                             visited_links.push(clicked_url);
//                             localStorage.setItem(pwaName + '_Visited_Links', JSON.stringify(visited_links));
//                         }
//                     })
//                     if (visited_links.indexOf(that.href) !== -1) {
//                         that.className += ' visited-link';
//                     }
//                 }
//             }
//             check_visited_links();
//         }

//         //Scrolling Header
//         var scrollItems = document.querySelectorAll('.header-auto-show')
//         if (scrollItems.length) {
//             var scrollHeader = document.querySelectorAll('.header-auto-show');
//             window.addEventListener('scroll', function() {
//                 if (document.querySelectorAll('.scroll-ad, .header-auto-show').length) {
//                     function showHeader() {
//                         scrollHeader[0].classList.add('header-active');
//                     }

//                     function hideHeader() {
//                         scrollHeader[0].classList.remove('header-active');
//                     }
//                     var window_height = window.outerWidth;
//                     var total_scroll_height = document.documentElement.scrollTop
//                     let inside_header = total_scroll_height <= 30;
//                     var passed_header = total_scroll_height >= 30;
//                     let inside_footer = (window_height - total_scroll_height + 1000) <= 150
//                     if (scrollHeader.length) {
//                         inside_header ? hideHeader() : null
//                         passed_header ? showHeader() : null
//                     }
//                 }
//             });
//         }

//         //Stepper
//         var stepperAdd = document.querySelectorAll('.stepper-add');
//         var stepperSub = document.querySelectorAll('.stepper-sub');
//         if (stepperAdd.length) {
//             stepperAdd.forEach(el => el.addEventListener('click', event => {
//                 var currentValue = el.parentElement.querySelector('input').value
//                 el.parentElement.querySelector('input').value = +currentValue + 1
//             }))

//             stepperSub.forEach(el => el.addEventListener('click', event => {
//                 var currentValue = el.parentElement.querySelector('input').value
//                 el.parentElement.querySelector('input').value = +currentValue - 1
//             }))
//         }

//         //Link List Toggle
//         var linkListToggle = document.querySelectorAll('[data-trigger-switch]:not([data-toggle-theme])');
//         if (linkListToggle.length) {
//             linkListToggle.forEach(el => el.addEventListener('click', event => {
//                 var switchData = el.getAttribute('data-trigger-switch');
//                 el.classList.add('no-click');
//                 setTimeout(function() {
//                     el.classList.remove('no-click');
//                 }, 270)
//                 var getCheck = document.getElementById(switchData);
//                 getCheck.checked ? getCheck.checked = false : getCheck.checked = true;
//             }))
//         }

//         //Header Date
//         var headerLarge = document.querySelectorAll('.header-date')[0];
//         if (headerLarge) {
//             var weekID = new Date();
//             var weekdayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//             var monthID = new Date();
//             var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//             var dayID = new Date();
//             var dayName = dayID.getDate();
//             var daySuffix = 'th';
//             if (dayName === 1) {
//                 daySuffix = 'st'
//             };
//             if (dayName === 2) {
//                 daySuffix = 'nd'
//             };
//             if (dayName === 3) {
//                 daySuffix = 'rd'
//             };
//             if (dayName === 21) {
//                 daySuffix = 'st'
//             };
//             if (dayName === 22) {
//                 daySuffix = 'nd'
//             };
//             if (dayName === 22) {
//                 daySuffix = 'rd'
//             };
//             if (dayName === 31) {
//                 daySuffix = 'st'
//             };
//             headerLarge.innerHTML += weekdayName[weekID.getDay()] + ' ' + dayName + daySuffix + ' ' + monthNames[monthID.getMonth()]
//         }

//         //Form Validation
//         var bootstrapForms = document.querySelectorAll('.needs-validation')
//         Array.prototype.slice.call(bootstrapForms).forEach(function(bootstrapForms) {
//             bootstrapForms.addEventListener('submit', function(event) {
//                 if (!bootstrapForms.checkValidity()) {
//                     event.preventDefault();
//                     event.stopPropagation();
//                 } else {
//                     event.preventDefault();
//                     event.stopPropagation();
//                     qrFunction(event);
//                 }
//                 bootstrapForms.classList.add('was-validated')
//             }, false)
//         })

//         //Form Label Activate on Write
//         var formLabel = document.querySelectorAll('.form-label input, .form-label select, .form-label textarea');
//         formLabel.forEach(el => el.addEventListener('input', event => {
//             if (el.value == '') {
//                 el.parentElement.querySelectorAll('label')[0].classList.remove('form-label-active');
//             }
//             if (el.value !== '') {
//                 el.parentElement.querySelectorAll('label')[0].classList.add('form-label-active')
//             }
//         }));

//         //Copyright Year
//         setTimeout(function() {
//             var copyrightYear = document.querySelectorAll('.copyright-year');
//             if (copyrightYear) {
//                 copyrightYear.forEach(function(e) {
//                     var dteNow = new Date();
//                     const intYear = dteNow.getFullYear();
//                     e.textContent = intYear;
//                 });
//             }
//         }, 500);

//         //Creating Offline Alert Messages
//         var addOfflineClasses = document.querySelectorAll('.offline-message');
//         if (!addOfflineClasses.length) {
//             const offlineAlert = document.createElement('p');
//             const onlineAlert = document.createElement('p');
//             offlineAlert.className = 'offline-message bg-red-dark shadow-bg shadow-bg-s color-white';
//             offlineAlert.innerHTML = '<i class="bi bi-wifi-off pe-2"></i> No internet connection detected';
//             onlineAlert.className = 'online-message bg-green-dark shadow-bg shadow-bg-s color-white';
//             onlineAlert.innerHTML = '<i class="bi bi-wifi pe-2"></i> You are back online.';
//             document.querySelectorAll('#page')[0].appendChild(offlineAlert);
//             document.querySelectorAll('#page')[0].appendChild(onlineAlert);
//         }

//         //Online / Offline Settings
//         //Activating and Deactivating Links Based on Online / Offline State
//         function offlinePage() {
//             var anchorsDisabled = document.querySelectorAll('a');
//             anchorsDisabled.forEach(function(e) {
//                 var hrefs = e.getAttribute('href');
//                 if (hrefs.match(/.html/)) {
//                     e.classList.add('show-offline');
//                     e.setAttribute('data-link', hrefs);
//                     e.setAttribute('href', '#');
//                 }
//             });
//             var showOffline = document.querySelectorAll('.show-offline');
//             showOffline.forEach(el => el.addEventListener('click', event => {
//                 document.getElementsByClassName('offline-message')[0].classList.add('offline-message-active');
//                 setTimeout(function() {
//                     document.getElementsByClassName('offline-message')[0].classList.remove('offline-message-active');
//                 }, 1500)
//             }));
//         }

//         function onlinePage() {
//             var anchorsEnabled = document.querySelectorAll('[data-link]');
//             anchorsEnabled.forEach(function(e) {
//                 var hrefs = e.getAttribute('data-link');
//                 if (hrefs.match(/.html/)) {
//                     e.setAttribute('href', hrefs);
//                     e.removeAttribute('data-link', '');
//                 }
//             });
//         }

//         //Defining Offline/Online Variables
//         var offlineMessage = document.getElementsByClassName('offline-message')[0];
//         var onlineMessage = document.getElementsByClassName('online-message')[0];

//         //Online / Offline Status
//         function isOnline() {
//             onlinePage();
//             offlineMessage.classList.remove('offline-message-active');
//             onlineMessage.classList.add('online-message-active');
//             setTimeout(function() {
//                 onlineMessage.classList.remove('online-message-active');
//             }, 2000)
//             console.info('Connection: Online');
//         }

//         function isOffline() {
//             offlinePage();
//             onlineMessage.classList.remove('online-message-active');
//             offlineMessage.classList.add('offline-message-active');
//             setTimeout(function() {
//                 offlineMessage.classList.remove('offline-message-active');
//             }, 2000)
//             console.info('Connection: Offline');
//         }

//         var simulateOffline = document.querySelectorAll('.simulate-offline');
//         var simulateOnline = document.querySelectorAll('.simulate-online');
//         if (simulateOffline.length) {
//             simulateOffline[0].addEventListener('click', function() {
//                 isOffline()
//             });
//             simulateOnline[0].addEventListener('click', function() {
//                 isOnline()
//             });
//         }

//         //Check if Online / Offline
//         function updateOnlineStatus(event) {
//             var condition = navigator.onLine ? "online" : "offline";
//             isOnline();
//         }

//         function updateOfflineStatus(event) {
//             isOffline();
//         }
//         window.addEventListener('online', updateOnlineStatus);
//         window.addEventListener('offline', updateOfflineStatus);

//         //PWA Settings
//         if (isPWA === true) {
//             //Defining PWA Windows
//             var iOS_PWA = document.querySelectorAll('#menu-install-pwa-ios')[0];
//             if (iOS_PWA) {
//                 var iOS_Window = new bootstrap.Offcanvas(iOS_PWA)
//             }
//             var Android_PWA = document.querySelectorAll('#menu-install-pwa-android')[0];
//             if (Android_PWA) {
//                 var Android_Window = new bootstrap.Offcanvas(Android_PWA)
//             }

//             var checkPWA = document.getElementsByTagName('html')[0];
//             if (!checkPWA.classList.contains('isPWA')) {
//                 if ('serviceWorker' in navigator) {
//                     window.addEventListener('load', function() {
//                         navigator.serviceWorker.register(pwaLocation, {
//                             scope: pwaScope
//                         }).then(function(registration) {
//                             registration.update();
//                         })
//                     });
//                 }

//                 //Trigger Install Prompt for Android
//                 const pwaWindows = document.querySelectorAll('#menu-install-pwa-android, #menu-install-pwa-ios');
//                 if (pwaWindows.length) {
//                     if (isMobile.Android()) {
//                         if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
//                             function showInstallPrompt() {
//                                 setTimeout(function() {
//                                     if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                                         console.log('Triggering PWA Window for Android')
//                                         Android_Window.show()
//                                     }
//                                 }, 3500);
//                             }
//                             var deferredPrompt;
//                             window.addEventListener('beforeinstallprompt', (e) => {
//                                 e.preventDefault();
//                                 deferredPrompt = e;
//                                 showInstallPrompt();
//                             });
//                         }
//                         const pwaInstall = document.querySelectorAll('.pwa-install');
//                         pwaInstall.forEach(el => el.addEventListener('click', e => {
//                             deferredPrompt.prompt();
//                             deferredPrompt.userChoice
//                                 .then((choiceResult) => {
//                                     if (choiceResult.outcome === 'accepted') {
//                                         console.log('Added');
//                                     } else {
//                                         localStorage.setItem(pwaName + '-PWA-Timeout-Value', now);
//                                         localStorage.setItem(pwaName + '-PWA-Prompt', 'install-rejected');
//                                         setTimeout(function() {
//                                             if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                                                 Android_Window.show()
//                                             }
//                                         }, 50);
//                                     }
//                                     deferredPrompt = null;
//                                 });
//                         }));
//                         window.addEventListener('appinstalled', (evt) => {
//                             Android_Window.hide()
//                         });
//                     }
//                     //Trigger Install Guide iOS
//                     if (isMobile.iOS()) {
//                         if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
//                             setTimeout(function() {
//                                 if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                                     console.log('Triggering PWA Window for iOS');
//                                     iOS_Window.show()
//                                 }
//                             }, 3500);
//                         }
//                     }
//                 }
//             }
//             checkPWA.setAttribute('class', 'isPWA');
//         }

//         //Remove Bootstrap OffCanvas Overflow on Load
//         setTimeout(function() {
//             var body = document.body;
//             body.removeAttribute('style')
//         }, 100);

//         //Page Highlights
//         function pageHighlights() {
//             var highlightData = document.querySelectorAll('[data-change-highlight]');
//             highlightData.forEach(el => el.addEventListener('click', e => {
//                 var highlight = el.getAttribute('data-change-highlight');
//                 var pageHighlight = document.querySelectorAll('.page-highlight');
//                 if (pageHighlight.length) {
//                     pageHighlight.forEach(function(e) {
//                         e.remove();
//                     });
//                 }
//                 var loadHighlight = document.createElement("link");
//                 loadHighlight.rel = "stylesheet";
//                 loadHighlight.className = "page-highlight";
//                 loadHighlight.type = "text/css";
//                 loadHighlight.href = 'styles/highlights/' + highlight + '.css';
//                 document.getElementsByTagName("head")[0].appendChild(loadHighlight);
//                 document.body.setAttribute('data-highlight', 'highlight-' + highlight)
//                 localStorage.setItem(pwaName + '-Highlight', highlight)
//             }))
//             var rememberHighlight = localStorage.getItem(pwaName + '-Highlight');
//             if (rememberHighlight) {
//                 document.body.setAttribute('data-highlight', rememberHighlight);
//                 var loadHighlight = document.createElement("link");
//                 loadHighlight.rel = "stylesheet";
//                 loadHighlight.className = "page-highlight";
//                 loadHighlight.type = "text/css";
//                 loadHighlight.href = 'styles/highlights/' + rememberHighlight + '.css';
//                 if (!document.querySelectorAll('.page-highlight').length) {
//                     document.getElementsByTagName("head")[0].appendChild(loadHighlight);
//                     document.body.setAttribute('data-highlight', 'highlight-' + rememberHighlight)
//                 }
//             }
//         }
//         pageHighlights();

//         //Lazy Loading
//         var lazyLoad = new LazyLoad();

//         // Check Documentation folder for detailed explanations on
//         // Externally loading Javascript files for better performance.

//         var plugIdent, plugClass, plugMain, plugCall;
//         var plugLoc = "plugins/"

//         let plugins = [{
//                 id: 'uniqueID',
//                 plug: 'pluginName/plugin.js',
//                 call: 'pluginName/pluginName-call.js',
//                 style: 'pluginName/pluginName-style.css',
//                 trigger: '.pluginTriggerClass'
//             },
//             {
//                 id: 'apex-chart',
//                 plug: 'apex/apexcharts.js',
//                 call: 'apex/apex-call.js',
//                 trigger: '.chart'
//             },
//             {
//                 id: 'demo-functions',
//                 call: 'demo/demo.js',
//                 trigger: '.demo-boxed'
//             }
//         ];

//         //External Script Loader
//         for (let i = 0; i < plugins.length; i++) {
//             //Remove Previous Calls
//             if (document.querySelectorAll('.' + plugins[i].id + '-c').length) {
//                 document.querySelectorAll('.' + plugins[i].id + '-c')[0].remove();
//             }

//             //Load Plugins
//             var plugTrigger = document.querySelectorAll(plugins[i].trigger)
//             if (plugTrigger.length) {
//                 var loadScript = document.getElementsByTagName('script')[1],
//                     loadScriptJS = document.createElement('script');
//                 loadScriptJS.type = 'text/javascript'
//                 loadScriptJS.className = plugins[i].id + '-p'
//                 loadScriptJS.src = plugLoc + plugins[i].plug
//                 loadScriptJS.addEventListener('load', function() {
//                     //Once plugin is loaded, load the call.
//                     if (plugins[i].call !== undefined) {
//                         var callFn = document.getElementsByTagName('script')[2],
//                             callJS = document.createElement('script');
//                         callJS.type = 'text/javascript'
//                         callJS.className = plugins[i].id + '-c'
//                         callJS.src = plugLoc + plugins[i].call
//                         callFn.parentNode.insertBefore(callJS, callFn);
//                     }
//                 });
//                 //If plugin doesn't exist, load it
//                 if (!document.querySelectorAll('.' + plugins[i].id + '-p').length && plugins[i].plug !== undefined) {
//                     loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
//                 } else {
//                     //If plugin doesn't exist, only load the call function
//                     setTimeout(function() {
//                         var loadScript = document.getElementsByTagName('script')[1],
//                             loadScriptJS = document.createElement('script');
//                         loadScriptJS.type = 'text/javascript'
//                         loadScriptJS.className = plugins[i].id + '-c'
//                         loadScriptJS.src = plugLoc + plugins[i].call;
//                         loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
//                     }, 50);
//                 }
//                 //If Style doesn't exist in array, don't do anything
//                 if (plugins[i].style !== undefined) {
//                     //if style already exists, don't re-add to page.
//                     if (!document.querySelectorAll('.' + plugins[i].id + '-s').length) {
//                         var loadCSS = document.createElement("link");
//                         loadCSS.className = plugins[i].id + '-s';
//                         loadCSS.rel = "stylesheet";
//                         loadCSS.type = "text/css";
//                         loadCSS.href = plugLoc + plugins[i].style;
//                         document.getElementsByTagName("head")[0].appendChild(loadCSS);
//                     }
//                 }
//             }
//         }
//     }

//     init_template();
// });














// incase admin add and subtract balance is needed 
// // users.js - Updated with proper balance update functionality
// document.addEventListener('DOMContentLoaded', function () {
//     // DOM Elements
//     const elements = {
//         menuToggle: document.getElementById('menuToggle'),
//         sidebar: document.getElementById('sidebar'),
//         sidebarOverlay: document.getElementById('sidebarOverlay'),
//         viewUserModal: document.getElementById('viewUserModal'),
//         closeViewModal: document.getElementById('closeViewModal'),
//         closeView: document.getElementById('closeView'),
//         editFromView: document.getElementById('editFromView'),
//         editUserModal: document.getElementById('editUserModal'),
//         closeEditModal: document.getElementById('closeEditModal'),
//         cancelEdit: document.getElementById('cancelEdit'),
//         saveUserChanges: document.getElementById('saveUserChanges'),
//         suspendUser: document.getElementById('suspendUser'),
//         confirmationModal: document.getElementById('confirmationModal'),
//         closeConfirmationModal: document.getElementById('closeConfirmationModal'),
//         cancelAction: document.getElementById('cancelAction'),
//         confirmAction: document.getElementById('confirmAction'),
//         confirmationTitle: document.getElementById('confirmationTitle'),
//         confirmationMessage: document.getElementById('confirmationMessage')
//     };
//     // Log missing elements
//     Object.entries(elements).forEach(([key, element]) => {
//         if (!element) console.error(`Element with ID '${key}' not found`);
//     });
//     // Initialize window.usersData if not set
//     window.usersData = window.usersData || {};
//     // Mobile sidebar toggle
//     if (elements.menuToggle && elements.sidebar && elements.sidebarOverlay) {
//         elements.menuToggle.addEventListener('click', () => {
//             console.log('Menu toggle clicked');
//             elements.sidebar.classList.toggle('active');
//             elements.sidebarOverlay.classList.toggle('active');
//         });
//         elements.sidebarOverlay.addEventListener('click', () => {
//             console.log('Sidebar overlay clicked');
//             elements.sidebar.classList.remove('active');
//             elements.sidebarOverlay.classList.remove('active');
//         });
//     }
//     // Refresh user table function
//     window.refreshUserTable = function (usersData) {
//         const tbody = document.querySelector('.data-table tbody');
//         if (!tbody) {
//             console.error('Table body (.data-table tbody) not found');
//             alert("Table body not found.")
//             // Modal.error('Application Error', 'Table body not found. Please check the HTML.');
//             return;
//         }
//         tbody.innerHTML = '';
//         Object.entries(usersData).forEach(([userId, user]) => {
//             // Map API fields to table fields
//             const normalizedUser = {
//                 id: user.id || 'N/A',
//                 name: user.fullname || user.name || 'N/A',
//                 email: user.email || 'N/A',
//                 joined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : user.joined || 'N/A',
//                 status: user.isVerified === false ? 'unverified' : user.isVerified === true ? 'verified' : user.status || 'unverified',
//                 balance: Number(user.walletBalance || user.balance || 0).toFixed(2),
//                 phone: user.phone || 'N/A',
//                 country: user.country || 'N/A',
//                 plan: user.plan || 'No Plan',
//                 lastLogin: user.lastLogin || 'N/A'
//             };
//             const actions = normalizedUser.status === 'banned'
//                 ? `<button class="btn btn-sm btn-primary unsuspend-user-btn" data-user-id="${userId}">Unsuspend</button>`
//                 : `<button class="btn btn-sm btn-primary view-user-btn" data-user-id="${userId}">View</button>
//                    <button class="btn btn-sm btn-secondary edit-user-btn" data-user-id="${userId}">Edit</button>`;
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${normalizedUser.id}</td>
//                 <td>${normalizedUser.name}</td>
//                 <td>${normalizedUser.email}</td>
//                 <td>${normalizedUser.joined}</td>
//                 <td><span class="badge ${normalizedUser.status === 'verified' ? 'badge-approved' : normalizedUser.status === 'unverified' ? 'badge-pending' : 'badge-rejected'}">${normalizedUser.status.charAt(0).toUpperCase() + normalizedUser.status.slice(1)}</span></td>
//                 <td>$${normalizedUser.balance}</td>
//                 <td>${actions}</td>
//             `;
//             tbody.appendChild(row);
//         });
//         // Reattach event listeners
//         document.querySelectorAll('.view-user-btn').forEach(btn => {
//             btn.addEventListener('click', function () {
//                 console.log('View button clicked for user:', this.getAttribute('data-user-id'));
//                 const userId = this.getAttribute('data-user-id');
//                 const user = usersData[userId];
//                 if (user && elements.viewUserModal) {
//                     const normalizedUser = {
//                         id: user.id || 'N/A',
//                         name: user.fullname || user.name || 'N/A',
//                         email: user.email || 'N/A',
//                         joined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : user.joined || 'N/A',
//                         status: user.isVerified === false ? 'unverified' : user.isVerified === true ? 'verified' : user.status || 'unverified',
//                         balance: Number(user.walletBalance || user.balance || 0).toFixed(2),
//                         phone: user.phone || 'N/A',
//                         country: user.country || 'N/A',
//                         plan: user.plan || 'No Plan',
//                         lastLogin: user.lastLogin || 'N/A'
//                     };
//                     const viewElements = {
//                         viewUserId: document.getElementById('viewUserId'),
//                         viewUserName: document.getElementById('viewUserName'),
//                         viewUserEmail: document.getElementById('viewUserEmail'),
//                         viewUserJoined: document.getElementById('viewUserJoined'),
//                         viewUserBalance: document.getElementById('viewUserBalance'),
//                         viewUserPhone: document.getElementById('viewUserPhone'),
//                         viewUserCountry: document.getElementById('viewUserCountry'),
//                         viewUserPlan: document.getElementById('viewUserPlan'),
//                         viewUserLastLogin: document.getElementById('viewUserLastLogin'),
//                         viewUserStatus: document.getElementById('viewUserStatus')
//                     };
//                     if (Object.values(viewElements).every(el => el)) {
//                         viewElements.viewUserId.textContent = normalizedUser.id;
//                         viewElements.viewUserName.textContent = normalizedUser.name;
//                         viewElements.viewUserEmail.textContent = normalizedUser.email;
//                         viewElements.viewUserJoined.textContent = normalizedUser.joined;
//                         viewElements.viewUserBalance.textContent = '$' + normalizedUser.balance;
//                         viewElements.viewUserPhone.textContent = normalizedUser.phone;
//                         viewElements.viewUserCountry.textContent = normalizedUser.country;
//                         viewElements.viewUserPlan.textContent = normalizedUser.plan;
//                         viewElements.viewUserLastLogin.textContent = normalizedUser.lastLogin;
//                         viewElements.viewUserStatus.textContent = normalizedUser.status.charAt(0).toUpperCase() + normalizedUser.status.slice(1);
//                         viewElements.viewUserStatus.className = 'badge ' + (
//                             normalizedUser.status === 'verified' ? 'badge-approved' :
//                             normalizedUser.status === 'unverified' ? 'badge-pending' : 'badge-rejected'
//                         );
//                         elements.editFromView.setAttribute('data-user-id', userId);
//                         elements.viewUserModal.classList.add('active');
//                     } else {
//                         console.error('View modal elements missing:', viewElements);
//                         // Modal.error('Application Error', 'View modal elements not found.');
//                     }
//                 }
//             });
//         });
//         document.querySelectorAll('.edit-user-btn').forEach(btn => {
//             btn.addEventListener('click', function () {
//                 console.log('Edit button clicked for user:', this.getAttribute('data-user-id'));
//                 const userId = this.getAttribute('data-user-id');
//                 openEditModal(userId);
//             });
//         });
//         document.querySelectorAll('.unsuspend-user-btn').forEach(btn => {
//             btn.addEventListener('click', function () {
//                 console.log('Unsuspend button clicked for user:', this.getAttribute('data-user-id'));
//                 const userId = this.getAttribute('data-user-id');
//                 showConfirmation('Unsuspend User', 'Are you sure you want to unsuspend this user?', () => {
//                     updateUserStatus(userId, 'verified');
//                 });
//             });
//         });
//     };
//     // Initial population
//     if (Object.keys(window.usersData).length > 0) {
//         window.refreshUserTable(window.usersData);
//     } else {
//         console.log('No initial user data, waiting for userSync.js');
//     }
//     // View user functionality
//     if (elements.closeViewModal) {
//         elements.closeViewModal.addEventListener('click', () => {
//             console.log('Close view modal clicked');
//             elements.viewUserModal.classList.remove('active');
//         });
//     }
   
//     if (elements.closeView) {
//         elements.closeView.addEventListener('click', () => {
//             console.log('Close view button clicked');
//             elements.viewUserModal.classList.remove('active');
//         });
//     }
   
//     if (elements.editFromView) {
//         elements.editFromView.addEventListener('click', function () {
//             console.log('Edit from view clicked for user:', this.getAttribute('data-user-id'));
//             const userId = this.getAttribute('data-user-id');
//             elements.viewUserModal.classList.remove('active');
//             openEditModal(userId);
//         });
//     }
//     function openEditModal(userId) {
//         const user = window.usersData[userId];
//         if (user && elements.editUserModal) {
//             const normalizedUser = {
//                 name: user.fullname || user.name || 'N/A',
//                 email: user.email || 'N/A',
//                 phone: user.phone || '',
//                 balance: Number(user.walletBalance || user.balance || 0).toFixed(2),
//                 status: user.isVerified === false ? 'unverified' : user.isVerified === true ? 'verified' : user.status || 'unverified',
//                 plan: user.plan ? user.plan.toLowerCase().replace(' plan', '') : '',
//                 country: user.country || ''
//             };
//             const editElements = {
//                 editUserId: document.getElementById('editUserId'),
//                 editUserName: document.getElementById('editUserName'),
//                 editUserEmail: document.getElementById('editUserEmail'),
//                 editUserPhone: document.getElementById('editUserPhone'),
//                 currentUserBalance: document.getElementById('currentUserBalance'),
//                 addToBalance: document.getElementById('addToBalance'),
//                 subtractFromBalance: document.getElementById('subtractFromBalance'),
//                 editUserStatus: document.getElementById('editUserStatus'),
//                 editUserPlan: document.getElementById('editUserPlan'),
//                 editUserCountry: document.getElementById('editUserCountry')
//             };
//             if (Object.values(editElements).every(el => el)) {
//                 editElements.editUserId.value = userId;
//                 editElements.editUserName.value = normalizedUser.name;
//                 editElements.editUserEmail.value = normalizedUser.email;
//                 editElements.editUserPhone.value = normalizedUser.phone;
//                 editElements.currentUserBalance.value = normalizedUser.balance;
//                 editElements.addToBalance.value = 0;
//                 editElements.subtractFromBalance.value = 0;
//                 editElements.editUserStatus.value = normalizedUser.status;
//                 editElements.editUserPlan.value = normalizedUser.plan;
//                 editElements.editUserCountry.value = normalizedUser.country;
               
//                 // Make all fields except add/subtract read-only
//                 editElements.editUserName.setAttribute('readonly', true);
//                 editElements.editUserEmail.setAttribute('readonly', true);
//                 editElements.editUserPhone.setAttribute('readonly', true);
//                 editElements.editUserStatus.setAttribute('disabled', true);
//                 editElements.editUserPlan.setAttribute('disabled', true);
//                 editElements.editUserCountry.setAttribute('readonly', true);
               
//                 elements.editUserModal.classList.add('active');
//             } else {
//                 console.error('Edit modal elements missing:', editElements);
//                 Modal.error('Application Error', 'Edit modal elements not found.');
//             }
//         }
//     }
//     if (elements.closeEditModal) {
//         elements.closeEditModal.addEventListener('click', () => {
//             console.log('Close edit modal clicked');
//             elements.editUserModal.classList.remove('active');
//         });
//     }
//     if (elements.cancelEdit) {
//         elements.cancelEdit.addEventListener('click', () => {
//             console.log('Cancel edit clicked');
//             elements.editUserModal.classList.remove('active');
//         });
//     }
//     if (elements.saveUserChanges) {
//         elements.saveUserChanges.addEventListener('click', async () => {
//             console.log('Save user changes clicked');
//             const editElements = {
//                 editUserId: document.getElementById('editUserId'),
//                 addToBalance: document.getElementById('addToBalance'),
//                 subtractFromBalance: document.getElementById('subtractFromBalance')
//             };
           
//             if (!Object.values(editElements).every(el => el)) {
//                 console.error('Edit modal elements missing:', editElements);
//                 // Modal.error('Application Error', 'Edit modal elements not found.');
//                 return;
//             }
//             const userId = editElements.editUserId.value;
//             const addAmount = parseFloat(editElements.addToBalance.value) || 0;
//             const subtractAmount = parseFloat(editElements.subtractFromBalance.value) || 0;

//             if (addAmount < 0 || subtractAmount < 0) {
//                 showConfirmation('Error', 'Amounts cannot be negative.');
//                 return;
//             }

//             if (addAmount > 0 && subtractAmount > 0) {
//                 showConfirmation('Error', 'Please enter either an add amount or a subtract amount, not both.');
//                 return;
//             }

//             let amount = 0;
//             let action = '';
//             if (addAmount > 0) {
//                 amount = addAmount;
//                 action = 'add';
//             } else if (subtractAmount > 0) {
//                 amount = subtractAmount;
//                 action = 'subtract';
//             } else {
//                 // No changes to balance
//                 showConfirmation('Info', 'No balance changes were made.');
//                 elements.editUserModal.classList.remove('active');
//                 return;
//             }

//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     // Modal.error('Authentication Error', 'No token found. Redirecting to login...');
//                     setTimeout(() => {
//                         window.location.href = '../index.html';
//                     }, 1500);
//                     return;
//                 }
//                 // Update balance using your API endpoint
//                 const response = await fetch(`/api/v1/admin/users/${userId}/balance`, {
//                     method: 'PATCH',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     body: JSON.stringify({ amount: amount, action: action })
//                 });
               
//                 if (!response.ok) {
//                     const errorData = await response.json().catch(() => ({}));
//                     throw new Error(errorData.message || 'Failed to update balance');
//                 }
//                 // Update local data
//                 if (window.usersData[userId]) {
//                     const currentBalance = parseFloat(window.usersData[userId].walletBalance || window.usersData[userId].balance || 0);
//                     const newBalance = action === 'add' ? currentBalance + amount : currentBalance - amount;
//                     window.usersData[userId].balance = newBalance;
//                     window.usersData[userId].walletBalance = newBalance;
//                 }
               
//                 // Refresh the table
//                 window.refreshUserTable(window.usersData);
               
//                 // Close the modal
//                 elements.editUserModal.classList.remove('active');
               
//                 // Show success message
//                 showConfirmation('Success', 'User balance updated successfully!');
//             } catch (error) {
//                 console.error('Update error:', error);
//                 showConfirmation('Error', `Failed to update user balance: ${error.message}`);
//             }
//         });
//     }
//     if (elements.suspendUser) {
//         elements.suspendUser.addEventListener('click', function () {
//             console.log('Suspend user clicked');
//             const userId = document.getElementById('editUserId').value;
//             const userName = document.getElementById('editUserName').value;
//             showConfirmation(
//                 'Suspend User',
//                 `Are you sure you want to suspend ${userName}? This will restrict their account access.`,
//                 () => {
//                     updateUserStatus(userId, 'banned');
//                 }
//             );
//         });
//     }
//     async function updateUserStatus(userId, status) {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 Modal.error('Authentication Error', 'No token found. Redirecting to login...');
//                 setTimeout(() => {
//                     window.location.href = '../index.html';
//                 }, 1500);
//                 return;
//             }
//             const response = await fetch(`/api/v1/admin/users/${userId}/verify`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//                 body: JSON.stringify({ isVerified: status === 'verified' ? true : false })
//             });
//             if (!response.ok) throw new Error('Failed to update status');
//             const updatedUser = await response.json();
//             window.usersData[userId] = {
//                 ...window.usersData[userId],
//                 isVerified: updatedUser.isVerified === true || updatedUser.isVerified,
//                 // status: updatedUser.status || (updatedUser.isVerified ? 'verified' : 'unverified')
//             };
//             window.refreshUserTable(window.usersData);
//             elements.editUserModal.classList.remove('active');
//             showConfirmation('Success', `${window.usersData[userId].fullname || window.usersData[userId].name} has been ${status === 'banned' ? 'suspended' : 'unsuspended'}.`);
//         } catch (error) {
//             console.error('Status update error:', error);
//             showConfirmation('Error', `Failed to update user status: ${error.message}`);
//         }
//     }
//     function showConfirmation(title, message, confirmCallback) {
//         if (elements.confirmationTitle && elements.confirmationMessage && elements.confirmationModal) {
//             elements.confirmationTitle.textContent = title;
//             elements.confirmationMessage.textContent = message;
//             elements.confirmationModal.classList.add('active');
//             elements.confirmAction.onclick = () => {
//                 console.log('Confirm action clicked');
//                 elements.confirmationModal.classList.remove('active');
//                 if (confirmCallback) confirmCallback();
//             };
//             elements.cancelAction.onclick = () => {
//                 console.log('Cancel action clicked');
//                 elements.confirmationModal.classList.remove('active');
//             };
//         } else {
//             console.error('Confirmation modal elements missing');
//             Modal.error('Application Error', 'Confirmation modal elements not found.');
//         }
//     }
//     if (elements.closeConfirmationModal) {
//         elements.closeConfirmationModal.addEventListener('click', () => {
//             console.log('Close confirmation modal clicked');
//             elements.confirmationModal.classList.remove('active');
//         });
//     }
// });