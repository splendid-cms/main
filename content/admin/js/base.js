var element = document.querySelectorAll('.sidebar, .sidebar *, .shadow, body');
function menu() {
    element.forEach(element => {
        element.classList.toggle('active');
    });
};