import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { parse } from 'node-html-parser'
import * as colors from 'colors/safe'


// TODO: Lmao this is ugly needs some rework !
const fixScriptTag = function (): string | null {
    const distDirectoryPath = './dist/'
    const indexFileName = 'index.html'
    const filePath = distDirectoryPath + indexFileName

    const html = readFileSync(filePath)
    const root = parse(html.toString())

    const head = root.querySelector('head')
    if (!head) {
        return 'did not find head'
    }

    console.log("root : ", root);
    let stop = false;
    while (!stop) {
        const moduleElement = root.querySelector('script:not([nomodule])')
        if (!moduleElement) {
            stop = true;
            // return 'did not find moduleElement'
        } else {
            unlinkSync(distDirectoryPath + moduleElement.attributes.src)
            moduleElement.remove()
        }
    }


    stop = false;
    while (!stop) {
        const nomoduleElement = root.querySelector('script[nomodule]')
        if (!nomoduleElement) {
            stop = true;
            // return 'did not find nomoduleElement'
        } else {

            const src = nomoduleElement.getAttribute('src')
            if (!src) {
                return 'did not find src attribute'
            }
            nomoduleElement.remove()

            const classicElement = parse(`<script src="${src}" defer></script>`)
            head.appendChild(classicElement)
        }
    }

    writeFileSync(filePath, root.toString())

    return null
}

const error = fixScriptTag()
if (error) {
    console.log()
    console.log(`fix script tag: ${error}`)
    process.exit(1)
}