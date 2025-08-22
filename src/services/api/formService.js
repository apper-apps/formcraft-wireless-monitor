import React from "react";
import Error from "@/components/ui/Error";
// Initialize ApperClient for database operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Database table name for forms
const TABLE_NAME = "form_c";

// In-memory forms storage (replace with actual database calls)
let forms = [];

// Function to generate next available ID
const getNextId = () => {
  return forms.length > 0 ? Math.max(...forms.map(f => f.Id)) + 1 : 1;
};

const generatePublishId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const formService = {
  async getAll() {
    await delay();
    return forms.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(formData) {
    await delay();
    const newForm = {
      Id: getNextId(),
      name: formData.name || "Untitled Form",
      description: formData.description || "",
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
      thank_you_c: JSON.stringify({
        message: "Thank you for your submission!",
        showMessage: true,
        redirectUrl: ""
      }),
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString(),
      is_published_c: false,
publish_url_c: null,
      publish_id_c: null,
      submission_count_c: 0
    };
    
    forms.push(newForm);
    return { ...newForm };
  },

  async getById(id) {
    await delay();
    const form = forms.find(f => f.Id === id);
    if (!form) {
      throw new Error("Form not found");
    }
    return { ...form };
  },

  async update(id, formData) {
    await delay();
    const index = forms.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("Form not found");
    }
    const updatedForm = {
      ...forms[index],
      ...formData,
      updatedAt: new Date().toISOString(),
      fields: (formData.fields || forms[index].fields || []).map(field => ({
        ...field,
        showCondition: field.showCondition || {
          enabled: false,
          fieldId: '',
          operator: 'equals',
          value: ''
        }
      })),
      notifications: formData.notifications || forms[index].notifications || {
        enabled: false,
        recipients: []
      }
    };
    forms[index] = updatedForm;
    return { ...updatedForm };
  },

  async publish(id) {
    await delay();
    const index = forms.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("Form not found");
    }
    const publishId = generatePublishId();
// Generate complete standalone HTML form
    const form = forms[index];
    const fields = JSON.parse(form.fields_c || '[]');
    const settings = JSON.parse(form.settings_c || '{}');
    const style = JSON.parse(form.style_c || '{}');
    
    const generateStandaloneHTML = (formData, fields, settings, style) => {
      const primaryColor = style.primaryColor || '#8B7FFF';
      const fontFamily = style.fontFamily || 'Inter';
      const formWidth = style.formWidth || 'medium';
      
      const widthClass = formWidth === 'narrow' ? 'max-w-lg' : formWidth === 'wide' ? 'max-w-4xl' : 'max-w-2xl';
      const fontClass = fontFamily === 'Plus Jakarta Sans' ? 'font-display' : 
                       fontFamily === 'Georgia' ? 'font-serif' : 
                       fontFamily === 'Courier New' ? 'font-mono' : 'font-sans';
      
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
          
          case 'radio':
            const radioOptions = field.options || [];
            return `
              <div class="mb-6">
                <fieldset>
                  <legend class="block text-sm font-medium text-gray-700 mb-3">
                    ${field.label} ${requiredMark}
                  </legend>
                  <div class="space-y-2">
                    ${radioOptions.map((option, index) => `
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          name="${field.Id}" 
                          value="${option}"
                          class="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          ${isRequired}
                        />
                        <span class="ml-3 text-gray-700">${option}</span>
                      </label>
                    `).join('')}
                  </div>
                </fieldset>
              </div>`;
          
          case 'checkbox':
            return `
              <div class="mb-6">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="${field.Id}"
                    name="${field.Id}"
                    value="1"
                    class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    ${isRequired}
                  />
                  <span class="ml-3 text-gray-700">${field.label} ${requiredMark}</span>
                </label>
              </div>`;
          
          case 'number':
            return `
              <div class="mb-6">
                <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                  ${field.label} ${requiredMark}
                </label>
                <input 
                  type="number" 
                  id="${field.Id}"
                  name="${field.Id}"
                  placeholder="${field.placeholder || ''}"
                  ${field.min !== undefined ? `min="${field.min}"` : ''}
                  ${field.max !== undefined ? `max="${field.max}"` : ''}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  ${isRequired}
                />
              </div>`;
          
          case 'date':
            return `
              <div class="mb-6">
                <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                  ${field.label} ${requiredMark}
                </label>
                <input 
                  type="date" 
                  id="${field.Id}"
                  name="${field.Id}"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  ${isRequired}
                />
              </div>`;
          
          case 'file':
            return `
              <div class="mb-6">
                <label for="${field.Id}" class="block text-sm font-medium text-gray-700 mb-2">
                  ${field.label} ${requiredMark}
                </label>
                <input 
                  type="file" 
                  id="${field.Id}"
                  name="${field.Id}"
                  accept="${field.acceptedTypes || ''}"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
                  ${isRequired}
                />
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

      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.Name || 'Form'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: ${primaryColor};
            --primary-dark: ${primaryColor}dd;
            --primary-light: ${primaryColor}33;
        }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .bg-primary-dark { background-color: var(--primary-dark); }
        .border-primary { border-color: var(--primary); }
        .ring-primary { --tw-ring-color: var(--primary-light); }
        .focus\\:ring-primary:focus { --tw-ring-color: var(--primary-light); }
        .focus\\:border-primary:focus { border-color: var(--primary); }
        .hover\\:bg-primary-dark:hover { background-color: var(--primary-dark); }
        .form-container {
            font-family: ${fontFamily === 'Plus Jakarta Sans' ? "'Plus Jakarta Sans', sans-serif" : 
                        fontFamily === 'Georgia' ? 'Georgia, serif' : 
                        fontFamily === 'Courier New' ? "'Courier New', monospace" : 
                        "'Inter', sans-serif"};
        }
        .loading { display: none; }
        .loading.show { display: block; }
        .submit-success { display: none; }
        .submit-success.show { display: block; }
    </style>
</head>
<body class="bg-gray-50 py-12 px-4">
    <div class="form-container ${widthClass} mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">${formData.Name || 'Form'}</h1>
                ${formData.description_c ? `<p class="text-gray-600">${JSON.parse(formData.description_c || '""')}</p>` : ''}
            </div>
            
            <form id="standalone-form" class="space-y-6">
                ${fields.map(generateFieldHTML).join('')}
                
                <div class="pt-6">
                    <button 
                        type="submit" 
                        class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
                    >
                        <span class="submit-text">${settings.submitButtonText || 'Submit'}</span>
                        <span class="loading">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    </button>
                </div>
            </form>
            
            <div class="submit-success text-center py-8">
                <div class="text-green-600 text-5xl mb-4">✓</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                <p class="text-gray-600">${settings.successMessage || 'Your submission has been received successfully.'}</p>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('standalone-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Show loading state
            const submitText = this.querySelector('.submit-text');
            const loading = this.querySelector('.loading');
            const button = this.querySelector('button[type="submit"]');
            
            submitText.style.display = 'none';
            loading.classList.add('show');
            button.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Hide form and show success message
                this.style.display = 'none';
                document.querySelector('.submit-success').classList.add('show');
                
                // Log form data (replace with actual submission logic)
                console.log('Form submitted:', data);
                
                // Optional: Send to your backend endpoint
                // fetch('/api/form-submission', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
            }, 1500);
        });
        
        // Form validation
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('border-red-500');
                    this.classList.remove('border-gray-300');
                } else {
                    this.classList.remove('border-red-500');
                    this.classList.add('border-gray-300');
                }
            });
        });
    </script>
</body>
</html>`;
    };

    const htmlCode = generateStandaloneHTML(form, fields, settings, style);
    const publishUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlCode)}`;
    
    forms[index] = { 
      ...forms[index], 
      is_published_c: true, 
      publish_url_c: publishUrl,
      publish_id_c: publishId,
      updated_at_c: new Date().toISOString(),
      htmlCode: htmlCode // Store the generated HTML for easy access
    };
    return { ...forms[index] };
  },

  async unpublish(id) {
    await delay();
    const index = forms.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("Form not found");
    }
    forms[index] = { 
      ...forms[index], 
      isPublished: false, 
      publishUrl: null,
      publishId: null,
      updatedAt: new Date().toISOString()
    };
    return { ...forms[index] };
  },

  async getByPublishId(publishId) {
    await delay();
    const form = forms.find(f => f.publishId === publishId && f.isPublished);
    if (!form) {
      throw new Error("Form not found or no longer available");
    }
    return { ...form };
  },

  async incrementSubmissionCount(formId) {
    await delay();
    const formIndex = forms.findIndex(f => f.Id === parseInt(formId));
    if (formIndex === -1) {
      throw new Error("Form not found");
    }
    forms[formIndex].submissionCount = (forms[formIndex].submissionCount || 0) + 1;
    forms[formIndex].updatedAt = new Date().toISOString();
    return { ...forms[formIndex] };
  },

  async getAnalytics(formId) {
    await delay();
    const form = forms.find(f => f.Id === parseInt(formId));
    if (!form) {
      throw new Error("Form not found");
    }

    // Import responseService dynamically to avoid circular dependency
    const { responseService } = await import('./responseService');
    const responses = await responseService.getByFormId(formId);
    const totalResponses = responses.length;
    
    // Calculate this week's responses
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekResponses = responses.filter(r => 
      new Date(r.submittedAt) >= oneWeekAgo
    ).length;

    // Calculate previous week's responses for trend comparison
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const lastWeekResponses = responses.filter(r => {
      const responseDate = new Date(r.submittedAt);
      return responseDate >= twoWeeksAgo && responseDate < oneWeekAgo;
    }).length;

    // Calculate trend
    let trend = 'stable';
    if (thisWeekResponses > lastWeekResponses) {
      trend = 'up';
    } else if (thisWeekResponses < lastWeekResponses) {
      trend = 'down';
    }

    // Get last submission date
    const lastSubmission = responses.length > 0 
      ? responses.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0].submittedAt
      : null;

    return {
      totalResponses,
      thisWeekResponses,
      lastWeekResponses,
      trend,
      lastSubmissionDate: lastSubmission,
      responseRate: totalResponses > 0 ? Math.round((thisWeekResponses / 7) * 100) : 0
    };
  },

  async delete(id) {
    await delay();
    const index = forms.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("Form not found");
    }
    forms.splice(index, 1);
    return true;
  }
};