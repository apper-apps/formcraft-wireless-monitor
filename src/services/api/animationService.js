// AnimationService - Database integration for animation configurations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnimationService {
  constructor() {
    this.tableName = 'animation_c';
  }

  // Get all animations with filtering and sorting
  async getAll(filters = {}) {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "easing_c" } },
          { field: { Name: "target_element_c" } },
          { field: { Name: "trigger_event_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "ModifiedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      // Add filters if provided
      if (filters.type) {
        params.where = [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [filters.type]
          }
        ];
      }

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching animations:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching animations:", error);
        throw new Error(error.message || "Failed to fetch animations");
      }
    }
  }

  // Get animation by ID
  async getById(id) {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "easing_c" } },
          { field: { Name: "target_element_c" } },
          { field: { Name: "trigger_event_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching animation with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching animation with ID ${id}:`, error);
        throw new Error(error.message || "Failed to fetch animation");
      }
    }
  }

  // Create new animation
  async create(animationData) {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare data - only include updateable fields
      const params = {
        records: [{
          Name: animationData.Name || animationData.name || "New Animation",
          Tags: animationData.Tags || "",
          name_c: animationData.name_c || animationData.name || "New Animation",
          type_c: animationData.type_c || "FadeIn",
          duration_c: animationData.duration_c || 300,
          easing_c: animationData.easing_c || "ease-out",
          target_element_c: animationData.target_element_c || "",
          trigger_event_c: animationData.trigger_event_c || "OnLoad",
          settings_c: animationData.settings_c || "{}"
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create animation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Animation creation error: ${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              console.error(`Animation creation error: ${record.message}`);
            }
          });

          if (successfulRecords.length === 0) {
            throw new Error("Failed to create animation");
          }
        }

        return successfulRecords[0]?.data;
      }

      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating animation:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating animation:", error);
        throw new Error(error.message || "Failed to create animation");
      }
    }
  }

  // Update existing animation
  async update(id, animationData) {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare data - only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: animationData.Name || animationData.name,
          Tags: animationData.Tags,
          name_c: animationData.name_c || animationData.name,
          type_c: animationData.type_c,
          duration_c: animationData.duration_c,
          easing_c: animationData.easing_c,
          target_element_c: animationData.target_element_c,
          trigger_event_c: animationData.trigger_event_c,
          settings_c: animationData.settings_c
        }]
      };

      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update animation ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Animation update error: ${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              console.error(`Animation update error: ${record.message}`);
            }
          });

          if (successfulUpdates.length === 0) {
            throw new Error("Failed to update animation");
          }
        }

        return successfulUpdates[0]?.data;
      }

      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating animation:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating animation:", error);
        throw new Error(error.message || "Failed to update animation");
      }
    }
  }

  // Delete animation
  async delete(id) {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete animation ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) {
              console.error(`Animation deletion error: ${record.message}`);
            }
          });

          return successfulDeletions.length > 0;
        }

        return successfulDeletions.length === 1;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting animation:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting animation:", error);
        throw new Error(error.message || "Failed to delete animation");
      }
    }
  }

  // Get animations by type
  async getByType(type) {
    return this.getAll({ type });
  }

  // Get animation settings as parsed JSON
  getAnimationSettings(animation) {
    try {
      return animation.settings_c ? JSON.parse(animation.settings_c) : {};
    } catch (error) {
      console.warn("Failed to parse animation settings:", error);
      return {};
    }
  }

  // Convert animation to CSS/JS configuration
  getAnimationConfig(animation) {
    const settings = this.getAnimationSettings(animation);
    
    return {
      type: animation.type_c,
      duration: animation.duration_c || 300,
      easing: animation.easing_c || 'ease-out',
      target: animation.target_element_c,
      trigger: animation.trigger_event_c || 'OnLoad',
      settings: {
        delay: settings.delay || 0,
        iterations: settings.iterations || 1,
        direction: settings.direction || 'normal',
        fillMode: settings.fillMode || 'both',
        ...settings
      }
    };
  }
}

export const animationService = new AnimationService();
export default animationService;