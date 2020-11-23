const buttonBurger = document.getElementById('burger-icon');
const menuBurger = document.querySelector('.menu-container');
const logoBurger = document.querySelector('h1');
const overlayTint = document.getElementById('overlay-tint');

const links = document.querySelectorAll('.main-menu__link');
const sections = document.querySelectorAll('body > section');
const sliderSection = document.querySelector('.slider');
const buttonHome = document.querySelector('.main-menu__link:first-child');

const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const slide1 = document.querySelector('.slide1-container');
const slide2 = document.querySelector('.slide2-container');

const buttons = document.querySelectorAll('.button');
const images = document.querySelectorAll('.grid-gallery__img');
const buttonAll = document.getElementById('buttonAll');
const buttonWeb = document.getElementById('buttonWeb');
const buttonGraphic = document.getElementById('buttonGraphic');
const buttonArtwork = document.getElementById('buttonArtwork');


//Start JS for burger menu
buttonBurger.addEventListener('click', () => {
    buttonBurger.classList.toggle('rotate');
    menuBurger.classList.toggle('burger-move');
    logoBurger.classList.toggle('burger-logo');
    overlayTint.classList.toggle('hidden');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            buttonBurger.classList.remove('rotate');
            menuBurger.classList.remove('burger-move');
            logoBurger.classList.remove('burger-logo');
            overlayTint.classList.add('hidden');
        });
    });
});
//End JS for burger menu

//Start JS for main menu with scrolling implementation
document.addEventListener('scroll', () => {
    const currentPosition = window.scrollY;
    sections.forEach(section => {
        if (section.offsetTop <= currentPosition && (section.offsetTop + section.offsetHeight) > currentPosition) {
            links.forEach((link) => {
                link.classList.remove('main-menu_active');
                if (section.getAttribute('id') === link.getAttribute('href').substring(1)) {
                    link.classList.add('main-menu_active');
                };
                if (sliderSection.offsetHeight === 600 && currentPosition < 600) {
                    buttonHome.classList.add('main-menu_active');
                };
                if (sliderSection.offsetHeight === 450 && currentPosition < 450) {
                    buttonHome.classList.add('main-menu_active');
                };
                if (sliderSection.offsetHeight === 220 && currentPosition < 220) {
                    buttonHome.classList.add('main-menu_active');
                };
            });
        };
    });
});
//End JS for main menu with scrolling implementation

//Start JS for slider
    leftArrow.addEventListener('click', () => {      
        removeClass();
        if(slide1.classList.contains('slide_top')) {
            slide1.classList.remove('slide_top');
            slide2.classList.add('slide_totheleft');
            slide2.classList.add('slide_top');
        } else {
            slide2.classList.remove('slide_top');
            slide1.classList.add('slide_totheleft');
            slide1.classList.add('slide_top');
        };
    });

    rightArrow.addEventListener('click', () => {
        removeClass();
        if(slide2.classList.contains('slide_top')) {
            slide2.classList.remove('slide_top');
            slide1.classList.add('slide_totheright');
            slide1.classList.add('slide_top');
        } else {
            slide1.classList.remove('slide_top');
            slide2.classList.add('slide_totheright');
            slide2.classList.add('slide_top');
        };
    });

    const removeClass = () => {
        slide1.addEventListener("transitionend", () => {
            slide1.classList.remove('slide_totheright');
            slide1.classList.remove('slide_totheleft');
            slide2.classList.remove('slide_totheright');
            slide2.classList.remove('slide_totheright');
        });
    };
//End JS for slider

//Start JS for gallery
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        clearAllButtons();
        clearAllImages();
        event.target.classList.add('button_active');
        filterButtonItems();
    });
});

const clearAllButtons = () => {
    buttons.forEach(button => {
        button.classList.remove('button_active');
    });
};

const clearAllImages = () => {
    images.forEach(image => {
        image.classList.remove('hidden');
    });
};

const filterButtonItems = () => {
    images.forEach(image => {
        if (event.target == buttonWeb && !image.classList.contains('webdesign')) {
            image.classList.add('hidden');
        } else if (event.target == buttonGraphic && !image.classList.contains('graphicdesign')) {
            image.classList.add('hidden');
        } else if (event.target == buttonArtwork && !image.classList.contains('artwork')) {
            image.classList.add('hidden');
        };
    });
};
//End JS for gallery