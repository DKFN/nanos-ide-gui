import "./fileTree";
import './monaco';
import {renderToolbar} from "./toolbar";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

const extToLanguage = {
    lua: "lua",
    js: "javascript",
    ts: "typescript",
    toml: "toml",
    json: "json",
    css: "css",
    html: "html",
    htm: "html"
};

document.addEventListener("DOMContentLoaded", () => {
    renderToolbar();
});

Events.Subscribe("NIDE:JS_SEND_SEND_FILE_CONTENTS", (data) => {
    const [fileContent, fileExt] = JSON.parse(data);
    console.log("Monaco content : ", window.editorHook);
    window.editorHook.setValue(fileContent);
    const editorModel = window.editorHook.getModel();
    monaco.editor.setModelLanguage(editorModel, extToLanguage[fileExt || 'lua']);
})