// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import fs from 'fs';
import { glob } from 'glob';

// Base keywords for all packages
const baseKeywords = [
    'twin',
    'trade',
    'iota',
    'framework',
    'blockchain'
];

// Function to get root folder from file path
function getRootFolder(filePath) {
    // Remove leading ./ and get the first directory
    const normalized = filePath.replace(/^\.\//, '').replace(/\\/g, '/');
    const parts = normalized.split('/');
    return parts[0];
}

// Function to get specific keywords based on package name and path
function getSpecificKeywords(packageName, packagePath) {
    const specificKeywords = [];
    
    // Add root folder as keyword
    const rootFolder = getRootFolder(packagePath);
    if (rootFolder && rootFolder !== 'package.json') {
        specificKeywords.push(rootFolder);
    }
    
    // Document Management
    if (packageName.includes('document-management')) {
        specificKeywords.push('documents', 'management', 'storage', 'rest-api');
    }
    
    // Vault related
    if (packageName.includes('vault')) {
        specificKeywords.push('vault', 'encryption', 'security', 'keys');
    }
    
    // Verifiable Storage
    if (packageName.includes('verifiable-storage')) {
        specificKeywords.push('verifiable', 'storage', 'proof', 'immutable');
    }
    
    // Identity
    if (packageName.includes('identity')) {
        specificKeywords.push('identity', 'did', 'credentials', 'authentication');
    }
    
    // NFT
    if (packageName.includes('nft')) {
        specificKeywords.push('nft', 'tokens', 'non-fungible', 'assets');
    }
    
    // Wallet
    if (packageName.includes('wallet')) {
        specificKeywords.push('wallet', 'keys', 'signing', 'accounts');
    }
    
    // Attestation
    if (packageName.includes('attestation')) {
        specificKeywords.push('attestation', 'verification', 'claims', 'trust');
    }
    
    // Background Tasks
    if (packageName.includes('background-task')) {
        specificKeywords.push('tasks', 'scheduling', 'jobs', 'async');
    }
    
    // Blob Storage
    if (packageName.includes('blob-storage')) {
        specificKeywords.push('blob', 'storage', 'files', 'binary');
    }
    
    // Data Processing
    if (packageName.includes('data-processing')) {
        specificKeywords.push('data', 'processing', 'transformation', 'conversion');
    }
    
    // Entity Storage
    if (packageName.includes('entity-storage')) {
        specificKeywords.push('entity', 'storage', 'persistence', 'database');
    }
    
    // API Models
    if (packageName.includes('api-models')) {
        specificKeywords.push('api', 'models', 'types', 'interfaces');
    }
    
    // Crypto
    if (packageName.includes('crypto')) {
        specificKeywords.push('cryptography', 'encryption', 'hashing', 'security');
    }
    
    // Web
    if (packageName.includes('web')) {
        specificKeywords.push('web', 'http', 'rest', 'api');
    }
    
    // Standards
    if (packageName.includes('standards')) {
        specificKeywords.push('standards', 'schema', 'specification');
        if (packageName.includes('schema-org')) {
            specificKeywords.push('schema.org', 'linked-data', 'seo');
        }
        if (packageName.includes('unece')) {
            specificKeywords.push('unece', 'trade', 'supply-chain');
        }
    }
    
    // UI packages
    if (packagePath.includes('/ui/') || packageName.includes('ui')) {
        specificKeywords.push('ui', 'components', 'react', 'frontend');
    }
    
    // Service packages
    if (packageName.includes('-service')) {
        specificKeywords.push('service', 'microservice', 'business-logic');
    }
    
    // Connector packages
    if (packageName.includes('-connector-')) {
        specificKeywords.push('connector', 'adapter', 'integration');
        
        if (packageName.includes('memory')) {
            specificKeywords.push('memory', 'in-memory', 'testing');
        }
        if (packageName.includes('entity-storage')) {
            specificKeywords.push('persistence', 'database');
        }
    }
    
    // Models packages
    if (packageName.includes('-models')) {
        specificKeywords.push('models', 'types', 'schemas');
    }
    
    // Core/Framework
    if (packageName.includes('core') || packageName.includes('modules')) {
        specificKeywords.push('core', 'foundation', 'utilities');
    }
    
    return specificKeywords;
}

// Find all package.json files - exclude node_modules
const files = await glob(`./**/package.json`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/docs/**', '**/tests/**']
});

console.log('Found files:', files.length);

files.forEach(file => {
    console.log(`Processing: ${file}`);

    try {
        const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
        
        if (!(packageJson.private ?? false) && packageJson.name) {
            const specificKeywords = getSpecificKeywords(packageJson.name, file);
            const allKeywords = [...new Set([...baseKeywords, ...specificKeywords])]; // Remove duplicates
            
            packageJson.keywords = allKeywords;
            fs.writeFileSync(file, `${JSON.stringify(packageJson, undefined, "\t")}\n`);
            console.log(`  Added keywords: ${allKeywords.join(', ')}`);
        }
    } catch (error) {
        console.log(`  Error: ${error.message}`);
    }
});