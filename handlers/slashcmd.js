// imports and stuff
const { REST, Routes } = require('discord.js');
const { clientid, guildid, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');
const rest = new REST().setToken(token)

const cmds = [];
const folderpath = '../modules'
const cmdfolder = fs.readdirSync('../modules')
console.log(cmdfolder)

for (folder in cmdfolder){
    console.log(cmdfolder[folder])
    var command = require(`${folderpath}/${cmdfolder[folder]}`)
    cmds.push(command.data.toJSON());
}

(async () => {
    const data = await rest.put(
        Routes.applicationCommands(clientid),
        { body: cmds },
    );
})();