const setup = {
    sver: "0.1.1",
    ver: "v1.1"
}

async function main() {
    console.log("Setting up pronote-discord - importing modules...")

    const pronote = require('pronote-api')
    const credentials = require('./credentials.js')
    const store = require('./storage.js')
    const hook = require('./webhook.js')

    console.log("Initializing new storageFile...")
    store.resetStorageFile()

    console.log("Verifying credentials...")

    if (credentials.url === '') {
        console.log("./credentials.js: url not set")
        process.exit(-1)
    }
    if (credentials.username === '') {
        console.log("./credentials:js: username not set")
        process.exit(-1)
    }
    if (credentials.password === '') {
        console.log("./credentials:js: password not set")
        process.exit(-1)
    }
    if (credentials.webhook.courses === '') {
        console.log("./credentials:js: webhook.courses not set")
        process.exit(-1)
    }
    if (credentials.webhook.homework === '') {
        console.log("./credentials:js: webhook.homework not set")
        process.exit(-1)
    }
    if (credentials.webhook.results === '') {
        console.log("./credentials:js: webhook.results not set")
        process.exit(-1)
    }
    if (credentials.webhook.other === '') {
        console.log("./credentials:js: webhook.other not set")
        process.exit(-1)
    }
    if (credentials.etab.name === '') {
        console.log("./credentials:js: etab.name not set")
        process.exit(-1)
    }
    if (credentials.etab.id === '') {
        console.log("./credentials:js: etab.id not set")
        process.exit(-1)
    }
    if (credentials.etab.publicurl === '') {
        console.log("./credentials:js: etab.publicurl not set")
        process.exit(-1)
    }
    if (credentials.timediff == null) {
        console.log("./credentials:js: timediff not set")
        process.exit(-1)
    }
    if (credentials.storage === '') {
        console.log("./credentials:js: storage not set")
        process.exit(-1)
    }

    console.log("Credentials verification complete")
    console.log("Attempting to communicate with Pronote... [Testing session]")

    const setupSession = await pronote.login(credentials.url, credentials.username, credentials.password, credentials.cas)
    console.log(`Logged in as ${setupSession.user.name} (id ${setupSession.user.id}).`)
    if (setupSession.user.studentClass === undefined || setupSession.user.studentClass.name == null) {
        console.log("pronote: There is no class associated with this account")
        process.exit(2)
    }
    console.log(`Class: ${setupSession.user.studentClass.name}`)

    console.log("Attempting to communicate with Pronote... [Testing keepAlive]")
    console.log((await pronote.login(credentials.url, credentials.username, credentials.password, credentials.cas)).keepAlive())

    console.log("Setting up storage...")
    await storageSetup()
    console.log("Storage set up.")
    console.log("")
    console.log(`You will be logged in as ${setupSession.user.name}.`)
    console.log(`The time difference between UTC and local timezone is ${credentials.timediff}. If this is not correct, please see the documentation.`)
    console.log("")
    console.log("Setup complete. Please finish reading the documentation here: https://github.com/Proxymiity/pronote-discord#setup")
    hook.installed(setup.sver, setup.ver)
}

async function storageSetup() {
    const pronote = require('pronote-api')
    const credentials = require('./credentials.js')
    const storage = require('./storage.js')
    let session = await pronote.login(credentials.url, credentials.username, credentials.password, credentials.cas)
    let infos = await session.infos()
    let evals = await session.evaluations()
    let marks = await session.marks();
    for (let info of infos) {
        let desc = info.content
        if (info.files != null) {
            for (let file of info.files) {
                desc = desc + `\n:link: [${file.name}](${file.url})`
            }
        }
        let check = {
            "date": info.date,
            "title": info.title,
            "author": info.author,
            "desc": info.content
        }
        storage.store("info", check)
        console.log(check)
    }
    for (let eval of evals) {
        for (let e of eval.evaluations) {
            let levels;
            if (e.levels == null) {
                levels = "Aucune compétence enregistrée."
            } else {
                levels = "Compétences :"
                for (let comp of e.levels) {
                    levels = levels + `\n${comp.name} \`${comp.value.short}\``
                }
            }
            let check = {
                "date": e.date,
                "subject": eval.name,
                "teacher": eval.teacher,
                "name": e.name,
                "levels": levels
            }
            storage.store("eval", check)
            console.log(check)
        }
    }
    for (let subject of marks.subjects) {
        for (let mark of subject.marks) {
            let title = mark.title
            if (title === "") {
                title = "*Sans titre*"
            }
            let value = mark.value;
            if (mark.isAway === true) {
                value = "Absent"
            }
            let min = mark.min;
            if (mark.min === -1) {
                min = 0
            }
            let max = mark.max;
            if (mark.max === -1) {
                max = 0
            }
            let markDesc = `Note élève \`${value}\\${mark.scale}\` \nMoyenne classe \`${mark.average}\\${mark.scale}\` \nMinimum \`${min}\` Maximum \`${max}\` \nCoefficient \`${mark.coefficient}\``
            let check = {
                "date": mark.date,
                "subject": subject.name,
                "title": title,
                "mark": markDesc
            }
            storage.autoCheck("mark", check)
            console.log(check)
        }
    }
}

main().catch(err => console.error(err));