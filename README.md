# pronote-discord
Broadcast courses from the standard French-school-timetable thing. (in French.)

****

# Please read
This project is under development and configuration files (like `credentials.js`) might change at every moment. If you install my useless thing and want to update it, please backup your config file, and update every file.  
If you want to improve this project, feel free to do so.

****

# Requirements
You need a VPS or a Linux-based server that can run NodeJS 14.
Debian 9 is a great OS choice.  
You also need cron(tab).

# Installation
Clone this repository using `git clone https://github.com/Proxymiity/github-discord`  
The recommended location is `/srv`, but you can place this in whatever folder you want.

# Config
Edit the `credentials.js` and set the values.

<details>
  <summary>Credentials configuration</summary> 

`url`: Your Pronote Server URL. You must have access to the direct login interface.  
*You may need to use `?login=true` behind the `/pronote/eleve.html` to access that page, and* **need to use HTTPS.**  
`username`: Your Pronote username.  
`password`: Your Pronote password.

All the values under `webhook` (courses, homework, pronote) are the Discord Webhook URI used to send messages to Discord:  
- `courses`: Where the timetable gets sent
- `homework`: Where the homework gets sent
- `results` : Where competences and marks gets sent
- `other`: Where announcements gets sent

The `etab` table contains the school name, the Pronote server ID (or the 'rectorat' ID - usually 7 digits, and 1 letter), and the public URL for Pronote.

`timediff`: By default it is now set automatically according to the difference between local timezone and UTC.
If it doesn't work because of your system timezone or something else, you can still remove the `getTimediff()` and replace it with your Time Difference. *If UTC shows 9AM, and your local time 11AM, then the timediff is 2. This value change based on the summer time in your country*

`storage`: This should be set by default. It is the storage file used by the infos & results module
</details>

<details>
  <summary>Credentials example</summary> 
📁 `credentials.js`

```javascript

const url = 'https://1234567X.index-education.net/pronote/eleve.html'
const username = 'USERNAME'
const password = 'MySecretPassword'

const webhook = {
    courses: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    homework: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    results: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    other: 'https://discordapp.com/api/webhooks/0/MySecretWebhook'
}

const etab = {
    name: 'Lycée XXX',
    id: '1234567X',
    publicurl: 'https://1234567X.index-education.net/pronote/'
}

// Replace getTimediff() with your own Time difference (see README)
// or leave it to get it automatically.
const timediff = getTimediff()
function getTimediff() {
    let utc = new Date()
    return offset = -utc.getTimezoneOffset()/60
}

const storage = './storage.json'

module.exports = { url, username, password, webhook, etab, timediff };

```
</details>

# Setup
Edit your crontab with `crontab -e`:
```sh
# Pronote - Announce next courses (each day before courses, 9pm)
0 21 * * 0,1,2,3,4 /usr/bin/node /path.to.pronote.dir/courses.js
# Pronote - Announce homeworks (each day before courses, 8pm)
0 20 * * 0,1,2,3,4 /usr/bin/node /path.to.pronote.dir/homeworks.js
# Pronote - Check for new marks & evals
10 * * * * /usr/bin/node /path.to.pronote.dir/results.js
# Pronote - Check for new infos
10 * * * * /usr/bin/node /path.to.pronote.dir/infos.js
```
This default configuration will announce courses before each school day at 8pm, and homeworks at 7pm. Values [can be customised here](https://crontab.cronhub.io/).
