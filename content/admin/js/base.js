var sidebar = document.querySelectorAll('.sidebar, .sidebar *, .shadow, body');
var highlight = document.querySelectorAll('.header [href], .sidebar [href]');

function menu() {
    sidebar.forEach(element => {
        element.classList.toggle('active');
    });
};

highlight.forEach(element => {
    if (element.href != window.location.href) return;
    element.classList.add('highlight');
});