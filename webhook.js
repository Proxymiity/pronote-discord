const credentials = require('./credentials.js');
const axios = require('axios');

function normalCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(credentials.webhook.courses, {
        "embeds": [
            {
                "title": `${subject}`,
                "description": `Le professeur est marqué comme présent.\n[Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/greentick.png"
    })
}

function awayCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(credentials.webhook.courses, {
        "embeds": [
            {
                "title": `~~${subject}~~`,
                "description": `Le professeur est marqué comme **absent** sur Pronote.\n[Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/redtick.png"
    })
}

function cancelledCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(credentials.webhook.courses, {
        "embeds": [
            {
                "title": `~~${subject}~~`,
                "description": `Le cours est marqué comme **annulé** sur Pronote.\n:warning: *Cette information peut être erronée, dû à un changement d'EDT.*\n**CONSULTEZ PRONOTE:** [Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/orangetick.png"
    })
}

function detentionCourse(start, end, rawtime, subject, teacher, room, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    let hours = Math.abs(end - start) / 36e5;
    axios.post(credentials.webhook.courses, {
        "embeds": [
            {
                "title": `~~${subject}~~`,
                "description": `Mesure disciplinaire de l'établissement: Heure de colle.\n:warning: Les sanctions disciplinaires affectent uniquement le compte Pronote lié au bot. (le propriétaire, normalement.)\n**CONSULTEZ PRONOTE:** [Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/orangetick.png"
    })
}

function normalHomework(givenfor, givenat, rawfor, rawgive, subject, description, done, files, color)
{
    let fnum = files.length
    let day = 24 * 60 * 60 * 1000;
    let tdelta = Math.round(Math.abs((givenfor - givenat) / day));
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    axios.post(credentials.webhook.homework, {
        "embeds": [
            {
                "title": `${subject}`,
                "description": `${description}\n${fnum} fichier(s) attaché(s)\n[Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/homework.png"
    })
}

function pronoteAnnouncement(date, rawDate, title, author, content)
{
    axios.post(credentials.webhook.other, {
        "embeds": [
            {
                "title": `${title}`,
                "description": `${content}\n[Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
                "color": 3319890,
                "author": {
                    "name": `${author}`
                },
                "timestamp": `${rawDate}`
            }
        ],
        "username": `Information de l'établissement`,
        "avatar_url": "https://api.amiiya.fr/api/img/megaphone.png"
    })
}

function evalResults(date, rawDate, subject, teacher, name, levels, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    axios.post(credentials.webhook.results, {
        "embeds": [
            {
                "title": `${name}`,
                "description": `${levels}\n[Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/school.png"
    })
}

function markResults(date, rawDate, subject, name, marks, averages, color)
{
    let hcolor = color.substring(1);
    let dcolor = parseInt(hcolor, 16);
    axios.post(credentials.webhook.results, {
        "embeds": [
            {
                "title": `${name}`,
                "description": `${marks}\n[Cliquez ici pour ouvrir Pronote](${credentials.etab.publicurl})`,
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
        "avatar_url": "https://api.amiiya.fr/api/img/school.png"
    })
}

module.exports = { normalCourse, awayCourse, cancelledCourse, detentionCourse, normalHomework, pronoteAnnouncement, evalResults, markResults };