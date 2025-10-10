// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import fs from 'fs';
import { glob } from 'glob';

// Function to get root folder from file path
function getRootFolder(filePath) {
	// Remove leading ./ and get the first directory
	const normalized = filePath.replace(/^\.\//, '').replace(/\\/g, '/');
	const parts = normalized.split('/');
	return parts[0];
}

// Find all package.json files - exclude node_modules
const files = await glob(`./**/package.json`, {
	ignore: ['**/node_modules/**', '**/dist/**', '**/docs/**', '**/tests/**']
});

console.log('Found files:', files.length);

files.forEach(file => {
	console.log(`Processing: ${file}`);

	try {
		const parts = file.replace(/\\/g, "/").split('/');
		const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));

		if (packageJson.name) {
			packageJson.bugs = {
				"url": `git+https://github.com/twinfoundation/${parts[0]}/issues`
			};
			packageJson.homepage = `https://twindev.org`;
			fs.writeFileSync(file, `${JSON.stringify(packageJson, undefined, "\t")}\n`);
		}
	} catch (error) {
		console.log(`  Error: ${error.message}`);
	}
});