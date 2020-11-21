const links = document.querySelectorAll('.main-menu__link');
const sections = document.querySelectorAll('body > section');

const buttons = document.querySelectorAll('.button');
const images = document.querySelectorAll('.grid-gallery__img');
const buttonAll = document.getElementById('buttonAll');
const buttonWeb = document.getElementById('buttonWeb');
const buttonGraphic = document.getElementById('buttonGraphic');
const buttonArtwork = document.getElementById('buttonArtwork');

//Start main menu JS implementation
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
//End main menu JS implementation


//Start gallery JS implementation
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
//        console.log(event.target);
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
        image.classList.remove('hide');
    });
};

const filterButtonItems = () => {
    images.forEach(image => {
        if (event.target == buttonWeb && !image.classList.contains('webdesign')) {
            image.classList.add('hide');
        } else if (event.target == buttonGraphic && !image.classList.contains('graphicdesign')) {
            image.classList.add('hide');
        } else if (event.target == buttonArtwork && !image.classList.contains('artwork')) {
            image.classList.add('hide');
        };
    });
};
//End gallery JS implementation






//Start main menu JS implementation
//menu.forEach(menuItem => {
//    menuItem.addEventListener('click', (event) => {
//        console.log(event.target);
//        clearAllMenu();
//        event.target.classList.add('main-menu_active');
//    });
//});

//const clearAllMenu = () => {
//    menu.forEach(menuItem => {
//        menuItem.classList.remove('main-menu_active');
//    });
//};