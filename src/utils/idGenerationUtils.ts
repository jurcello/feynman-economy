/**
 * Counter for generating sequential IDs
 */
let idCounter = 0;

/**
 * Generates a unique ID with optional prefix
 * @param prefix - Optional prefix for the ID
 * @returns A unique string ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

/**
 * Generates a unique ID using timestamp and random string
 * @param prefix - Optional prefix for the ID
 * @returns A unique string ID
 */
export function generateRandomId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a UUID v4 (random UUID)
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a short unique ID (8 characters)
 * @param prefix - Optional prefix for the ID
 * @returns A short unique string ID
 */
export function generateShortId(prefix: string = ''): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}-${result}` : result;
}

/**
 * Generates a component-specific ID for Vue components
 * @param componentName - Name of the component
 * @returns A unique component ID
 */
export function generateComponentId(componentName: string): string {
  return generateId(componentName.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, ''));
}

/**
 * Generates a canvas-specific ID
 * @param componentName - Name of the component using the canvas
 * @returns A unique canvas ID
 */
export function generateCanvasId(componentName: string = 'canvas'): string {
  return generateId(`${componentName}-canvas`);
}

/**
 * Generates an SVG-specific ID
 * @param componentName - Name of the component using the SVG
 * @returns A unique SVG ID
 */
export function generateSVGId(componentName: string = 'svg'): string {
  return generateId(`${componentName}-svg`);
}

/**
 * Validates if a string is a valid HTML ID
 * @param id - The ID string to validate
 * @returns true if valid, false otherwise
 */
export function isValidHtmlId(id: string): boolean {
  // HTML ID must start with a letter, underscore, or hyphen
  // and can contain letters, digits, hyphens, underscores, and periods
  const htmlIdRegex = /^[a-zA-Z_-][a-zA-Z0-9_.-]*$/;
  return htmlIdRegex.test(id);
}

/**
 * Sanitizes a string to be used as an HTML ID
 * @param str - The string to sanitize
 * @returns A valid HTML ID string
 */
export function sanitizeForHtmlId(str: string): string {
  // Replace invalid characters with hyphens
  let sanitized = str.replace(/[^a-zA-Z0-9_.-]/g, '-');
  
  // Ensure it starts with a valid character
  if (!/^[a-zA-Z_-]/.test(sanitized)) {
    sanitized = `id-${sanitized}`;
  }
  
  // Remove consecutive hyphens
  sanitized = sanitized.replace(/-+/g, '-');
  
  // Remove trailing hyphen
  sanitized = sanitized.replace(/-$/, '');
  
  return sanitized || generateShortId('id');
}
