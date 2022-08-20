require("./fileTree");
require("./monaco");
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

Events.Subscribe("NIDE:JS_SEND_SEND_FILE_CONTENTS", (fileContent) => {
    window.editorHook.setValue(fileContent);
})