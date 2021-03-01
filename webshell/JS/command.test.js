// Please, if you value your sanity DO NOT read this file, the code is mayhem
/** @todo: Make some sensible variable names for once */
class Command {
    /**
     * 
     * @param {String} name 
     * @param {String[]} args 
     * @param {String} usage 
     * @param {String} description 
     */
    constructor(name, args, usage, description) {
        this.name = name
        this.args = args
        this.usage = usage
        this.description = description
    }
    help () {
        return `| ${this.name} |<br>${this.description}<br>${this.usage}`
    }
}
/** 
 * @param {String[]} args 
 * @param {Command} cmd
*/
function argsParse(args, cmd) {
    let str = false
    args.forEach(arg => {
        // Is the current arg a valid one
        const r = cmd.args.find(e => e.toLowerCase() === arg.toLowerCase())
        // If valid arg
        if (r) {
            if (arg.toLowerCase() === '-h' || arg.toLowerCase() === '--help') {
                if (typeof str === "string") str += '<br>'
                str = cmd.help()
            }
        }
    })
    return str
}

// There HAS to be a better way to do this...
const help = new Command('help', ['-h', '--help'], 'help [command name]', `Displays list of possible commands`)
/** @param {String[]} args */
help.execute = function (args) {
    // If no args
    if (!args || args.length === 0) {
        const ittr = scripts.entries()
        let str = 'List of commands:<br>'
        // Go through every command and get its information to compile into a string to return
        for (let i = 0; i < scripts.size; i++) {
            const e = ittr.next().value
            str += `${e[0]} | ${e[1].description}<br>`
        }
        return str
    } else {
        let str = ''
        const isHelp = (args.includes('-h') || args.includes('--help')) ? true : false
        if (isHelp) {
            return isHelp
        } else {
            // Is the arg a valid command
            const f = scripts.has(args[0])
            if (f) {
                const h = scripts.get(args[0])
                str += h.help()
            }
        }
        return str
    }
}

const set = new Command('set', ['-bg', '-h', '--help', '-tc'], 'set {options} [value]', 'Change different parts of the terminal')
/** @param {String[]} args */
set.execute = function(args) {
    if (!args || args.length === 0) {
        return `<div class="err">Err: no arguments provided | See ${this.name} -h</div><br>`
    } else {
        // Args parse hell
        let str = ''
        const isHelp = (args.includes('-h') || args.includes('--help')) ? true : false
        // If not a help arg
        if (!isHelp) {
            args.forEach((arg, i) => {
                // Switch case used here in case we have many args in the future
                switch (arg) {
                    case '-bg':
                        const url = args[i + 1]
                        if (url.startsWith('http')) {
                            document.body.style.backgroundImage = `url(${url})`
                            document.body.style.backgroundColor = 'none'
                        } else {
                            document.body.style.backgroundColor = url
                            document.body.style.backgroundImage = 'none'
                        }
                        root.home.usr.bob.preferences.bg = url
                        break;
                    case '-tc':
                        const color = args[i + 1]
                        document.body.style.color = color
                        root.home.usr.bob.preferences.color = color
                        break;
                    default:
                        break;
                }
            })
        } else {
            return isHelp
        }
        return str
    }
}

const mkdir = new Command('mkdir', ['dirName'], 'mkdir {dirName}', 'Create a new directory within the current directory')
/** @param {String[]} args */
mkdir.execute = function (args) {
    if (!args || args.length === 0) {
        return `<div class="err">Err: no arguments provided | See ${this.name} -h</div><br>`
    } else {
        const isHelp = (args.includes('-h') || args.includes('--help')) ? true : false
        if (!isHelp) {
            let str = ''
            // Check if new dir name is already here
            // Else create a new property with the given name
            const newDirName = args[0]
            const currentDirs = Object.keys(currentDir)
            const q = currentDirs.find(element => element === newDirName)
            if (q) {
                str = `<div class="err">Err: directory already exists with name ${newDirName}</div><br>`
            } else {
                Object.defineProperty(currentDir, newDirName, { writable: true, value: new Object, enumerable: true })
                str = '<br>'
            }
            return str
        } else {
            return mkdir.help()
        }
    }
}

const cd = new Command('cd', ['dirName'], 'cd {dirName}', 'Change the current working directory')
/** @param {String[]} args */
cd.execute = function (args) {
    if (!args || args.length === 0) {
        return `<div class="err">Err: no arguments provided | See ${this.name} -h</div><br>`
    } else {
        const isHelp = (args.includes('-h') || args.includes('--help')) ? true : false
        if (!isHelp) {
            let str = ''
            const newDir = args[0]
            const currentDirs = Object.keys(currentDir)
            const q = currentDirs.find(element => element === newDir)
            if (!q && newDir !== '..') {
                str = `<div class="err">Err: No directory found with name <b>${newDir}</b></div><br>`
            } else {
                currentDir = newDir === '..' ? parentDir : currentDir[newDir]
                // Update dir visually
                document.getElementById('cursor').innerHTML = `${currentDir.name} >&nbsp`
                str = '<br>'
            }
            return str
        } else {
            return cd.help()
        }
    }
}

const ls = new Command('ls', [], 'ls [args]', 'List files and sub directories within the current directory')
/** @param {String[]} args */
ls.execute = function (args) {
    const isHelp = (args.includes('-h') || args.includes('--help')) ? true : false
    if (!isHelp) {
        if (!args || args.length === 0 || this.args.length === 0) {
            let str = ''
            // Get a list if items in the current directory
            const items = Object.keys(currentDir)
            items.forEach(item => {
                const subject = currentDir[item]
                // If the item is an object it is representing a directory
                typeof subject === "object" ? str += `<b><u>-${item}</u></b><br>` : str += `${item}<br>`
            })
            return str
        }
    } else {
        return isHelp
    }
}

const list = [help, set, mkdir, cd, ls]