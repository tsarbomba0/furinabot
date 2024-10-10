import { REST, Routes } from 'discord.js';
import { clientid, token } from '../config.json';

const rest = new REST().setToken(token);

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