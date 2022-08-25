import lua from "./icons/lua.svg";
import toml from "./icons/rust.svg";
import dir from "./icons/folder-base.svg";
import js from "./icons/javascript.svg";
import ts from "./icons/typescript.svg";
import pkg from "./icons/folder-stack.svg";
import html from "./icons/html.svg";
import lol from "./icons/lolcode.svg";
import jsx from "./icons/react.svg";
import tsx from "./icons/react_ts.svg";
import css from "./icons/css.svg";
import json from "./icons/json.svg";
import md from "./icons/markdown.svg";
// import log from "./icons/log.svg";
// import svg from "./icons/svg.svg";
// import image from" ./icons/image.svg";
// import zip from" ./icons/zip.svg";
// const image = svg;

const _iconsSet = {
    lua,
    toml,
    dir,
    js,
    ts,
    pkg,
    html,
    jsx,
    tsx,
    css,
    json,
    md,
    // log,
    // svg,
    // zip,
    // png: image,
    // jpg: image,
    // jpeg: image,
    // gif: image,
    // webp: image,
    // htm: html,
    undefined: lol,
};

export const iconsSet = (ext) => _iconsSet[ext] ?? _iconsSet["undefined"];