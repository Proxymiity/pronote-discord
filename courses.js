const pronote = require('pronote-api');
const config = require('./config.js').read()
const timediff = require('./config.js').timediff()
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')

async function main()
{
    await webhook.checkForUpdate()
    const session = await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas']);
    const today = new Date()
    const startdate = new Date(today)
    startdate.setDate(startdate.getDate())
    startdate.setHours(23-timediff, 50, 0)
    const enddate = new Date(today)
    enddate.setDate(enddate.getDate() + 1)
    enddate.setHours(23-timediff, 50, 0)

    const timetable = await session.timetable(startdate, enddate)
    for (let course of timetable) {
        let room = course.room;
        if (course.room == null) {
            room = "inconnue"
        }
        if (course.isDetention === true) {
            webhook.detentionCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
        } else if (course.isCancelled === true) {
            webhook.cancelledCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
        } else if (course.isAway === true) {
            webhook.awayCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
        } else {
            webhook.normalCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
        }
        await sleep(2500)
    }
}

main().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        console.error('Mauvais identifiants');
    } else {
        console.error(err);
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}