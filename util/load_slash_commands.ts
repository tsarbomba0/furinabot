// imports and stuff
const { REST, Routes } = require('discord.js');
const { clientid, guildid, token } = require('../config.json');
const fs = require('node:fs');
import { exit } from 'process'

if (process.argv.length < 3){
	console.log("need a token argument!")
	exit();
}
const rest = new REST().setToken(process.argv[2]);

const cmds = [];
const folderpath = '../modules'
const cmdfolder = fs.readdirSync('../modules')
console.log(cmdfolder)

for (let folder in cmdfolder){
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