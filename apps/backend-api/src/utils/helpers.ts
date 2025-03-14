import crypto from "node:crypto";

/**
 * Generate a new UUID
 * @returns {string} A new UUID
 */
export const generateUUID = () => crypto.randomUUID();

/**
 * Format date for database
 * @param {Date} date - Date to format (defaults to current date)
 * @returns {Date} The formatted date
 */
export const formatDate = (date: Date = new Date()) => date;
