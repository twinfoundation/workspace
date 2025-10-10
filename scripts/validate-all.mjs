// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { execSync } from 'child_process';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

// Run the localization validator for all packages with a locales directory
const workspaceRoot = '.';
const validatorPath = `${workspaceRoot}/framework/apps/validate-locales/bin/index.js`;

// Find all src directories
const srcDirs = await glob(`${workspaceRoot}/**/src`, {
	ignore: [
		'**/node_modules/**',
		'**/dist/**',
		'**/ui/**',
		'**/playground/**',
		// '**/wallet/**',
		// '**/tools/**',
		// '**/verifiable-storage/**',
		// '**/vault/**',
		// '**/telemetry/**',
		// '**/supply-chain/**',
		// '**/synchronised-storage/**',
		// '**/standards/**',
		// '**/rights-management/**',
		// '**/node/**',
		// '**/nft/**',
		// '**/messaging/**',
		// '**/logging/**',
		// '**/immutable-proof/**',
		// '**/identity-management/**',
		// '**/identity/**',
		// '**/framework/**',
		// '**/federated-catalogue/**',
		// '**/event-bus/**',
		// '**/entity-storage/**',
		// '**/engine/**',
		// '**/document-management/**',
		// '**/dlt/**',
		// '**/data-space-connector/**',
		// '**/data-processing/**',
		// '**/data/**',
		// '**/blob-storage/**',
		// '**/background-task/**',
		// '**/auditable-item-stream/**',
		// '**/auditable-item-graph/**',
		// '**/attestation/**',
		// '**/api/**',
	]
});

for (const srcDir of srcDirs) {
	const packageRoot = path.dirname(srcDir);
	const localesDir = path.join(packageRoot, 'locales');

	// Check if locales directory exists
	if (fs.existsSync(localesDir)) {
		const srcPattern = `${srcDir}/**/*.ts`;
		const localesPattern = `${localesDir}/**/*.json`;
		const ignoreFile = `${localesDir}/.validate-ignore`;

		try {
			const command = `node "${validatorPath}" --source "${srcPattern}" --locales "${localesPattern}" --ignoreFile "${ignoreFile}"`;
			execSync(command, {
				stdio: 'inherit',
				cwd: workspaceRoot
			});
		} catch (error) {
			process.exit(1);
		}
	}
}