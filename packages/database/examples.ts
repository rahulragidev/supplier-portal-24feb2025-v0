/**
 * Example Values for Documentation
 *
 * This file contains example values used in OpenAPI documentation and tests.
 * These examples are organized by category and provide realistic sample data
 * for all entity types in the system.
 *
 * The examples are used in:
 * 1. OpenAPI schemas for Swagger UI documentation
 * 2. Test fixtures for unit and integration tests
 * 3. Default values for development environments
 */

export const Examples = {
  // Common fields
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  email: "john.doe@example.com",
  phone: "+1-555-123-4567",
  datetime: "2023-01-01T00:00:00Z",

  // Document examples
  fileUrl: "https://storage.example.com/documents/tax-cert-2023.pdf",
  fileSize: 1024567,
  mimeType: "application/pdf",

  // Business identifiers
  pan: "ABCDE1234F",
  gst: "29ABCDE1234F1Z5",
  fssai: "12345678901234",
  msme: "MSME123456",

  // Common names and codes
  employeeCode: "EMP001",
  supplierCode: "SUP001",
  siteCode: "SITE001",
  orgUnitCode: "DEPT001",
  termCode: "TERM001",

  // Extra data examples
  employeeExtraData: { department: "IT" },
  supplierExtraData: { rating: 4.5, preferredPaymentTerms: "NET30" },
  siteExtraData: { isPrimary: true },
  orgUnitExtraData: { level: 2, headCount: 50 },
  documentExtraData: { verified: true },
  approvalExtraData: { level: 1, threshold: 10000 },

  // Names
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  companyName: "Acme Corporation",
  siteName: "Main Office",
  departmentName: "Sales Department",

  // Addresses
  addressLine1: "123 Main St",
  addressLine2: "Suite 100",
  city: "New York",
  state: "NY",
  country: "USA",
  pincode: "10001",
} as const;
