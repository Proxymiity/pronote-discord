# pronote-discord
Broadcast courses from the standard French-school-timetable thing. (in French.)

****

# Requirements
You need a VPS or a Linux-based server that can run NodeJS 14.
Debian 9 is a great OS choice.  
You also need cron(tab).

# Installation
Clone this repository using `git clone https://github.com/Proxymiity/github-discord`  
The recommended location is `/srv`, but you can place this in whatever folder you want.

# Config
Edit the `config.json` and set the values.

<details>
  <summary>CAS list</summary> 

  Académie d'Orleans-Tours (CAS : ac-orleans-tours)  
  Académie de Besançon (CAS : ac-besancon)  
  Académie de Bordeaux (CAS : ac-bordeaux)  
  Académie de Caen (CAS : ac-caen)  
  Académie de Clermont-Ferrand (CAS : ac-clermont)  
  Académie de Dijon (CAS : ac-dijon)  
  Académie de Grenoble (CAS : ac-grenoble)  
  Académie de Lille (CAS : ac-lille)  
  Académie de Limoges (CAS : ac-limoges)  
  Académie de Lyon (CAS : ac-lyon)  
  Académie de Montpellier (CAS : ac-montpellier)  
  Académie de Nancy-Metz (CAS : ac-nancy-metz)  
  Académie de Nantes (CAS : ac-nantes)  
  Académie de Poitiers (CAS : ac-poitiers)  
  Académie de Reims (CAS : ac-reims)  
  Académie de Rouen (Arsene76) (CAS : arsene76)  
  Académie de Rouen (CAS : ac-rouen)  
  Académie de Strasbourg (CAS : ac-strasbourg)  
  Académie de Toulouse (CAS : ac-toulouse)  
  ENT "Agora 06" (Nice) (CAS : agora06)  
  ENT "Haute-Garonne" (CAS : haute-garonne)  
  ENT "Hauts-de-France" (CAS : hdf)  
  ENT "La Classe" (Lyon) (CAS : laclasse)  
  ENT "Lycee Connecte" (Nouvelle-Aquitaine) (CAS : lyceeconnecte)  
  ENT "Seine-et-Marne" (CAS : seine-et-marne)  
  ENT "Somme" (CAS : somme)  
  ENT "Toutatice" (Rennes) (CAS : toutatice)  
  ENT "Île de France" (CAS : iledefrance)  
  ENT "Lycee Jean Renoir Munich" (CAS : ljr-munich)  
  ENT "L'eure en Normandie" (CAS : Eure-Normandie)  
</details>

<details>
  <summary>Config explained</summary> 

The `login` section is where your credentials will go in.  
- `url`: Your Pronote Server URL.  
*You may need to use `?login=true` behind the `/pronote/eleve.html` to access that page, and* **need to use HTTPS.**  
- `username`: Your Pronote username.  
- `password`: Your Pronote password.  
- `cas`: Your CAS (if needed). See the CAS list, and replace `'none'` with `'your-cas'`.

All the values under `webhook` (courses, homework, pronote) are the Discord Webhook URI used to send messages to Discord:  
- `courses`: Where the timetable gets sent
- `homework`: Where the homework gets sent
- `results` : Where competences and marks gets sent
- `other`: Where announcements and updates gets sent

The `school` section contains the school name, the Pronote server ID (or the 'rectorat' ID - usually 7 digits, and 1 letter), and the public URL for Pronote.

The `settings` section contains other parameters that *should be left to default settings*
- `timediff`: Leave it to `"default"` to automatically manage the time difference between the local timezone and the UTC time.  
If this doesn't work as expected (e.g. you're UTC+2 and it shows 6 because of your system timezone or something else), you can still replace `"default"` with `2` or whatever. *If UTC shows 9AM, and your local time 11AM, then the timediff should be 2. This value change based on the summer time in your country*
- `storage`: This should be set by default. It is the storage file used by the infos & results module
- `version`: This should be set by default. It is the version file used by the setup & the update alert
- `updateAlerts`: Whether or not you want to be notified about updates.
- `publicMode`: Run the result script in Public Mode: This masks student's personal marks and results, but still shows class average.
</details>

<details>
  <summary>Config example</summary> 
📁 config.json

```json

{
  "login": {
    "url": "https://1234567X.index-education.net/pronote/eleve.html",
    "username": "USERNAME",
    "password": "MySecretPassword",
    "cas": "none"
  },
  "webhook": {
    "courses": "https://discordapp.com/api/webhooks/0/MySecretWebhook",
    "homework": "https://discordapp.com/api/webhooks/0/MySecretWebhook",
    "results": "https://discordapp.com/api/webhooks/0/MySecretWebhook",
    "other": "https://discordapp.com/api/webhooks/0/MySecretWebhook"
  },
  "school": {
    "name": "Lycée XXX",
    "id": "1234567X",
    "publicurl": "https://1234567X.index-education.net/pronote/"
  },
  "settings": {
    "timediff": "default",
    "storage": "./storage.json",
    "version": "./version.json",
    "updateAlerts": true,
    "publicMode": false
  }
}

```
</details>

# Setup
Run `setup.js` with `node ./setup.js` to verify configuration
Edit your crontab with `crontab -e`:
```sh
# Pronote - Announce next courses (each day before courses, 9pm)
0 21 * * 0,1,2,3,4  * * cd /path.to.pronote.dir/ && /usr/bin/node ./courses.js
# Pronote - Announce homeworks (each day before courses, 8pm)
0 20 * * 0,1,2,3,4  * * cd /path.to.pronote.dir/ && /usr/bin/node ./homeworks.js
# Pronote - Check for new marks & evals
*/10 * * * * cd /path.to.pronote.dir/ && /usr/bin/node ./results.js
# Pronote - Check for new infos
*/10 * * * * cd /path.to.pronote.dir/ && /usr/bin/node ./infos.js
```
This default configuration will announce courses before each school day at 8pm, and homeworks at 7pm. Values [can be customised here](https://crontab.cronhub.io/).
