const credentials = require('./credentials.js')

function toDateSnowflake(unhandledDate) {
    let date = new Date(unhandledDate)
    date.setHours(date.getHours() - credentials.timediff);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour;
    if (date.getHours() < 10) {
        hour = `0${date.getHours()}`
    } else {
        hour = date.getHours();
    }
    let minute;
    if (date.getMinutes() < 10) {
        minute = `0${date.getMinutes()}`
    } else {
        minute = date.getMinutes();
    }
    let seconds;
    if (date.getSeconds() < 10) {
        seconds = `0${date.getSeconds()}`
    } else {
        seconds = date.getSeconds();
    }
    let strdate = `${year}-${month}-${day}T${hour}:${minute}:${seconds}.000Z`
    return strdate;
}

function toFullString(unhandledDate) {
    let date = new Date(unhandledDate)
    date.setHours(date.getHours() - credentials.timediff);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour;
    if (date.getHours() < 10) {
        hour = `0${date.getHours()}`
    } else {
        hour = date.getHours();
    }
    let minute;
    if (date.getMinutes() < 10) {
        minute = `0${date.getMinutes()}`
    } else {
        minute = date.getMinutes();
    }
    let seconds;
    if (date.getSeconds() < 10) {
        seconds = `0${date.getSeconds()}`
    } else {
        seconds = date.getSeconds();
    }
    let strdate;
    if (date.getSeconds() === 0) {
        strdate = `${day}/${month}/${year} ${hour}:${minute}`
    } else {
        strdate = `${day}/${month}/${year} ${hour}:${minute}:${seconds}`
    }
    return strdate;
}

module.exports = { toDateSnowflake, toFullString };