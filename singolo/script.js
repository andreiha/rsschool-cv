const buttons = document.querySelectorAll('.button');
const images = document.querySelectorAll('.grid-gallery__img');

const buttonAll = document.getElementById('buttonAll');
const buttonWeb = document.getElementById('buttonWeb');
const buttonGraphic = document.getElementById('buttonGraphic');
const buttonArtwork = document.getElementById('buttonArtwork');


buttons.forEach(elem => {
    elem.addEventListener('click', (event) => {
        console.log(event.target);
        clearAllButtons();
        clearAllImages();
        event.target.classList.toggle('button_active');
        filterItems();
    });
});

const clearAllButtons = () => {
    buttons.forEach(elem => {
        elem.classList.remove('button_active');
    });
};

const clearAllImages = () => {
    images.forEach(img => {
        img.classList.remove('hide');
    });
};

const filterItems = () => {
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