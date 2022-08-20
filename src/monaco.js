import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {

        return EditorWorker;
    }
};

// Defer monaco render to avoid blocking main thread
setTimeout(() => {
    window.editorHook = monaco.editor.create(document.getElementById('monaco-container'), {
        value: ['Events.Subscribe("NIDE:GET_PKG_FILES", function(player)\n' +
        '    local files = Package.GetFiles()\n' +
        '    Events.CallRemote("NIDE:SEND_PKG_FILES")\n' +
        'end)'].join('\n'),
        language: 'lua',
        theme: 'vs-dark'
    })
}, 100);
