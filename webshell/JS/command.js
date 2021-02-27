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
        this.usage = usage
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
        const r = cmd.args.find(e => e.toLowerCase() === arg.toLowerCase())
        if (r) {
            if (arg.toLowerCase() === '-h' || arg.toLowerCase() === '--help') {
                if (typeof str === "string") str += '<br>'
                str = cmd.help()
            }
        }
    })
    return str
}

const help = new Command('help', ['-h', '--help'], 'help [command name]', `Displays list of possible commands`)
/** @param {String[]} args */
help.execute = function (args) {
    if (!args || args.length === 0) {
        const ittr = scripts.entries()
        let str = 'List of commands:<br>'
        for (let i = 0; i < scripts.size; i++) {
            const e = ittr.next().value
            str += `${e[0]} | ${e[1].description}<br>`
        }
        return str
    } else {
        let str = ''
        const argParse = argsParse(args, help)
        if (argParse) {
            return argParse
        } else {
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
        let str = ''
        const argParse = argsParse(args, set)
        if (!argParse) {
            args.forEach((arg, i) => {
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
                        break;
                    case '-tc':
                        const color = args[i + 1]
                        document.body.style.color = color
                        break;
                    default:
                        break;
                }
            })
        } else {
            return argParse
        }
        return str
    }
}

const mkdir = new Command('mkdir', ['dirName'], 'mkdir {dirName}', 'Create a new directory within the current directory')
/** @param {String[]} args */
mkdir.execute = function (args) {
    
}

const list = [help, set]