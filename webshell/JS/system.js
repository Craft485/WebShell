/**
 * Have a variable for the current directory, we display that in front of the cursor
 * @var {Object} currentDir
 * 
 * Have a master object for the file system, with properties being subdirs
 * @var {Object} root
 * 
 * 
 */

let root = {
    bin: {},
    home: {
        usr: {
            bob: {
                name: 'Bob',
                preferences: {}
            }
        }
    }
}
// Default user
let currentDir = root.home.usr.bob

window.addEventListener('load', function () {
    setTimeout(() => {
        // Load scripts into bin
        list.forEach(script => {
            Object.defineProperty(root.bin, script.name, { value: script, writable: false })
        })
    }, 100)
})