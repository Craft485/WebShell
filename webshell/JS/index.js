/** @todo: add command aliases */

const d = document.getElementById("commands")
const scripts = new Map
let lastCMD

function parseCommandLine () {
    const tag = document.createElement('p')
    tag.className = "result"
    let s = `${document.getElementById('cursor').innerText}`
    const input = document.getElementById("input").value.trim()
    document.getElementById("input").value = ''
    s += `${input}<br>`

    // Search for command name, get args
    let args = input.split(' ')
    const cmd = args.shift()
    // Each command returns some kind of output
    if (scripts.has(cmd)) {
        const x = scripts.get(cmd).execute(args)
        s += x
    } else {
        s += `<div class="err">Err: unknown command | Use <u><b>help</b></u> to view commands</div>`
    }

    tag.innerHTML = s
    d.appendChild(tag)
    // Don't ask, you don't want to know
    if (!(s.endsWith('<br>')) || !(s.endsWith('<br/>'))) d.appendChild(document.createElement('br'))
    const jl = document.getElementById('jl')
    if (jl) jl.remove()
    lastCMD = input

    saveSystem()
}
// As long as I don't put maps in the root object anywhere this should work
function saveSystem() {
    window.localStorage.setItem('WST', btoa(JSON.stringify(root)))
}

function bootSystem() {
    const drive = JSON.parse(atob(window.localStorage.getItem('WST')))
    // If the drive is saved load it into root, if not we don't really care
    if (drive) {
        root = drive
        // Load preferences from default user
        const pref = root.home.usr.bob.preferences
        if (pref.color) scripts.get('set').execute(['-bg', pref.bg])
        if (pref.bg) scripts.get('set').execute(['-tc', pref.color])
    }
}

window.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        parseCommandLine()
    } else if (e.key === "ArrowUp") {
        document.body.focus()
        document.getElementById("input").value = lastCMD
        document.getElementById('input').focus()
    }
})

window.addEventListener("load", () => {
    document.getElementById("input").focus()
    bootSystem()
})
// Load commands
list.forEach(item => {
    scripts.set(item.name, item)
})