import _ from "lodash";
window.___allPackages = [];

import {iconsSet} from "./iconsExtensionConfig";
import play from "./icons/play.png";

// Indexing is path:openState
let openDirectoryState = {

};

const onClickFile = (mouseEvent) => {
    const dataContainingElement = mouseEvent.target.closest('.file-or-folder');
    console.log("Received mouse event on click", dataContainingElement);
    const packageName = dataContainingElement.getAttribute("data-pkg");
    const filePath = dataContainingElement.getAttribute("data-filepath");
    const type = dataContainingElement.getAttribute("data-type");
    if (type === "FILE")
        Events.Call("NIDE:CLIENT_ASK_FILE_CONTENTS", JSON.stringify({packageName, filePath}));

    if (type === "DIRECTORY") {
        openDirectoryState[filePath] = !openDirectoryState[filePath];
        fileTreeMain();
    }
};

const buildDirectoryTree = (filePaths, prefix = "") => {
    const grouppedByFirstDirectory = _.groupBy(filePaths, '0');
    return Object.values(grouppedByFirstDirectory).map((filePathsArray) => {
        return (Math.max(...filePathsArray.map((e) => e.length)) > 1)
            ? function() {
                const fullPath = prefix + filePathsArray[0][0];
                if (!openDirectoryState[fullPath]) {
                    openDirectoryState[fullPath] = false;
                }
                return {
                    type: "DIRECTORY",
                    name: filePathsArray[0][0],
                    content: buildDirectoryTree(filePathsArray.map((e) => e.slice(1)), prefix + filePathsArray[0][0] + '/'),
                    path: fullPath,
                    ext: 'dir'
                }
            }() : {
                type: "FILE",
                name: filePathsArray[0][0],
                ext: filePathsArray[0][0]?.split('.')?.slice(-1)?.[0]?.toLowerCase(),
                path: prefix + filePathsArray[0][0]
            }
    })
}

console.log("Loaded icons set : ", iconsSet);

const renderDirectoryTree = (node, identLevel = 0) => {
    if (!node) return "";

    if (!node.type) {
        // TODO: Handle arrays of nodes
        return node.map((e) => renderDirectoryTree(e, identLevel + 1)).join('');
    }

    return  `
        <span class="package-folder file-or-folder" style="${'padding-left: ' + (identLevel * 4) + 'px;'}" data-type="${node.type}" data-pkg="tstest" data-filepath="${node.path}">
            <span class="icon">
                <img src="${iconsSet[node.ext]}" alt="${node.ext}" height="16" width="16"/>
            </span>
            <span class="name">${node.name}</span>
            ${
                node.type === "PACKAGE"
                    ? '<span class="action-buttons"><img src="'+play+'" alt="reload package" height="16" width="16"/></span>'
                    : ''
            }
        </span>
    ${openDirectoryState[node.path] || node.type !== "DIRECTORY" ? renderDirectoryTree(node.content, identLevel + 1) : ''}`;
}

function fileTreeMain() {
    console.log("Generated open directorys", openDirectoryState);
    // console.log("All files : ", ___allPackages);
    const allFiles = Object.values(___allPackages).flatMap((pkgfl) => pkgfl.files);
    const allPackages = Object.keys(___allPackages);
    // console.log("All packages : ", allPackages);
    const allTrees = allPackages.map((pkgName) => {
        const allPackagesFiles = ___allPackages[pkgName].files;
        return {
            type: "PACKAGE",
            name: pkgName,
            packageName: pkgName,
            content: buildDirectoryTree(allPackagesFiles.map((filePath) => filePath.split('/'))),
            ext: "pkg"
        };
    })
    // console.log("All files : ", allFiles);
    // const splittedFilePaths = ___allPackages['test'].files.map((filePath) => filePath.split('/'));
    // console.log(buildDirectoryTree(splittedFilePaths));
    console.log("Generated all trees ", allTrees);
    const renderString = renderDirectoryTree(allTrees[0])
    console.log("Rendered string : ", renderString);
    const fte = document.getElementById("file-tree");
    fte.innerHTML = renderString;
    fte.removeEventListener("click", onClickFile);
    fte.addEventListener("click", onClickFile);
}

setInterval(fileTreeMain, 5000, ___allPackages);
Events.Subscribe("NIDE:JS_SEND_PKG_INFOS", (pkgData) => {
    console.log("received pkg data : ", pkgData);
    window.___allPackages = JSON.parse(pkgData);
    fileTreeMain();
});