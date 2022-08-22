let currentFile;

import logo from "./logo.png";

function handleClickBtn(event) {
    if (!currentFile) return;
    let dataElement = event.target.closest('.toolbar-btn');
    const action = dataElement.getAttribute('data-action');
    if (action === "delete")
        Events.Call("NIDE:DELETE_FILE")
    if (action === "save")
        Events.Call("NIDE:SAVE_FILE", window.editorHook.getValue())
    if (action === "reload-pkg")
        Events.Call("NIDE:PKG_RELOAD")
    // console.log("Clicked action button", dataElement);
}

export function renderToolbar() {
    const content = `
        <div>
        <img src="${logo}" height="32"/></div>
        <div class="toolbar-btn" data-action="save">
            Save
        </div>
        <div class="toolbar-btn" data-action="delete">
            Delete
        </div>
        <div class="toolbar-btn " data-action="reload-pkg">
            Reload
        </div>
    `

    const container = document.getElementById("toolbar-container");
    container.innerHTML = content;
    container.addEventListener("click", handleClickBtn)
}

Events.Subscribe("NIDE:JS_CURRENT_FILE_CHANGED", (_currentFile) => {
    currentFile = JSON.parse(_currentFile);
    console.log("Current file : ", JSON.stringify(currentFile));
    renderToolbar();
});