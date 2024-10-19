# Furina
A bot early in development named after Furina de Fontaine
Made with love

## Functions
- Rule34 API wrapper
- Music player bot!
- Websocket for song information!

## Requirements
- Dependencies:
`npm i lavalink-client ws discord.js xml2js axios mongodb dotenv`
- a working Lavalink node (The bot uses a node hosted on your local network by default)
- a discord application

## Configuration
Right now, the configuration is pretty simple.

the token for the bot user rests in the .env file loaded by main.ts, like this:
`TOKEN=<token>`

the MongoDB login info resides as
`MONGODB_USER=<user>`
`MONGODB_PASSWD=<password>`

the rest of the configuration, like client id, embed colors and additional stuff is present in config.json as a JSON object

## Permissions
The bot uses a slash command to write which roles (their ids) can use a given command.
if no role id is present for a command or the user doesn't have any of the roles that are set for the command, the bot doesn't execute them
if the user is a owner it allows them to execute commands regardless.

dbwrite command usage:
`/dbwrite <commandName> <roles>`
Example:
`/dbwrite hw Admin,Moderator` 

The system is incredibly strict which allows for very tight control of who can execute what, because of permissions being tied to role ids, not role permissions.

## XP
The bot possesses a XP system with a cooldown of (by default) 20 seconds (can be changed)
Awards a user 25 xp per written message
Formula for the levels is `10((currentLevel+1)^2 + 100)`

The levels are stored using MongoDB using this format:

```
<guildid>
<playerid1>:
    level: <levelNumber>
    xp: <xpNumber>
<playerid2>
    ... etc.
```
## Credit
- music player icons from Icons8 



