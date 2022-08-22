import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {

        return EditorWorker;
    }
};

// Defer monaco render to avoid blocking main thread
setTimeout(() => {
    window.editorHook = monaco.editor.create(document.getElementById('monaco-container'), {
        value: ['Open a file !'].join('\n'),
        language: 'lua',
        theme: 'vs-dark',
        automaticLayout: true
    })
}, 100);
