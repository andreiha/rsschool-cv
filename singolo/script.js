const buttonBurger = document.getElementById('burger-icon');
const menuBurger = document.querySelector('.menu-container');
const logoBurger = document.querySelector('h1');
const overlayTint = document.getElementById('overlay-tint');

const links = document.querySelectorAll('.main-menu__link');
const sections = document.querySelectorAll('body > section');

const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
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
                if (section.getAttribute('id') == link.getAttribute('href').substring(1)) {
                    link.classList.add('main-menu_active');
                };
            });
        };
    });
});
//End JS for main menu with scrolling implementation

//Start JS for slider
    leftArrow.addEventListener('click', () => {
        slide2.classList.toggle('slide_top');
    });

    rightArrow.addEventListener('click', () => {
        slide2.classList.toggle('slide_top');
    });
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

//Start JS for main menu without scrolling
//links.forEach(link => {
//    link.addEventListener('click', (event) => {
//        clearAllMenu();
//        event.target.classList.add('main-menu_active');
//    });
//});
//
//const clearAllMenu = () => {
//    links.forEach(link => {
//        link.classList.remove('main-menu_active');
//    });
//};
//End JS for main menu without scrolling