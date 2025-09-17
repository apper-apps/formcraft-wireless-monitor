import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PublishFormModal = ({ isOpen, onClose, form, onUnpublish }) => {
  const [copying, setCopying] = useState(false);
  const [activeTab, setActiveTab] = useState('share');
const [copyingEmbed, setCopyingEmbed] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);

  if (!isOpen || !form) return null;

const generateEmbedCode = () => {
    return `<iframe src="${form.publishUrl}" width="600" height="450" frameborder="0" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"></iframe>`;
  };
const generateDynamicHtml = (form) => {
    if (!form.fields || !Array.isArray(form.fields)) {
      return '<p>No form fields available</p>';
    }

    const fields = typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields;
    
    const generateFieldHtml = (field) => {
      const fieldId = `field_${field.Id || field.id || Math.random().toString(36).substr(2, 9)}`;
      const isRequired = field.required ? ' required' : '';
      const requiredMark = field.required ? ' <span style="color: #ef4444;">*</span>' : '';
      
      switch (field.type) {
        case 'text':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="text" id="${fieldId}" name="${fieldId}" 
                     placeholder="${field.placeholder || ''}"${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'email':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="email" id="${fieldId}" name="${fieldId}" 
                     placeholder="${field.placeholder || ''}"${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'phone':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="tel" id="${fieldId}" name="${fieldId}" 
                     placeholder="${field.placeholder || ''}"${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'number':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="number" id="${fieldId}" name="${fieldId}" 
                     placeholder="${field.placeholder || ''}"
                     ${field.min !== undefined ? `min="${field.min}"` : ''}
                     ${field.max !== undefined ? `max="${field.max}"` : ''}${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'date':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="date" id="${fieldId}" name="${fieldId}"${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'file':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="file" id="${fieldId}" name="${fieldId}"
                     ${field.acceptedTypes ? `accept="${field.acceptedTypes}"` : ''}${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'textarea':
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <textarea id="${fieldId}" name="${fieldId}" rows="3"
                        placeholder="${field.placeholder || ''}"${isRequired}
                        style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5; resize: vertical;"></textarea>
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'select':
          const options = field.options || [];
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <select id="${fieldId}" name="${fieldId}"${isRequired}
                      style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
                <option value="">${field.placeholder || 'Select an option'}</option>
                ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
              </select>
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'radio':
          const radioOptions = field.options || [];
          return `
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                ${field.label}${requiredMark}
              </label>
              <div style="space-y: 0.5rem;">
                ${radioOptions.map((option, index) => `
                  <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <input type="radio" name="${fieldId}" value="${option}"${isRequired}
                           style="width: 1rem; height: 1rem; color: #8b5cf6; border: 1px solid #d1d5db;">
                    <span style="font-size: 0.875rem; color: #374151;">${option}</span>
                  </label>
                `).join('')}
              </div>
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'checkbox':
          return `
            <div style="margin-bottom: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="${fieldId}" name="${fieldId}" value="1"${isRequired}
                       style="width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid #d1d5db; color: #8b5cf6;">
                <span style="font-size: 0.875rem; font-weight: 500; color: #374151;">
                  ${field.label}${requiredMark}
                </span>
              </label>
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        case 'rating':
          const maxRating = field.maxRating || 5;
          return `
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                ${field.label}${requiredMark}
              </label>
              <div style="display: flex; gap: 0.25rem;">
                ${Array.from({ length: maxRating }, (_, index) => `
                  <input type="radio" name="${fieldId}" value="${index + 1}" 
                         style="display: none;" id="${fieldId}_${index + 1}"${isRequired}>
                  <label for="${fieldId}_${index + 1}" style="font-size: 1.5rem; color: #d1d5db; cursor: pointer;">★</label>
                `).join('')}
              </div>
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
            
        default:
          return `
            <div style="margin-bottom: 1rem;">
              <label for="${fieldId}" style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">
                ${field.label}${requiredMark}
              </label>
              <input type="text" id="${fieldId}" name="${fieldId}" 
                     placeholder="${field.placeholder || ''}"${isRequired}
                     style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; line-height: 1.5;">
              ${field.helpText ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">${field.helpText}</p>` : ''}
            </div>`;
      }
    };

    const formHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${form.name || 'Form'}</title>
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #f9fafb;
            padding: 2rem;
            margin: 0;
        }
        .form-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .form-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .submit-btn {
            width: 100%;
            background: linear-gradient(to right, #8b5cf6, #7c3aed);
            color: white;
            font-weight: 500;
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
            transition: all 0.2s;
        }
        .submit-btn:hover {
            background: linear-gradient(to right, #7c3aed, #6d28d9);
            transform: translateY(-1px);
        }
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        /* Rating stars styling */
        input[type="radio"] + label:hover,
        input[type="radio"]:checked + label {
            color: #fbbf24 !important;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h1 class="form-title">${form.name || 'Untitled Form'}</h1>
        <form action="#" method="POST">
            ${fields.map(generateFieldHtml).join('')}
            <button type="submit" class="submit-btn">Submit Form</button>
        </form>
    </div>
    
    <script>
        // Rating functionality
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (radio.id.includes('_')) {
                radio.addEventListener('change', function() {
                    const fieldName = this.name;
                    const ratingValue = this.value;
                    const labels = document.querySelectorAll('label[for^="' + fieldName + '_"]');
                    labels.forEach((label, index) => {
                        if (index < ratingValue) {
                            label.style.color = '#fbbf24';
                        } else {
                            label.style.color = '#d1d5db';
                        }
                    });
                });
            }
        });
        
        // Form submission handler
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted successfully! (This is a demo)');
        });
    </script>
</body>
</html>`;

    return formHTML;
  };

  const copyToClipboard = async (text, type = 'link') => {
    const setCopyingState = type === 'embed' ? setCopyingEmbed : type === 'html' ? setCopyingHtml : setCopying;
    
    setCopyingState(true);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type === 'embed' ? 'Embed code' : type === 'html' ? 'HTML code' : 'Link'} copied to clipboard!`);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(`${type === 'embed' ? 'Embed code' : type === 'html' ? 'HTML code' : 'Link'} copied to clipboard!`);
      } catch (fallbackErr) {
        toast.error(`Failed to copy ${type === 'embed' ? 'embed code' : type === 'html' ? 'HTML code' : 'link'}`);
      }
      document.body.removeChild(textArea);
    } finally {
      setTimeout(() => setCopyingState(false), 1000);
    }
  };

  const handleUnpublish = async () => {
    await onUnpublish();
    onClose();
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[80vh] border border-gray-200 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-bold text-gray-900">
              Form Published Successfully!
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

<div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Globe" className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{form.name}</p>
                <p className="text-sm text-gray-500">is now publicly available</p>
              </div>
            </div>

            {/* Tab Navigation */}
<div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('share')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'share'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
}`}
              >
                <div className="flex items-center gap-2">
                  <ApperIcon name="Share2" className="w-4 h-4" />
                  Share
                </div>
              </button>
              <button
                onClick={() => setActiveTab('embed')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'embed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
<div className="flex items-center gap-2">
                  <ApperIcon name="Code" className="w-4 h-4" />
                  HTML Code
                </div>
              </button>
            </div>

            {/* Share Tab Content */}
            {activeTab === 'share' && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
<label className="block text-sm font-medium text-gray-700 mb-2">
                    Shareable Link:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={form.publishUrl || ''}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button
                      onClick={() => copyToClipboard(form.publishUrl || '', 'link')}
                      disabled={copying}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1 px-3 py-2"
                    >
                      <ApperIcon 
                        name={copying ? "Check" : "Copy"} 
                        className={`w-4 h-4 ${copying ? "text-success" : ""}`} 
                      />
                      {copying ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
<div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Share this form</p>
                      <p>Anyone with this link can view and submit your form. You can unpublish it at any time.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

{/* Embed Tab Content */}
            {activeTab === 'embed' && (
              <div className="html-tab-content p-5 flex flex-col gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embed Code:
                  </label>
                  <div className="space-y-2">
                    <textarea
                      value={generateEmbedCode()}
                      readOnly
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 overflow-auto custom-scrollbar"
                    />
                    <Button
                      onClick={() => copyToClipboard(generateEmbedCode(), 'embed')}
                      disabled={copyingEmbed}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ApperIcon 
                        name={copyingEmbed ? "Check" : "Copy"} 
                        className={`w-4 h-4 ${copyingEmbed ? "text-success" : ""}`} 
                      />
                      {copyingEmbed ? "Code Copied!" : "Copy Embed Code"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* HTML Code Section */}
{activeTab === 'embed' && form.isPublished && (
              <div className="html-tab-content p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Complete HTML Code</h3>
                  <Button
                    onClick={() => copyToClipboard(generateDynamicHtml(form), 'html')}
                    disabled={copyingHtml}
                    variant="outline"
                    size="sm"
                  >
                    {copyingHtml ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Copying...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                        Copy HTML
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <textarea
                    value={form.htmlCode}
                    readOnly
                    className="w-full h-64 bg-white border border-gray-200 rounded-md p-3 text-xs font-mono text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent overflow-y-auto custom-scrollbar"
                    placeholder="HTML code will appear here..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => copyToClipboard(form.publishUrl || '', 'link')}
              className="flex-1 inline-flex items-center justify-center gap-2"
              disabled={copying}
            >
              <ApperIcon name="Share2" className="w-4 h-4" />
              {copying ? "Copied!" : "Share Link"}
            </Button>
            <Button
              onClick={handleUnpublish}
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="EyeOff" className="w-4 h-4" />
              Unpublish
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublishFormModal;