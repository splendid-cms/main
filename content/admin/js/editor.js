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


async function switchToPreview() {
    document.getElementById("editor").style.display = "none";
    document.getElementById("preview").style.display = "block";
    document.getElementById('preview').innerHTML = await fetch('/splendid/pages/previewText', {
        method: 'POST',
        body: {
          text: document.getElementById('editor').value
        }
      }).content;
}

function switchToEditor() {
    document.getElementById("editor").style.display = "block";
    document.getElementById("preview").style.display = "none";
}