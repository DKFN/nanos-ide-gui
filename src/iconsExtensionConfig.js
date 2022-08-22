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
    htm: html,
    undefined: lol,
};

export const iconsSet = (ext) => _iconsSet[ext] ?? _iconsSet["undefined"];