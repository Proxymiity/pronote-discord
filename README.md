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

`url`: Your Pronote Server URL. Currently, you must have access to the direct login interface.  
*You may need to use `?login=true` behind the `/pronote/eleve.html` to access that page, and* **need to use HTTPS.**  
`username`: Your Pronote username.  
`password`: Your Pronote password.

All the values under `webhook` (courses, homework, pronote) are the Discord Webhook URI used to send messages to Discord:  
- `courses`: Where the timetable gets sent
- `homework`: Where the homework gets sent
- `pronote`: Might be used in the future to send announcements

The `etab` table contains the school name, the Pronote server ID (or the 'rectorat' ID - usually 7 digits, and 1 letter), and the public URL for Pronote.

`timediff`: The time difference between UTC and your school. Must be updated to match current time. [time.is](https://time.is) is a great website for this. If UTC shows 9AM, and your local time 11AM, then the timediff is 2. (it might change in the future, and **change based on the summer time in your country**)

# Setup
Edit your crontab with `crontab -e`:
```sh
# Pronote - Announce next courses (each day before courses, 8pm)
0 21 * * 0,1,2,3,4 /usr/bin/node /path.to.pronote.dir/courses.js
# Pronote - Announce homeworks (each course day, 7pm)
0 20 * * 1,2,3,4,5 /usr/bin/node /path.to.pronote.dir/homeworks.js
```
This default configuration will announce courses before each school day at 8pm, and homeworks at 7pm. Values [can be customised here](https://crontab.cronhub.io/).
