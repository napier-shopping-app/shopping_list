exports.convert = convert;
exports.dispose = dispose;

var sassCompiler = require('./compiler');
var spawn = require('child_process').spawn;
var path = require('path');

var watcherProcess = null;

function convert(logger, projectDir, appDir, appResourcesDir, options) {
	options = options || {};
	var data = {
		projectDir,
		appDir,
		appResourcesDir,
		logger
	};
	
	if (options.watch) {
		return createWatcher(data);
	}

	return sassCompiler.compile(data);
}

function createWatcher(data) {
	if (watcherProcess) {
		return;
	}

	watcherProcess = spawn(process.execPath, [ path.join(__dirname, "./watcher.js"), JSON.stringify({appDir: data.appDir, appResourcesDir: data.appResourcesDir, projectDir: data.projectDir })], { stdio: ["ignore", "ignore", "ignore", "ipc"] });
	
	watcherProcess.on('error', error => {
		throw new Error(error);
	});

	watcherProcess.on('message', message => {
		if (message && message.logLevel) {
			data.logger[message.logLevel](message.message);
		}
	});

	return sassCompiler.compile(data);
}

function dispose() {
	if (watcherProcess && watcherProcess.connected) {
		watcherProcess.disconnect();
		watcherProcess = null;
	}
}


