const pronote = require('pronote-api');
const config = require('./config.js').read()
const timediff = require('./config.js').timediff()
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')

async function main()
{
    const session = await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas']);
    const today = new Date()
    const startdate = new Date(today)
    startdate.setDate(startdate.getDate())
    startdate.setHours(23-timediff, 50, 0)
    const enddate = new Date(today)
    enddate.setDate(enddate.getDate() + 1)
    enddate.setHours(23-timediff, 50, 0)

    const timetable = await session.timetable(startdate, enddate)
    let containAnormalCourses = false
    for (let course of timetable) {
        let room = course.room;
        if (course.room == null) {
            room = "inconnue"
        }
        if (course.isDetention === true) {
            webhook.detentionCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
            containAnormalCourses = true
            await sleep(2500)
        } else if (course.isCancelled === true) {
            webhook.cancelledCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
            containAnormalCourses = true
            await sleep(2500)
        } else if (course.isAway === true) {
            webhook.awayCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
            containAnormalCourses = true
            await sleep(2500)
        } else {
            if (config['courses']['hideNormalCourses'] === false) {
                webhook.normalCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
                await sleep(2500)
            }
        }
    }
    if (config['courses']['hideNormalCourses'] === true) {
        let startTime = timetable[0].from
        let endTime = timetable[timetable.length - 1].to
        if (containAnormalCourses === true) {
            webhook.containAnormalCourses(startTime, endTime, timeformat.toDateSnowflake(startTime))
        } else {
            webhook.noAnormalCourses(startTime, endTime, timeformat.toDateSnowflake(startTime))
        }
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