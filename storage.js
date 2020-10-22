const fs = require('fs')
const storage = require('./config.js').read()['settings']['storage']

function read() {
    checkStorageFile()
    return(JSON.parse(fs.readFileSync(storage)))
}

function write(data) {
    fs.writeFileSync(storage, JSON.stringify(data))
}

function store(name, data) {
    let stored = read()
    if (stored[`${name}`] == null) {
        stored[`${name}`] = []
    }
    stored[`${name}`].push(data)
    write(stored)
}

function compare(name, data) {
    let stored = read()
    let match = false
    if (stored[`${name}`] == null) {
        match = false
    } else for (let obj of stored[`${name}`]) {
        if (JSON.stringify(obj) === JSON.stringify(data)) {
            match = true
        }
    }
    return match
}

function autoCheck(name, data) {
    let stored
    if (compare(name, data) === false) {
        store(name, data)
        stored = false
    } else {
        stored = true
    }
    return stored
}

function checkStorageFile() {
    if (fs.existsSync(storage) === false) {
        resetStorageFile()
    }
    if (fs.readFileSync(storage, 'utf8') === "") {
        resetStorageFile()
    }
}

function resetStorageFile() {
    let c = {}
    let content = JSON.stringify(c)
    fs.writeFileSync(storage, content)
}

module.exports = { read, write, store, compare, autoCheck, resetStorageFile, checkStorageFile }