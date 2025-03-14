/**
 * Helper to merge Biome configurations with custom options
 *
 * @param {Object} customConfig - The custom configuration to merge
 * @param {string} baseConfigPath - The path to the base configuration to extend (e.g. '@workspace/biome-config/base')
 * @returns {Object} The merged configuration
 */
export function extendBiomeConfig(customConfig, baseConfigPath = "@workspace/biome-config/base") {
  return {
    $schema: "https://biomejs.dev/schemas/1.5.3/schema.json",
    extends: [baseConfigPath],
    ...customConfig,
  };
}

/**
 * Utility to transform ESLint rule severity to Biome rule severity
 *
 * @param {string|number} eslintSeverity - The ESLint severity ('off'|'warn'|'error' or 0|1|2)
 * @returns {string|boolean} The Biome severity ('warn'|'error' or false)
 */
export function convertEslintSeverity(eslintSeverity) {
  if (eslintSeverity === "off" || eslintSeverity === 0) return false;
  if (eslintSeverity === "warn" || eslintSeverity === 1) return "warn";
  if (eslintSeverity === "error" || eslintSeverity === 2) return "error";
  return "warn"; // Default to warn for unknown values
}
