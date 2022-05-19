var menu = document.querySelectorAll('.sidebar, .sidebar *, .shadow, body');
var highlight = document.querySelectorAll('.header [href], .sidebar [href]');
function menu() {
    menu.forEach(element => {
        element.classList.toggle('active');
    });
};

highlight.forEach(element => {
    if (element.href != window.location.href) return;
    element.classList.add('highlight');
});