function failed(request, response) {
	console.error(`No path found for method ${request.method} and url ${request.url}`);
	response.writeHead(404);
	response.end(`Have no handler for method ${request.method} and url ${request.url}`);
}

function route(request, response, handler, payload) {
	console.info(`Routing request for ${request.url}`);

	const key = `${request.method} ${request.url}`;
	let routeFound = typeof handler[key] == 'function' && handler.hasOwnProperty(key);

	return routeFound ? handler[key](response, payload) : failed(request, response);
}

export default route;