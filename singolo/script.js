const menu = document.querySelectorAll('.main-menu__link');
const buttons = document.querySelectorAll('.button');
const images = document.querySelectorAll('.grid-gallery__img');

const buttonAll = document.getElementById('buttonAll');
const buttonWeb = document.getElementById('buttonWeb');
const buttonGraphic = document.getElementById('buttonGraphic');
const buttonArtwork = document.getElementById('buttonArtwork');

//Start main menu implementation
menu.forEach(menuItem => {
    menuItem.addEventListener('click', (event) => {
        console.log(event.target);
        clearAllMenu();
        event.target.classList.add('main-menu_active');
    });
});

const clearAllMenu = () => {
    menu.forEach(menuItem => {
        menuItem.classList.remove('main-menu_active');
    });
};

//End main menu implementation

//Start gallery implementation
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        console.log(event.target);
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
//End gallery implementation