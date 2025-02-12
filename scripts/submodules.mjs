// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/**
 * This script is used to perform actions across the whole workspace.
 * It performs the operations on all submodules.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';

/**
 * Execute the process.
 */
async function run() {
	process.stdout.write('Submodules\n');
	process.stdout.write('==========\n');
	process.stdout.write('\n');
	process.stdout.write(`Platform: ${process.platform}\n`);

	if (process.argv.length <= 2) {
		throw new Error('No command specified');
	}

	const command = process.argv[2];
	process.stdout.write(`Command: ${command}\n`);
	process.stdout.write(`\n`);

	const module = process.argv[3];
	if (module) {
		process.stdout.write(`Start Module: ${module}\n`);
		process.stdout.write(`\n`);
	}

	const packageJson = await loadJson('package.json');
	let submodules = packageJson.submodules;

	if (module) {
		const index = submodules.indexOf(module);
		if (index === -1) {
			throw new Error(`Module ${module} not found`);
		} else {
			submodules = submodules.slice(index);
		}
	}

	for (const submodule of submodules) {
		process.stdout.write(`Submodule: ${submodule}\n`);
		if (command === "install") {
			await runShellCmd('npm', ['install'], submodule);
		} else if (command === "dist") {
			await runShellApp('node', ['./scripts/workspaces.mjs', 'dist'], submodule);
		}
		process.stdout.write(`\n`);
	}
}

/**
 * Load a JSON file.
 * @param filePath The path th load as JSON.
 * @returns The loaded JSON.
 */
async function loadJson(filePath) {
	const content = await fs.readFile(filePath, 'utf8');

	return JSON.parse(content);
}

/**
 * Run a shell app.
 * @param app The app to run in the shell.
 * @param args The args for the app.
 * @param cwd The working directory to execute the command in.
 * @returns Promise to wait for command execution to complete.
 */
async function runShellCmd(app, args, cwd) {
	return new Promise((resolve, reject) => {
		process.stdout.write(`${app} ${args.join(' ')}\n`);

		const osCommand = process.platform.startsWith('win') ? `${app}.cmd` : app;

		const sp = spawn(osCommand, args, {
			stdio: 'inherit',
			shell: true,
			cwd
		});

		sp.on('exit', (exitCode, signals) => {
			if (Number.parseInt(exitCode, 10) !== 0 || signals?.length) {
				reject(new Error('Run failed'));
			} else {
				resolve();
			}
		});
	});
}

/**
 * Run a shell app.
 * @param app The app to run in the shell.
 * @param args The args for the app.
 * @param cwd The working directory to execute the command in.
 * @returns Promise to wait for command execution to complete.
 */
async function runShellApp(app, args, cwd) {
	return new Promise((resolve, reject) => {
		process.stdout.write(`${app} ${args.join(' ')}\n`);

		const sp = spawn(app, args, {
			stdio: 'inherit',
			shell: true,
			cwd
		});

		sp.on('exit', (exitCode, signals) => {
			if (Number.parseInt(exitCode, 10) !== 0 || signals?.length) {
				reject(new Error('Run failed'));
			} else {
				resolve();
			}
		});
	});
}

run().catch(err => {
	process.stderr.write(`${err}\n`);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
});
