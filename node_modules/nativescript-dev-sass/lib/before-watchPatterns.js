var path = require('path');

module.exports = function (hookArgs) {
	if (hookArgs.liveSyncData && !hookArgs.liveSyncData.bundle) {
		return (args, originalMethod) => {
			return originalMethod(...args).then(originalPatterns => {
				const projectData = hookArgs.projectData;
				const appRelativePath = path.relative(projectData.projectDir, projectData.appDirectoryPath);
				const pattern = `!${appRelativePath}/**/*.scss`;
				originalPatterns.push(pattern);

				return originalPatterns;
			});
		};
	}
}
