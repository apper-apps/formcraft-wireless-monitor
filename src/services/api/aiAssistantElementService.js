// AI Assistant Element Service - ApperClient integration for AI assistant element management
// Handles all CRUD operations for AI assistant elements with optimized error handling and field mapping

// Initialize ApperClient with environment configuration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Database configuration
const TABLE_NAME = "ai_assistant_element_c";

// Utility functions
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

// Enhanced JSON parser with better error recovery
const safeJsonParse = (value, fallback = {}) => {
  if (!value) return fallback;
  
  // Handle already parsed objects
  if (typeof value === 'object') return value;
  
  // Parse string values with enhanced error handling
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (parseError) {
      // Enhanced fallback logic for better error recovery
      if (value === '""' || value === "''" || value === 'null') return fallback;
      // Return the original value if it's a simple string
      return value;
    }
  }
  
  return value || fallback;
};

// Field mapping helpers for database schema alignment
const mapToDatabase = (elementData) => ({
  Name: elementData.name || "AI Assistant Element",
  Tags: elementData.tags || "",
  description_c: elementData.description || "",
  settings_c: JSON.stringify(elementData.settings || {
    enabled: true,
    position: "bottom-right",
    size: "medium",
    theme: "default",
    contextualSuggestions: true,
    proactiveTips: false,
    animations: true,
    voiceInteraction: false,
    integrations: {
      helpDesk: false,
      analytics: true,
      chatbot: false
    },
    customization: {
      primaryColor: "#8B7FFF",
      avatar: "orb",
      greeting: "Hi! I'm here to help you build amazing forms.",
      personality: "friendly"
    }
  })
});

const mapFromDatabase = (dbElement) => ({
  ...dbElement,
  name: dbElement.Name,
  description: dbElement.description_c || "",
  settings: safeJsonParse(dbElement.settings_c, {}),
  createdAt: dbElement.CreatedOn,
  createdBy: dbElement.CreatedBy,
  modifiedAt: dbElement.ModifiedOn,
  modifiedBy: dbElement.ModifiedBy
});

// Standard field selection for AI assistant element queries
const getElementFields = () => [
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "Owner" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "CreatedBy" } },
  { field: { Name: "ModifiedOn" } },
  { field: { Name: "ModifiedBy" } },
  { field: { Name: "description_c" } },
  { field: { Name: "settings_c" } }
];

// Enhanced AI Assistant Element service with optimized operations
export const aiAssistantElementService = {
  /**
   * Retrieve all AI assistant elements with enhanced error handling
   */
  async getAll() {
    try {
      const params = {
        fields: getElementFields(),
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching AI assistant elements:", response.message);
        return [];
      }

      return (response.data || []).map(mapFromDatabase);
    } catch (error) {
      console.error("Error in aiAssistantElementService.getAll:", error);
      return [];
    }
  },

  /**
   * Create new AI assistant element with enhanced validation
   */
  async create(elementData) {
    try {
      // Validate required fields
      if (!elementData?.name?.trim()) {
        throw new Error("AI assistant element name is required");
      }

      const dbData = mapToDatabase(elementData);
      
      const params = { records: [dbData] };
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      // CRITICAL: Check top-level response.success first
      if (!response.success) {
        console.error("AI assistant element creation failed:", response.message);
        throw new Error(response.message || "Failed to create AI assistant element - server error");
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          return mapFromDatabase(result.data);
        } else {
          // Handle partial failure - log and throw specific error
          console.error(`Failed to create AI assistant elements ${1} records:${JSON.stringify([result])}`);
          const errorMessage = result.message || "Failed to create AI assistant element record";
          if (result.errors && result.errors.length > 0) {
            const fieldErrors = result.errors.map(err => `${err.fieldLabel}: ${err.message || err}`).join(", ");
            throw new Error(`${errorMessage} - ${fieldErrors}`);
          }
          throw new Error(errorMessage);
        }
      }
      
      // Handle case where no results are returned
      throw new Error("No results returned from create operation");
    } catch (error) {
      if (error.response?.data?.message) {
        console.error("Error in aiAssistantElementService.create:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error in aiAssistantElementService.create:", error.message || error);
        throw error;
      }
    }
  },

  /**
   * Get AI assistant element by ID with enhanced error handling
   */
  async getById(id) {
    try {
      const params = { fields: getElementFields() };
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching AI assistant element by ID:", response.message);
        throw new Error(response.message || "AI assistant element not found");
      }

      const element = response.data;
      if (!element) {
        throw new Error("AI assistant element not found");
      }

      return mapFromDatabase(element);
    } catch (error) {
      console.error("Error in aiAssistantElementService.getById:", error);
      throw error;
    }
  },

  /**
   * Update existing AI assistant element with optimized field handling
   */
  async update(id, elementData) {
    try {
      const dbData = {
        Id: parseInt(id),
        ...mapToDatabase(elementData)
      };

      const params = { records: [dbData] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error updating AI assistant element:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return mapFromDatabase(result.data);
        } else {
          // Handle partial failure
          console.error(`Failed to update AI assistant elements ${1} records:${JSON.stringify([result])}`);
          throw new Error(result.message || "Failed to update AI assistant element");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in aiAssistantElementService.update:", error);
      throw error;
    }
  },

  /**
   * Delete AI assistant element with enhanced error handling
   */
  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error deleting AI assistant element:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error(`Failed to delete AI assistant elements ${1} records:${JSON.stringify([result])}`);
          throw new Error(result.message || "Failed to delete AI assistant element");
        }
      }

      return true;
    } catch (error) {
      console.error("Error in aiAssistantElementService.delete:", error);
      throw error;
    }
  }
};

export default aiAssistantElementService;