import { 
  AppUser, 
  Organization, 
  Employee, 
  Supplier, 
  SupplierSite, 
  Address,
  OrgUnit,
  Role,
  EmployeeOrgUnitRole,
  Store,
  SupplierInvitation,
  SupplierSiteDocument,
  DocumentVerification,
  SupplierSiteTerm,
  SupplierFinancialTerm,
  SupplierTradeTerm,
  SupplierSupportTerm,
  SupplierTermNote,
  ApprovalProcess,
  ApprovalStep,
  ApprovalResponsibility,
  ApprovalRequest,
  ApprovalLog,
  ApprovalComment,
  NewAppUser,
  NewOrganization,
  NewEmployee,
  NewSupplier,
  NewSupplierSite,
  NewAddress,
  NewOrgUnit,
  NewRole,
  NewEmployeeOrgUnitRole,
  NewStore,
  NewSupplierInvitation,
  NewSupplierSiteDocument,
  NewDocumentVerification,
  NewSupplierSiteTerm,
  NewSupplierFinancialTerm,
  NewSupplierTradeTerm,
  NewSupplierSupportTerm,
  NewSupplierTermNote,
  NewApprovalProcess,
  NewApprovalStep,
  NewApprovalResponsibility,
  NewApprovalRequest,
  NewApprovalLog,
  NewApprovalComment,
  SupplierStatus,
  ApprovalStatus,
  InvitationStatus,
  VerificationStatus
} from "@workspace/database/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const api = {
  // AppUser operations
  async getUsers(): Promise<AppUser[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch users");
    }
  },

  async getUserById(uid: string): Promise<AppUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch user");
    }
  },

  async createUser(data: NewAppUser): Promise<AppUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to create user");
    }
  },

  async updateUser(
    uid: string,
    data: Partial<NewAppUser>,
  ): Promise<AppUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update user");
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to delete user");
    }
  },

  // Organization operations
  async getOrganizations(): Promise<Organization[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch organizations");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch organizations");
    }
  },

  async getOrganizationById(uid: string): Promise<Organization> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${uid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch organization");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch organization");
    }
  },

  async createOrganization(data: NewOrganization): Promise<Organization> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create organization");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to create organization");
    }
  },

  async updateOrganization(
    uid: string,
    data: Partial<NewOrganization>,
  ): Promise<Organization> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update organization");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update organization");
    }
  },

  async deleteOrganization(uid: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${uid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete organization");
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to delete organization");
    }
  },

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch employees");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch employees");
    }
  },

  async getOrganizationEmployees(orgUid: string): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${orgUid}/employees`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch organization employees");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch organization employees");
    }
  },

  async getEmployeeByUserUid(userUid: string): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${userUid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch employee");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch employee");
    }
  },

  async createEmployee(data: NewEmployee): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create employee");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to create employee");
    }
  },

  async updateEmployee(
    userUid: string,
    data: Partial<NewEmployee>,
  ): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${userUid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update employee");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update employee");
    }
  },

  async deleteEmployee(userUid: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${userUid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete employee");
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to delete employee");
    }
  },

  // Supplier operations
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch suppliers");
    }
  },

  async getOrganizationSuppliers(orgUid: string): Promise<Supplier[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${orgUid}/suppliers`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch organization suppliers");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch organization suppliers");
    }
  },

  async getSupplierByUserUid(userUid: string): Promise<Supplier> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${userUid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch supplier");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch supplier");
    }
  },

  async createSupplier(data: NewSupplier): Promise<Supplier> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create supplier");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to create supplier");
    }
  },

  async updateSupplier(
    userUid: string,
    data: Partial<NewSupplier>,
  ): Promise<Supplier> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${userUid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update supplier");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update supplier");
    }
  },

  async updateSupplierStatus(
    userUid: string,
    status: SupplierStatus,
  ): Promise<Supplier> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${userUid}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update supplier status");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update supplier status");
    }
  },

  async deleteSupplier(userUid: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${userUid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete supplier");
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to delete supplier");
    }
  },

  // Add more API methods for other entities as needed...
  // This is a subset of the available endpoints to keep the file manageable
  // Additional methods can be added as required for specific functionality
};

export type Api = typeof api;
