// CustomValidationService - ApperClient integration for custom validation management
// Handles CRUD operations for form custom validation with database integration

// Initialize ApperClient with environment configuration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Database configuration
const TABLE_NAME = "custom_validation_c";

// Standard field selection for custom validation queries
const getCustomValidationFields = () => [
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "field_id_c" } },
  { field: { Name: "validation_type_c" } },
  { field: { Name: "validation_expression_c" } },
  { field: { Name: "min_value_c" } },
  { field: { Name: "max_value_c" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "ModifiedOn" } }
];

// Field mapping helpers
const mapCustomValidationToDatabase = (validationData) => ({
  Name: validationData.name || "Custom Validation Rule",
  Tags: validationData.tags || "",
  field_id_c: parseInt(validationData.fieldId),
  validation_type_c: validationData.validationType || "Regex",
  validation_expression_c: validationData.validationExpression || "",
  min_value_c: validationData.minValue !== undefined ? parseFloat(validationData.minValue) : null,
  max_value_c: validationData.maxValue !== undefined ? parseFloat(validationData.maxValue) : null
});

const mapDatabaseToCustomValidation = (dbValidation) => ({
  ...dbValidation,
  name: dbValidation.Name,
  fieldId: dbValidation.field_id_c?.Id || dbValidation.field_id_c,
  validationType: dbValidation.validation_type_c,
  validationExpression: dbValidation.validation_expression_c,
  minValue: dbValidation.min_value_c,
  maxValue: dbValidation.max_value_c,
  createdAt: dbValidation.CreatedOn,
  modifiedAt: dbValidation.ModifiedOn
});

export const customValidationService = {
  /**
   * Get all custom validation rules
   */
  async getAll() {
    try {
      const params = {
        fields: getCustomValidationFields(),
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching custom validation rules:", response.message);
        return [];
      }

      return (response.data || []).map(mapDatabaseToCustomValidation);
    } catch (error) {
      console.error("Error in customValidationService.getAll:", error);
      return [];
    }
  },

  /**
   * Get custom validation rules by field ID
   */
  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: getCustomValidationFields(),
        where: [
          { FieldName: "field_id_c", Operator: "EqualTo", Values: [parseInt(fieldId)] }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching custom validation by field ID:", response.message);
        return [];
      }

      return (response.data || []).map(mapDatabaseToCustomValidation);
    } catch (error) {
      console.error("Error in customValidationService.getByFieldId:", error);
      return [];
    }
  },

  /**
   * Create new custom validation rule
   */
  async create(validationData) {
    try {
      if (!validationData?.fieldId) {
        throw new Error("Field ID is required");
      }

      const dbData = mapCustomValidationToDatabase(validationData);
      const params = { records: [dbData] };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Custom validation creation failed:", response.message);
        throw new Error(response.message || "Failed to create custom validation rule");
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          return mapDatabaseToCustomValidation(result.data);
        } else {
          console.error(`Failed to create custom validation record:${JSON.stringify([result])}`);
          throw new Error(result.message || "Failed to create custom validation record");
        }
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error in customValidationService.create:", error);
      throw error;
    }
  },

  /**
   * Update custom validation rule
   */
  async update(id, validationData) {
    try {
      const dbData = {
        Id: parseInt(id),
        ...mapCustomValidationToDatabase(validationData)
      };

      const params = { records: [dbData] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error updating custom validation:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return mapDatabaseToCustomValidation(result.data);
        } else {
          throw new Error(result.message || "Failed to update custom validation");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in customValidationService.update:", error);
      throw error;
    }
  },

  /**
   * Delete custom validation rule
   */
  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error deleting custom validation:", response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error in customValidationService.delete:", error);
      throw error;
    }
  },

  /**
   * Validate field value against custom validation rules
   */
  validateValue(value, validationRules) {
    const errors = [];

    for (const rule of validationRules) {
      switch (rule.validationType) {
        case 'Regex':
          if (rule.validationExpression) {
            try {
              const regex = new RegExp(rule.validationExpression);
              if (!regex.test(value)) {
                errors.push(`Value does not match required pattern`);
              }
            } catch (e) {
              errors.push(`Invalid validation pattern`);
            }
          }
          break;

        case 'Range':
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            if (rule.minValue !== null && numValue < rule.minValue) {
              errors.push(`Value must be at least ${rule.minValue}`);
            }
            if (rule.maxValue !== null && numValue > rule.maxValue) {
              errors.push(`Value must not exceed ${rule.maxValue}`);
            }
          }
          break;

        case 'CustomFunction':
          if (rule.validationExpression) {
            try {
              // Note: In a real implementation, you'd want to safely evaluate custom functions
              // This is a simplified example - actual implementation would need security considerations
              const isValid = eval(`(function(value) { ${rule.validationExpression} })`)(value);
              if (!isValid) {
                errors.push(`Custom validation failed`);
              }
            } catch (e) {
              errors.push(`Custom validation error: ${e.message}`);
            }
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};