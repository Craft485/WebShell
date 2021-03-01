/**
 * Have a variable for the current directory, we display that in front of the cursor
 * @var {Object} currentDir
 * 
 * Have a master object for the file system, with properties being subdirs
 * @var {Object} root
 */

let root = {
    bin: {},
    home: {
        usr: {
            bob: {
                name: 'bob',
                preferences: {}
            }
        }
    }
}
// Default user
let currentDir = root.home.usr.bob
let parentDir = root.home.usr
/** 
 * @param {Object} newDir 
 * @param {String} newDirName
 */
function createDirData (newDir, newDirName) {
    // Its time to get FUNKY
    if (!newDir) {   
        const subdirs = Object.keys(root)
        subdirs.forEach(subdir => {
            Object.defineProperties(root[subdir],{
                name: {
                    value: subdir,
                    enumerable: false
                },
                parent: {
                    value: root,
                    enumerable: false
                }
            })
        })
    } else {
        Object.defineProperty(newDir, {
            name: {
                value: newDirName,
                enumerable: false
            },
            // Its created with the mkdir command, so we can assume current dir
            parent: {
                value: currentDir.name,
                enumerable: false
            }
        })
    }
}

window.addEventListener('load', function () {
    setTimeout(() => {
        // Load scripts into bin
        list.forEach(script => {
            Object.defineProperty(root.bin, script.name, { value: script, writable: false })
        })
    }, 100)
})