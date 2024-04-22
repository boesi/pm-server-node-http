import { open, opendir } from 'node:fs/promises';
import config from './config.mjs';

const rootPath = config.serverPath + '/';
const itemPath = config.serverPath + '/item';
const dir = '/var/data/';

const ext = '.json';

const handler = {
	['GET ' + rootPath]: getNames,
	['GET ' + itemPath]: loadItem,
	['PUT ' + itemPath]: saveItem,
	['DELETE ' + itemPath]: deleteItem,
};

async function getNames(res) {
	console.info('Handler getNames');
	try {
		let names = [];
		for await (const file of await opendir(dir)) {
			names.push(file.name);
		}
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify({names}));
	} catch (error) {
		console.error('Handler getNames: error reading content of directory', error);
		res.writeHead(500);
	}
	res.end();
}

function loadItem(res, name) {
	console.info(`test2 Handler loadItem with name: ${name}`);
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(JSON.stringify({item: {name}}));
	res.end();
}

async function saveItem(res, parameter, item) {
	console.info(`Handler saveItem with item type: ${typeof item}, parameter: ${parameter}`);
	let fd;
	try {
		fd = await open(dir + parameter.get('name') + ext, 'w');
		fd.writeFile(item);
	} finally {
		await fd?.close();
	}
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(JSON.stringify({item: {item}}));
	res.end();
}

function deleteItem(res, name) {
	console.log(`Handler deleteItem with name: ${name}`);
	res.writeHead(200);
	res.end();
}

export default handler;
