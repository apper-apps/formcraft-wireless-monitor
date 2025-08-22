// FormService - Enhanced ApperClient integration for form management
// Handles all CRUD operations for forms with optimized error handling and field mapping

// Initialize ApperClient with environment configuration
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Database configuration
const TABLE_NAME = "form_c";

// Utility functions
const generatePublishId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

// Enhanced JSON parser with better error recovery
const safeJsonParse = (value, fallback = "") => {
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
const mapFormToDatabase = (formData) => ({
  Name: formData.name || "Untitled Form",
  Tags: formData.tags || "",
  description_c: formData.description || "",
  fields_c: JSON.stringify((formData.fields || []).map(field => ({
    ...field,
    showCondition: field.showCondition || {
      enabled: false,
      fieldId: '',
      operator: 'equals',
      value: ''
    }
  }))),
  settings_c: JSON.stringify(formData.settings || {
    submitButtonText: "Submit",
    successMessage: "Thank you for your submission!",
    allowMultipleSubmissions: true
  }),
  style_c: JSON.stringify(formData.style || {
    primaryColor: '#8B7FFF',
    fontFamily: 'Inter',
    formWidth: 'medium'
  }),
  notifications_c: JSON.stringify(formData.notifications || {
    enabled: false,
    recipients: []
  }),
  thank_you_c: JSON.stringify(formData.thankYou || {
    message: "Thank you for your submission!",
    useCustom: false,
    redirectUrl: "",
    showCreateFormButton: true
  }),
  updated_at_c: new Date().toISOString()
});

const mapDatabaseToForm = (dbForm) => ({
  ...dbForm,
  name: dbForm.Name,
  description: safeJsonParse(dbForm.description_c, ""),
  fields: safeJsonParse(dbForm.fields_c, []),
  settings: safeJsonParse(dbForm.settings_c, {}),
  style: safeJsonParse(dbForm.style_c, {}),
  notifications: safeJsonParse(dbForm.notifications_c, {}),
  thankYou: safeJsonParse(dbForm.thank_you_c, {}),
  createdAt: dbForm.created_at_c,
  updatedAt: dbForm.updated_at_c,
  isPublished: dbForm.is_published_c,
  publishUrl: dbForm.publish_url_c,
  publishId: dbForm.publish_id_c,
  submissionCount: dbForm.submission_count_c || 0,
  htmlCode: dbForm.html_code_c
});

// Standard field selection for form queries
const getFormFields = () => [
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "description_c" } },
  { field: { Name: "created_at_c" } },
  { field: { Name: "updated_at_c" } },
  { field: { Name: "is_published_c" } },
  { field: { Name: "publish_url_c" } },
  { field: { Name: "publish_id_c" } },
  { field: { Name: "submission_count_c" } },
  { field: { Name: "fields_c" } },
  { field: { Name: "settings_c" } },
  { field: { Name: "style_c" } },
  { field: { Name: "notifications_c" } },
  { field: { Name: "thank_you_c" } },
  { field: { Name: "html_code_c" } }
];

