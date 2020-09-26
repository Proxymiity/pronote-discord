const pronote = require('pronote-api');
const credentials = require('./credentials.js');
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')

async function main()
{
    const session = await pronote.login(credentials.url, credentials.username, credentials.password);
    const today = new Date()
    const startdate = new Date(today)
    startdate.setDate(startdate.getDate() + 1)
    startdate.setHours(8, 0, 0)
    const enddate = new Date(today)
    enddate.setDate(enddate.getDate() + 1)
    enddate.setHours(20, 0, 0)

    const timetable = await session.timetable(startdate, enddate)
    for (let course of timetable) {
        if (course.isDetention === true) {
            webhook.detentionCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, course.room, course.color)
        } else if (course.isCancelled === true) {
            webhook.cancelledCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, course.room, course.color)
        } else if (course.isAway === true) {
            webhook.awayCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, course.room, course.color)
        } else {
            webhook.normalCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, course.room, course.color)
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