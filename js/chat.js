var chatButton = document.getElementById('chatButton');
var nameButton = document.getElementById('nameButton');
var messageElem = document.getElementById('message');
var nameElem = document.getElementById('name');
var chatForm = document.getElementById('chatForm');
var nameForm = document.getElementById('nameForm');
var chatBody = document.getElementById('chatBody');
var user = document.getElementById('user');
var userName = document.getElementById('userName');
var signOut = document.getElementById('signOut');

var init = function() {
    userName.innerText = "Hi, " + localStorage.name + " ";

    if (localStorage.name === undefined) {
        nameForm.style.display = 'block';
        chatBody.style.display = 'none';
        chatForm.style.display = 'none';
        user.style.display = 'none';
    } else {
        nameForm.style.display = 'none';
        chatBody.style.display = 'block';
        chatForm.style.display = 'block';
        user.style.display = 'block';
    }
};

init();

chatButton.addEventListener('click', function(e) {
    e.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'index.html', true);
    var messageText = messageElem.value;
    if (messageText!=='') {
        xhr.send(localStorage.name + ": " + messageElem.value);
        messageElem.value = '';
    }
});

signOut.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.clear();
    init();
});

nameButton.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.name = nameElem.value;
    init();
});

window.setInterval(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'log.html', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            chatBody.innerHTML = xhr.responseText;
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    };
},750);