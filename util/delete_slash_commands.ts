import { REST, Routes } from 'discord.js';
import { clientid } from '../config.json';
import { exit } from 'process';

if (process.argv.length < 3){
	console.log("need a token argument!")
	exit();
}
const rest = new REST().setToken(process.argv[2]);

// for guild-based commands
/*
rest.put(Routes.applicationGuildCommands(clientid, guildid), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
*/

// for global commands
rest.put(Routes.applicationCommands(clientid), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);