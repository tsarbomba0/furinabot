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

## Credit
- music player icons from Icons8 