// Enhanced form service with optimized operations
export const formService = {
  /**
   * Retrieve all forms with enhanced error handling
   */
  async getAll() {
    try {
      const params = {
        fields: getFormFields(),
        orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching forms:", response.message);
        return [];
      }

      return (response.data || []).map(mapDatabaseToForm);
    } catch (error) {
      console.error("Error in formService.getAll:", error);
      return [];
    }
  },

  /**
   * Create new form with enhanced validation
   */
  async create(formData) {
    try {
      const dbData = {
        ...mapFormToDatabase(formData),
        created_at_c: new Date().toISOString(),
        is_published_c: false,
        publish_url_c: "",
        publish_id_c: "",
        submission_count_c: 0
      };

      const params = { records: [dbData] };
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error creating form:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return mapDatabaseToForm(result.data);
        } else {
          throw new Error(result.message || "Failed to create form");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in formService.create:", error);
      throw error;
    }
  },

  /**
   * Get form by ID with enhanced error handling
   */
  async getById(id) {
    try {
      const params = { fields: getFormFields() };
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching form by ID:", response.message);
        throw new Error(response.message || "Form not found");
      }

      const form = response.data;
      if (!form) {
        throw new Error("Form not found");
      }

      return mapDatabaseToForm(form);
    } catch (error) {
      console.error("Error in formService.getById:", error);
      throw error;
    }
  },

  /**
   * Update existing form with optimized field handling
   */
  async update(id, formData) {
    try {
      const dbData = {
        Id: parseInt(id),
        ...mapFormToDatabase(formData)
      };

      const params = { records: [dbData] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error updating form:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return mapDatabaseToForm(result.data);
        } else {
          throw new Error(result.message || "Failed to update form");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in formService.update:", error);
      throw error;
    }
  },

  /**
   * Publish form with enhanced HTML generation
   */
  async publish(id) {
    try {
      const publishId = generatePublishId();
      const form = await this.getById(id);
      const fields = form.fields || [];
      const settings = form.settings || {};
      const style = form.style || {};
      
      // Enhanced HTML generation for standalone forms
      const htmlCode = this._generateStandaloneHTML(form, fields, settings, style);
      const publishUrl = `${window.location.origin}/form/${publishId}`;
      
      const params = {
        records: [{
          Id: parseInt(id),
          is_published_c: true,
          publish_url_c: publishUrl,
          publish_id_c: publishId,
          html_code_c: htmlCode,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error publishing form:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const updatedForm = result.data;
          return {
            ...form,
            ...mapDatabaseToForm(updatedForm)
          };
        } else {
          throw new Error(result.message || "Failed to publish form");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in formService.publish:", error);
      throw error;
    }
  },

  /**
   * Unpublish form with streamlined operation
   */
  async unpublish(id) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          is_published_c: false,
          publish_url_c: "",
          publish_id_c: "",
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error unpublishing form:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return mapDatabaseToForm(result.data);
        } else {
          throw new Error(result.message || "Failed to unpublish form");
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error in formService.unpublish:", error);
      throw error;
    }
  },

  /**
   * Get published form by publish ID
   */
  async getByPublishId(publishId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "fields_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "style_c" } },
          { field: { Name: "html_code_c" } },
          { field: { Name: "is_published_c" } },
          { field: { Name: "publish_id_c" } }
        ],
        where: [
          { FieldName: "publish_id_c", Operator: "EqualTo", Values: [publishId] },
          { FieldName: "is_published_c", Operator: "EqualTo", Values: [true] }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching form by publish ID:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("Form not found or no longer available");
      }

      return mapDatabaseToForm(response.data[0]);
    } catch (error) {
      console.error("Error in formService.getByPublishId:", error);
      throw error;
    }
  },

  /**
   * Delete form with enhanced error handling
   */
  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error deleting form:", response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error in formService.delete:", error);
      throw error;
    }
  },

  /**
   * Enhanced HTML generation for standalone published forms
   * @private
   */
  _generateStandaloneHTML(formData, fields, settings, style) {
    const primaryColor = style.primaryColor || '#8B7FFF';
    const fontFamily = style.fontFamily || 'Inter';
    const formWidth = style.formWidth || 'medium';
    
    const widthClass = formWidth === 'narrow' ? 'max-w-lg' : 
                      formWidth === 'wide' ? 'max-w-4xl' : 'max-w-2xl';
    
    const generateFieldHTML = (field) => {
      const isRequired = field.required ? 'required' : '';
      const requiredMark = field.required ? '<span class="text-red-500">*</span>' : '';
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'url':
        case 'password':
          return `
            <div class="mb-6">
              <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                ${field.label} ${requiredMark}
              </label>
              <input 
                type="${field.type}" 
                id="${field.Id}"
                name="${field.Id}"
                placeholder="${field.placeholder || ''}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                ${isRequired}
              />
            </div>`;
        
        case 'textarea':
          return `
            <div class="mb-6">
              <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                ${field.label} ${requiredMark}
              </label>
              <textarea 
                id="${field.Id}"
                name="${field.Id}"
                rows="4"
                placeholder="${field.placeholder || ''}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-vertical"
                ${isRequired}
              ></textarea>
            </div>`;
        
        case 'select':
          const options = field.options || [];
          return `
            <div class="mb-6">
              <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                ${field.label} ${requiredMark}
              </label>
              <select 
                id="${field.Id}"
                name="${field.Id}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                ${isRequired}
              >
                <option value="">Choose an option</option>
                ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
              </select>
            </div>`;
        
        default:
          return `
            <div class="mb-6">
              <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                ${field.label} ${requiredMark}
              </label>
              <input 
                type="text" 
                id="${field.Id}"
                name="${field.Id}"
                placeholder="${field.placeholder || ''}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                ${isRequired}
              />
            </div>`;
      }
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.name || 'Form'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: ${primaryColor};
            --primary-dark: ${primaryColor}dd;
            --primary-light: ${primaryColor}33;
        }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .bg-primary-dark { background-color: var(--primary-dark); }
        .border-primary { border-color: var(--primary); }
        .ring-primary { --tw-ring-color: var(--primary-light); }
        .focus\\:ring-primary:focus { --tw-ring-color: var(--primary-light); }
        .focus\\:border-primary:focus { border-color: var(--primary); }
        .hover\\:bg-primary-dark:hover { background-color: var(--primary-dark); }
    </style>
</head>
<body class="bg-gray-50 py-12 px-4">
    <div class="form-container ${widthClass} mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">${formData.name || 'Form'}</h1>
                ${formData.description ? `<p class="text-gray-600">${formData.description}</p>` : ''}
            </div>
            
            <form id="standalone-form" class="space-y-6">
                ${fields.map(generateFieldHTML).join('')}
                
                <div class="pt-6">
                    <button 
                        type="submit" 
                        class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
                    >
                        <span class="submit-text">${settings.submitButtonText || 'Submit'}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>`;
  }
};