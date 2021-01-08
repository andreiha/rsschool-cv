const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },
    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: '',
        capslock: false
    },

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');
        
        this.elements.main.classList.add('keyboard', '1keyboard_hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');

        this.elements.main.append(this.elements.keysContainer);
        document.body.append(this.elements.main);
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];
        const createIconHTML = (icon_name) => `<i class=material-icons>${icon_name}</i>`;
        
        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;
        
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            if (key === 'backspace') {
                keyElement.classList.add('keyboard__key_wide');
                keyElement.innerHTML = createIconHTML('backspace');
                keyElement.addEventListener('click', () => {
                    this.properties.value = this.properties.value.substring(0, this.properties.length-1);
                    this._triggerEvent('oninput');
                });
            } else if (key === 'caps') {
                keyElement.classList.add('keyboard__key_wide', 'keyboard__key_activatable');
                keyElement.innerHTML = createIconHTML('keyboard_capslock');
                keyElement.addEventListener('click', () => {
                    this._toggleCapsLock();
                    keyElement.classList.toggle('keyboard__key_active', this.properties.capsLock);
                });
            } else if (key === 'enter') {
                keyElement.classList.add('keyboard__key_wide');
                keyElement.innerHTML = createIconHTML('keyboard_return');
                keyElement.addEventListener('click', () => {
                    this.properties.value += '\n';
                    this._triggerEvent('oninput');
                });
            } else if (key === 'space') {
                keyElement.classList.add('keyboard__key_extra-wide');
                keyElement.innerHTML = createIconHTML('space_bar');
                keyElement.addEventListener('click', () => {
                    this.properties.value += ' ';
                    this._triggerEvent('oninput');
                });
            } else if (key === 'done') {
                keyElement.classList.add('keyboard__key_wide', 'keyboard__key_dark');
                keyElement.innerHTML = createIconHTML('check_circle');
                keyElement.addEventListener('click', () => {
                    this.close();
                    this._triggerEvent('onclose');
                });
            } else {
                keyElement.textContent = key.toLowerCase();
                keyElement.addEventListener('click', () => {
                    this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                    this._triggerEvent('oninput');
                });
            }
        });
    
        
    },

    _triggerEvent(handlerName) {
        console.log("Event Triggered! Event Name: " + handlerName);
    },

    _toggleCapsLock() {
        console.log("Caps Lock Toggled");
    },

    open(initialValue, oninput, onclose) {
        
    },

    close() {

    },
}

window.addEventListener('load', () => Keyboard.init());