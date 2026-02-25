#!/usr/bin/env node
// Removes the 1 MB upload restriction from the Medusa admin dashboard.
// Replaces patch-package (which kept breaking on format errors).
//
// Idempotent: safe to run multiple times.

const fs = require("fs");
const path = require("path");

const files = [
  "node_modules/@medusajs/dashboard/dist/app.js",
  "node_modules/@medusajs/dashboard/dist/chunk-DODQ3KJT.mjs",
];

// Matches:  formats: SUPPORTED_FORMATS,<whitespace>onUploaded
// Only when maxFileSize is NOT already present (idempotent).
const pattern = /(formats: SUPPORTED_FORMATS,)(\s+)(?!maxFileSize)(onUploaded)/g;
const replacement = "$1$2maxFileSize: Infinity,$2$3";

let anyPatched = false;

for (const relPath of files) {
  const filePath = path.resolve(__dirname, "..", relPath);

  if (!fs.existsSync(filePath)) {
    console.log(`  skip  ${relPath} (file not found)`);
    continue;
  }

  const original = fs.readFileSync(filePath, "utf8");
  const patched = original.replace(pattern, replacement);

  if (patched === original) {
    console.log(`  ok    ${relPath} (already patched or pattern not found)`);
  } else {
    fs.writeFileSync(filePath, patched);
    console.log(`  patch ${relPath}`);
    anyPatched = true;
  }
}

console.log(anyPatched ? "Done." : "Nothing to patch.");
