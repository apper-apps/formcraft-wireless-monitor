// ConditionalLogicService - ApperClient integration for conditional logic management
// Handles CRUD operations for form conditional logic with database integration

// Initialize ApperClient with environment configuration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Database configuration
const TABLE_NAME = "conditional_logic_c";

// Standard field selection for conditional logic queries
const getConditionalLogicFields = () => [
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "field_id_c" } },
  { field: { Name: "triggering_condition_c" } },
  { field: { Name: "action_type_c" } },
  { field: { Name: "target_field_id_c" } },
  { field: { Name: "action_value_c" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "ModifiedOn" } }
];

// Field mapping helpers
const mapConditionalLogicToDatabase = (logicData) => ({
  Name: logicData.name || "Conditional Logic Rule",
  Tags: logicData.tags || "",
  field_id_c: parseInt(logicData.fieldId),
  triggering_condition_c: JSON.stringify(logicData.triggeringCondition || {}),
  action_type_c: logicData.actionType || "Show",
  target_field_id_c: parseInt(logicData.targetFieldId),
  action_value_c: logicData.actionValue || ""
});

const mapDatabaseToConditionalLogic = (dbLogic) => ({
  ...dbLogic,
  name: dbLogic.Name,
  fieldId: dbLogic.field_id_c?.Id || dbLogic.field_id_c,
  triggeringCondition: typeof dbLogic.triggering_condition_c === 'string' 
    ? JSON.parse(dbLogic.triggering_condition_c || '{}') 
    : dbLogic.triggering_condition_c || {},
  actionType: dbLogic.action_type_c,
  targetFieldId: dbLogic.target_field_id_c?.Id || dbLogic.target_field_id_c,
  actionValue: dbLogic.action_value_c,
  createdAt: dbLogic.CreatedOn,
  modifiedAt: dbLogic.ModifiedOn
});

export const conditionalLogicService = {
  /**
   * Get all conditional logic rules
   */
  async getAll() {
    try {
      const params = {
        fields: getConditionalLogicFields(),
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching conditional logic rules:", response.message);
        return [];
      }

      return (response.data || []).map(mapDatabaseToConditionalLogic);
    } catch (error) {
      console.error("Error in conditionalLogicService.getAll:", error);
      return [];
    }
  },

  /**
   * Get conditional logic rules by field ID
   */
  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: getConditionalLogicFields(),
        where: [
          { FieldName: "field_id_c", Operator: "EqualTo", Values: [parseInt(fieldId)] }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching conditional logic by field ID:", response.message);
        return [];
      }

      return (response.data || []).map(mapDatabaseToConditionalLogic);
    } catch (error) {
      console.error("Error in conditionalLogicService.getByFieldId:", error);
      return [];
    }
  },

  /**
   * Create new conditional logic rule
   */
  async create(logicData) {
    try {
      if (!logicData?.fieldId || !logicData?.targetFieldId) {
        throw new Error("Field ID and Target Field ID are required");
      }

      const dbData = mapConditionalLogicToDatabase(logicData);
      const params = { records: [dbData] };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Conditional logic creation failed:", response.message);
        throw new Error(response.message || "Failed to create conditional logic rule");
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          return mapDatabaseToConditionalLogic(result.data);
        } else {
          console.error(`Failed to create conditional logic record:${JSON.stringify([result])}`);
          throw new Error(result.message || "Failed to create conditional logic record");
        }
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error in conditionalLogicService.create:", error);
      throw error;
    }
  },

  /**
   * Update conditional logic rule
   */
  async update(id, logicData) {
    try {
      const dbData = {
        Id: parseInt(id),
        ...mapConditionalLogicToDatabase(logicData)
      };

      const params = { records: [dbData] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error updating conditional logic:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return mapDatabaseToConditionalLogic(result.data);
        } else {
          throw new Error(result.message || "Failed to update conditional logic");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in conditionalLogicService.update:", error);
      throw error;
    }
  },

  /**
   * Delete conditional logic rule
   */
  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error deleting conditional logic:", response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error in conditionalLogicService.delete:", error);
      throw error;
    }
  }
};