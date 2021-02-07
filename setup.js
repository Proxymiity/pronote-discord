const setup = {
    sver: require('./config.js').version()['setup'],
    ver: require('./config.js').version()['version']
}

async function main() {
    console.log("Setting up pronote-discord - importing modules...")

    const pronote = require('pronote-api')
    const config = require('./config.js').read()
    const timediff = require('./config.js').timediff()
    const store = require('./storage.js')
    const hook = require('./webhook.js')

    console.log("Initializing new storageFile...")
    store.resetStorageFile()

    console.log("Checking config...")

    if (config['login']['url'] === '') {
        console.log("./config.json: login/url not set")
        process.exit(-1)
    }
    if (config['login']['username'] === '') {
        console.log("./config.json: login/username not set")
        process.exit(-1)
    }
    if (config['login']['password'] === '') {
        console.log("./config.json: login/password not set")
        process.exit(-1)
    }
    if (config['login']['cas'] === '') {
        console.log("./config.json: login/cas not set")
        process.exit(-1)
    }
    if (config['webhook']['courses'] === '') {
        console.log("./config.json: webhook/courses not set")
        process.exit(-1)
    }
    if (config['webhook']['homework'] === '') {
        console.log("./config.json: webhook/homework not set")
        process.exit(-1)
    }
    if (config['webhook']['results'] === '') {
        console.log("./config.json: webhook/results not set")
        process.exit(-1)
    }
    if (config['webhook']['other'] === '') {
        console.log("./config.json: webhook/other not set")
        process.exit(-1)
    }
    if (config['school']['name'] === '') {
        console.log("./config.json: school/name not set")
        process.exit(-1)
    }
    if (config['school']['id'] === '') {
        console.log("./config.json: school/id not set")
        process.exit(-1)
    }
    if (config['school']['publicurl'] === '') {
        console.log("./config.json: school/publicurl not set")
        process.exit(-1)
    }
    if (config['courses']['compactCourses'] === undefined) {
        console.log("./config.json: courses/compactCourses not set")
        process.exit(-1)
    }
    if (config['courses']['hideNormalCourses'] === undefined) {
        console.log("./config.json: courses/hideNormalCourses not set")
        process.exit(-1)
    }
    if (config['settings']['timediff'] === '') {
        console.log("./config.json: settings/timediff not set")
        process.exit(-1)
    }
    if (config['settings']['storage'] === '') {
        console.log("./config.json: settings/storage not set")
        process.exit(-1)
    }
    if (config['settings']['version'] === '') {
        console.log("./config.json: settings/version not set")
        process.exit(-1)
    }
    if (config['settings']['updateAlerts'] === undefined) {
        console.log("./config.json: settings/updateAlerts not set")
        process.exit(-1)
    }
    if (config['settings']['publicMode'] === undefined) {
        console.log("./config.json: settings/publicMode not set")
        process.exit(-1)
    }

    console.log("Config check complete")
    console.log("Attempting to communicate with Pronote... [Testing session]")

    const setupSession = await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas'])
    console.log(`Logged in as ${setupSession.user.name} (id ${setupSession.user.id}).`)
    if (setupSession.user.studentClass === undefined || setupSession.user.studentClass.name == null) {
        console.log("pronote: There is no class associated with this account")
        process.exit(2)
    }
    console.log(`Class: ${setupSession.user.studentClass.name}`)

    console.log("Attempting to communicate with Pronote... [Testing keepAlive]")
    console.log((await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas'])).keepAlive())

    console.log("Setting up storage...")
    await storageSetup()
    console.log("Storage set up.")
    console.log("")
    console.log(`You will be logged in as ${setupSession.user.name}.`)
    console.log(`The time difference between UTC and local timezone is ${timediff}. If this is not correct, please see the documentation.`)
    console.log("")
    console.log("Setup complete. Please finish reading the documentation here: https://github.com/Proxymiity/pronote-discord#setup")
    hook.installed(setup.sver, setup.ver)
    if (await hook.checkForUpdate() === true) {
        console.log("You're not using the latest version of pronote-discord. You should update at https://github.com/Proxymiity/pronote-discord/releases/latest")
    }
}

async function storageSetup() {
    const pronote = require('pronote-api')
    const config = require('./config.js').read()
    const storage = require('./storage.js')
    let session = await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas'])
    let infos = await session.infos()
    let evals = await session.evaluations()
    let marks = await session.marks();
    for (let info of infos) {
        let title = info.title
        if (info.title === undefined) {
            title = "*Sans titre*"
        }
        let desc = info.content
        if (info.files != null) {
            for (let file of info.files) {
                desc = desc + `\n:link: [${file.name}](${file.url})`
            }
        }
        let check = {
            "date": info.date,
            "title": title,
            "author": info.author,
            "desc": info.content
        }
        storage.store("info", check)
        console.log(check)
    }
    for (let eval of evals) {
        for (let e of eval.evaluations) {
            let ename = e.name;
            if (e.name === "") {
                ename = "*Sans titre*"
            }
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
                "name": ename,
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