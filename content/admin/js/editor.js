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

function switchToEditor() {
    document.getElementById("editor").style.display = "block";
    document.getElementById("preview").style.display = "none";
    document.getElementById("editor-button").classList.add("active");
    document.getElementById("preview-button").classList.remove("active");
}

function switchToPreview() {
    document.getElementById("editor").style.display = "none";
    document.getElementById("preview").style.display = "block";
    document.getElementById("editor-button").classList.remove("active");
    document.getElementById("preview-button").classList.add("active");
}