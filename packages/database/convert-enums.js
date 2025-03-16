/**
 * Script to convert TypeScript enum files to JavaScript
 *
 * This explicitly replaces export statements and removes TypeScript-specific syntax,
 * making the file compatible with CommonJS and ESM modules.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the TypeScript file
const inputFile = path.join(__dirname, "enums.ts");
const outputFile = path.join(__dirname, "enums.js");

let content = fs.readFileSync(inputFile, "utf8");

// Replace export statements
content = content.replace(/export const (\w+)/g, "export const $1");

// Remove TypeScript-specific syntax
content = content.replace(/\) as const;/g, ");");
content = content.replace(/ as const;/g, ";");

// Write the JavaScript file
fs.writeFileSync(outputFile, content);

console.log("Successfully converted enums.ts to enums.js");
