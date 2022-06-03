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
textarea.style.height = 25 + textarea.scrollHeight + "px";
document.getElementById("preview").style.height = "1px";
document.getElementById("preview").style.height = 25 + textarea.scrollHeight + "px";
textarea.oninput = function () {
    textarea.style.height = "1px";
    textarea.style.height = 25 + textarea.scrollHeight + "px";
    document.getElementById("preview").style.height = "1px";
    document.getElementById("preview").style.height = 25 + textarea.scrollHeight + "px";
};

async function switchToPreview() {
    document.getElementById("editor").style.display = "none";
    document.getElementById("preview").style.display = "block";

    let res = await fetch("/splendid/pages/previewText", {
        // replace /splendid with whatever the api thing will be
        method: "POST",
        body: JSON.stringify({
            text: document.getElementById("editor").value,
        }),
    });
    let jsonres = await res.json()
    document.getElementById("preview").innerHTML = jsonres.content;
}

function switchToEditor() {
    document.getElementById("editor").style.display = "block";
    document.getElementById("preview").style.display = "none";
}
