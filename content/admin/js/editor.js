const easyMDE = new EasyMDE({
    shortcuts: {
        toggleSideBySide: null,
        toggleFullScreen: null,
        togglePreview: null,
        preview: "Ctrl-P",
        save: "Ctrl-S"
    },
    placeholder: "Type here to edit/modify this page...",
    toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        {
            name: "save",
            action: (editor) => {
                let el = document.createElement("form");
                el.method = "POST";
                el.action = "";
                el.style.display = "none";
                el.innerHTML = `<textarea name="text">${easyMDE.value()}</textarea>`;
                document.body.appendChild(el);
                el.submit();
            },
            className: "fa fa-save",
            text: "Save",
            title: "Save",
        },
        {
            name: "preview",
            action: (editor) => {
                let el = document.createElement("form");
                el.method = "POST";
                el.target = "_blank";
                el.action = window.location.href.split('modify?path')[0] + "preview";
                el.style.display = "none";
                el.innerHTML = `<textarea name="text">${easyMDE.value()}</textarea>`;
                document.body.appendChild(el);
                el.submit();
            },
            className: "fa fa-eye",
            text: "Preview",
            title: "Preview In New Tab",
        },
        "|",
        "guide"
    ]
});