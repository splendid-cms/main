let textarea = document.getElementById("editor");
function enableBeforeUnload() {
    window.onbeforeunload = function (e) {
        return "Discard changes?";
    };
}
function disableBeforeUnload() {
    window.onbeforeunload = null;
}
textarea.style.height = "1px";
textarea.style.height = (25 + textarea.scrollHeight) + "px"
textarea.oninput = function() {
    textarea.style.height = "1px";
    textarea.style.height = (25 + textarea.scrollHeight) + "px"
};


