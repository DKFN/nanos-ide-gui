import _ from "lodash";
window.___allPackages = [];

import {iconsSet} from "./iconsExtensionConfig";
import play from "./icons/play.png";

// Indexing is path:openState
let openDirectoryState = {

};

const onClickFile = (mouseEvent) => {
    const dataContainingElement = mouseEvent.target.closest('.file-or-folder');
    const packageName = dataContainingElement.getAttribute("data-pkg");
    const filePath = dataContainingElement.getAttribute("data-filepath");
    const type = dataContainingElement.getAttribute("data-type");
    const ext = dataContainingElement.getAttribute("data-ext");
    if (type === "FILE")
        Events.Call("NIDE:CLIENT_ASK_FILE_CONTENTS", JSON.stringify({packageName, filePath, ext}));

    if (type === "DIRECTORY") {
        const searchKey = packageName + '/' + filePath;
        openDirectoryState[searchKey] = !openDirectoryState[searchKey];
        fileTreeMain();
    }
};

const buildDirectoryTree = (filePaths, pkgName, prefix = "") => {
    const grouppedByFirstDirectory = _.groupBy(filePaths, '0');
    return Object.values(grouppedByFirstDirectory).map((filePathsArray) => {
        return (Math.max(...filePathsArray.map((e) => e.length)) > 1)
            ? function() {
                const fullPath = prefix + filePathsArray[0][0];
                if (openDirectoryState[pkgName + '/' + fullPath] === undefined) {
                    openDirectoryState[pkgName + '/' + fullPath] = false;
                }
                return {
                    type: "DIRECTORY",
                    name: filePathsArray[0][0],
                    packageName: pkgName,
                    content: buildDirectoryTree(filePathsArray.map((e) => e.slice(1)), pkgName, prefix + filePathsArray[0][0] + '/'),
                    path: fullPath,
                    ext: 'dir'
                }
            }() : {
                type: "FILE",
                name: filePathsArray[0][0],
                ext: filePathsArray[0][0]?.split('.')?.slice(-1)?.[0]?.toLowerCase(),
                packageName: pkgName,
                path: prefix + filePathsArray[0][0]
            }
    })
}

const renderDirectoryTree = (node, identLevel = 0) => {
    if (!node) return "";

    if (!node.type)
        return _.orderBy(node, (n) => n.type === "DIRECTORY" ? -1 : 1).map((e) => renderDirectoryTree(e, identLevel + 1)).join('');

    return  `
        <span 
            class="package-folder file-or-folder" 
            style="${'padding-left: ' + (identLevel * 4) + 'px;'}" 
            data-type="${node.type}"
            data-pkg="${node.packageName}" 
            data-filepath="${node.path}"
            data-ext="${node.ext}"
        >
            <span class="icon">
                <img src="${iconsSet(node.ext)}" alt="${node.ext}" height="16" width="16"/>
            </span>
            <span class="name">${node.name}</span>
            ${
                node.type === "PACKAGE"
                    ? '<span class="action-buttons"><img src="'+play+'" alt="reload package" height="16" width="16"/></span>'
                    : ''
            }
        </span>
    ${openDirectoryState[node.packageName + '/' + node.path] || node.type !== "DIRECTORY" 
        ? renderDirectoryTree(node.content, identLevel + 1) 
        : ''}`;
}

const renderError = () => `
    <div class="error">
        No packages were found ! <br />
        Have you forgot to setup the editor ?<br />
        Add this code to the packages you want to edit: <br />
        <pre>
        local editor = Package.Require("nanos-ide/hook.lua")\n
        editor.setup()
        </pre>
    </div>
`

function fileTreeMain() {
    if (!___allPackages) return;
    const allPackages = Object.keys(___allPackages);
    const allTrees = allPackages.map((pkgName) => {
        const allPackagesFiles = ___allPackages[pkgName].files;
        return {
            type: "PACKAGE",
            name: pkgName,
            packageName: pkgName,
            content: buildDirectoryTree(allPackagesFiles.map((filePath) => filePath.split('/')), pkgName),
            ext: "pkg"
        };
    })
    const renderString = allTrees.length === 0 ? renderError() : renderDirectoryTree(allTrees);
    const fte = document.getElementById("file-tree");
    fte.innerHTML = renderString;
    fte.removeEventListener("click", onClickFile);
    fte.addEventListener("click", onClickFile);
}

setInterval(fileTreeMain, 10000, ___allPackages);
Events.Subscribe("NIDE:JS_SEND_PKG_INFOS", (pkgData) => {
    window.___allPackages = JSON.parse(pkgData);
    fileTreeMain();
});