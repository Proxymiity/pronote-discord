const config = require('./config.js').read()
const version = require('./config.js').version()['version']
const axios = require('axios');

async function checkForUpdate() {
    if (config['settings']['updateAlerts'] === false) {
        return false
    }
    const response = await axios.get("https://api.github.com/repos/Proxymiity/pronote-discord/releases/latest")
    let gitVer = response.data['tag_name']
    let localVer = version
    let storage = require('./storage.js')
    if (localVer !== gitVer) {
        let check = {
            "localVer": localVer,
            "gitVer": gitVer
        }
        if (storage.autoCheck("update", check) === false) {
            update(localVer, gitVer)
            return true
        } else {
            return false
        }
    }
}

function normalCompact(timetable, hours, rawtime)
{
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": "Aucun professeur absent",
                "description": `${timetable}\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": 3669760,
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": "Emploi du temps",
        "avatar_url": "https://api.proxymiity.fr/img/greentick.png"
    })
}

function anormalCompact(timetable, hours, rawtime)
{
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": "Emploi du temps modifié",
                "description": `${timetable}\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": 16721408,
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": "Emploi du temps",
        "avatar_url": "https://api.proxymiity.fr/img/redtick.png"
    })
}

function noAnormalCourses(hours, rawtime)
{
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": `${config['school']['name']}`,
                "description": `Aucun professeur absent pour ce jour.\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": 3669760,
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": "Emploi du temps",
        "avatar_url": "https://api.proxymiity.fr/img/greentick.png"
    })
}

function containAnormalCourses(hours, rawtime)
{
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": `${config['school']['name']}`,
                "description": `L'emploi du temps est modifié.\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": 16721408,
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": `Emploi du temps`,
        "avatar_url": "https://api.proxymiity.fr/img/redtick.png"
    })
}

function normalCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": `${subject}`,
                "description": `Le professeur est marqué comme présent.\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `Salle ${room}`
                },
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": `${teacher}`,
        "avatar_url": "https://api.proxymiity.fr/img/greentick.png"
    })
}

function awayCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": `~~${subject}~~`,
                "description": `Le professeur est marqué comme **absent** sur Pronote.\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `Salle ${room}`
                },
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": `${teacher}`,
        "avatar_url": "https://api.proxymiity.fr/img/redtick.png"
    })
}

function cancelledCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": `~~${subject}~~`,
                "description": `Le cours est marqué comme **modifié** sur Pronote.\n:warning: *Cette information peut être erronée, dû à un changement d'EDT.*\n**CONSULTEZ PRONOTE:** [Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `Salle ${room}`
                },
                "footer": {
                    "text": `${hours}H de cours`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": `${teacher}`,
        "avatar_url": "https://api.proxymiity.fr/img/orangetick.png"
    })
}

function detentionCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(config['webhook']['courses'], {
        "embeds": [
            {
                "title": `~~${subject}~~`,
                "description": `Mesure disciplinaire de l'établissement: Heure de colle.\n:warning: Les sanctions disciplinaires affectent uniquement le compte Pronote lié au bot. (le propriétaire, normalement.)\n**CONSULTEZ PRONOTE:** [Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `Salle ${room}`
                },
                "footer": {
                    "text": `${hours}H de sanction`
                },
                "timestamp": `${rawtime}`
            }
        ],
        "username": `${teacher}`,
        "avatar_url": "https://api.proxymiity.fr/img/orangetick.png"
    })
}

function normalHomework(givenfor, givenat, rawfor, rawgive, subject, description, done, color)
{
    let day = 24 * 60 * 60 * 1000;
    let tdelta = Math.round(Math.abs((givenfor - givenat) / day));
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    axios.post(config['webhook']['homework'], {
        "embeds": [
            {
                "title": `${subject}`,
                "description": `${description}\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `Donné il y a ${tdelta} jour(s)`
                },
                "footer": {
                    "text": `Donné le ${rawgive}`
                },
                "timestamp": `${rawfor}`
            }
        ],
        "username": `Devoirs pour le ${givenfor.getDate()}/${givenfor.getMonth() + 1}`,
        "avatar_url": "https://api.proxymiity.fr/img/homework.png"
    })
}

function pronoteAnnouncement(date, rawDate, title, author, content)
{
    axios.post(config['webhook']['other'], {
        "embeds": [
            {
                "title": `${title}`,
                "description": `${content}\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": 3319890,
                "author": {
                    "name": `${author}`
                },
                "timestamp": `${rawDate}`
            }
        ],
        "username": `Information de l'établissement`,
        "avatar_url": "https://api.proxymiity.fr/img/megaphone.png"
    })
}

function evalResults(date, rawDate, subject, teacher, name, levels, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    axios.post(config['webhook']['results'], {
        "embeds": [
            {
                "title": `${name}`,
                "description": `${levels}\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `${subject}`
                },
                "footer": {
                    "text": `${teacher}`
                },
                "timestamp": `${rawDate}`
            }
        ],
        "username": `Nouvelle compétence`,
        "avatar_url": "https://api.proxymiity.fr/img/school.png"
    })
}

function markResults(date, rawDate, subject, name, marks, averages, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    axios.post(config['webhook']['results'], {
        "embeds": [
            {
                "title": `${name}`,
                "description": `${marks}\n[Cliquez ici pour ouvrir Pronote](${config['school']['publicurl']})`,
                "color": dcolor,
                "author": {
                    "name": `${subject}`
                },
                "footer": {
                    "text": `${averages}`
                },
                "timestamp": `${rawDate}`
            }
        ],
        "username": `Nouvelle note`,
        "avatar_url": "https://api.proxymiity.fr/img/school.png"
    })
}

function installed(setup, version)
{
    axios.post(config['webhook']['other'], {
        "embeds": [
            {
                "title": "`pronote-discord`",
                "description": `La configuration de [pronote-discord](https://github.com/Proxymiity/pronote-discord) a été initialisée avec succès !\nVersion du setup : \`${setup}\`\nVersion des scripts : \`${version}\`\nChangelog : [latest](https://github.com/Proxymiity/pronote-discord/releases/${version})`,
                "color": 6094592,
                "author": {
                    "name": "Proxymiity",
                    "icon_url": "https://api.proxymiity.fr/profileimg/Proxymiity.png"
                }
            }
        ],
        "username": "Setup",
        "avatar_url": "https://github.githubassets.com/images/modules/logos_page/Octocat.png"
    })
}

function update(localVer, githubVer)
{
    axios.post(config['webhook']['other'], {
        "embeds": [
            {
                "title": "`pronote-discord`",
                "description": `Une nouvelle version de [pronote-discord](https://github.com/Proxymiity/pronote-discord) est disponible !\nVersion actuelle : \`${localVer}\`\nNouvelle version : \`${githubVer}\`\nChangelog : [latest](https://github.com/Proxymiity/pronote-discord/releases/${githubVer})`,
                "color": 6094592,
                "author": {
                    "name": "Proxymiity",
                    "icon_url": "https://api.proxymiity.fr/profileimg/Proxymiity.png"
                }
            }
        ],
        "username": "Mise à jour",
        "avatar_url": "https://github.githubassets.com/images/modules/logos_page/Octocat.png"
    })
}

module.exports = { checkForUpdate, normalCompact, anormalCompact, noAnormalCourses, containAnormalCourses, normalCourse, awayCourse, cancelledCourse, detentionCourse, normalHomework, pronoteAnnouncement, evalResults, markResults, installed, update };