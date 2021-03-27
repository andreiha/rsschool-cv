$(function () {
    let socket = io.connect('http://localhost:3000');

    let message = $('#input_message');
    let username = $('#input_username');
    let send_message = $('#send_message');
    let send_username = $('#send_username');
    let chatroom = $('#chatroom');
    let feedback = $('#feedback');

    send_message.click(() => {
        socket.emit('new_message', {
            message: message.val(),
            className: color,
        });
    });

    let min = 1;
    let max = 6;
    let random = Math.floor(Math.random() * (max - min)) + min;
    let color;
    switch (random) {
        case 1:
            color = 'gray';
            break;
        case 2:
            color = 'crimson';
            break;
        case 3:
            color = 'chlorine';
            break;
        case 4:
            color = 'orange';
            break;
        case 5:
            color = 'blue';
            break;
        case 6:
            color = 'light';
            break;
    }

    socket.on('add_mess', (data) => {
        feedback.html('');
        message.val('');
        chatroom.append(`<div class="message ${data.className}" <b>${data.username}</b>: ${data.message}</div>`);
    });

    send_username.click(() => {
        socket.emit('change_username', { username: username.val() });
    });

    message.bind('keypress', () => {
        socket.emit('typing');
    });

    socket.on('typing', (data) => {
        feedback.html(`<p><i>${data.username} typing message...</i></p>`);
    });
});
