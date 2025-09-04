import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { formService } from "@/services/api/formService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FormBuilderCanvas = ({
  fields = [],
  onFieldsChange,
  formName,
  onSave,
  onFormNameChange,
  selectedFieldId,
  onFieldSelect,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  currentForm,
  onPublish,
  onUnpublish,
  onShowPublishModal,
  formStyle = {},
  onStyleChange,
  notificationSettings = { enabled: false, recipients: [] },
  onLivePreviewToggle,
  onNotificationSettingsChange,
  thankYouSettings = {},
  onThankYouSettingsChange,
  formSteps = [],
  currentStep = 1,
  onStepChange
}) => {
  // State management with better organization
  const [dragState, setDragState] = useState({
    dragOverIndex: null,
    draggedFieldId: null,
    isDraggedOver: false,
    draggedFromLibrary: false,
    dragStartPosition: null
  });
  
  const [uiState, setUiState] = useState({
    activeTab: 'design',
    emailInput: '',
    aiPrompt: '',
    isGeneratingForm: false
  });

  const canvasRef = useRef(null);

  // Memoized constants
  const SUPPORTED_FIELD_TYPES = useMemo(() => [
    'text', 'email', 'number', 'textarea', 'select', 'radio', 
    'checkbox', 'date', 'time', 'url', 'tel', 'phone', 'password', 
    'file', 'rating', 'slider', 'page-break', 'heading', 'paragraph'
  ], []);

  const FIELD_ICONS = useMemo(() => ({
    text: "Type",
    email: "Mail",
    textarea: "FileText",
    select: "ChevronDown",
    checkbox: "Square",
    phone: "Phone",
    radio: "Circle",
    number: "Hash",
    date: "Calendar",
    file: "Upload",
    rating: "Star",
    'page-break': "SeparatorHorizontal"
  }), []);

  // Enhanced field validation with comprehensive checks
  const validateFieldData = useCallback((data) => {
    if (!data?.type || !SUPPORTED_FIELD_TYPES.includes(data.type)) {
      return {
        isValid: false,
        error: `Unsupported field type: ${data?.type || 'undefined'}. Supported types: ${SUPPORTED_FIELD_TYPES.join(', ')}`
      };
    }

    if ((data.type === 'select' || data.type === 'radio') && 
        (!data.options || !Array.isArray(data.options) || data.options.length === 0)) {
      return {
        isValid: false,
        error: `${data.type} fields require at least one option`
      };
    }

    if (data.type === 'number' && 
        data.min !== undefined && data.max !== undefined && data.min > data.max) {
      return {
        isValid: false,
        error: 'Number field minimum value cannot be greater than maximum value'
      };
    }

    if (data.type === 'rating' && 
        data.maxRating && (data.maxRating < 1 || data.maxRating > 10)) {
      return {
        isValid: false,
        error: 'Rating field maximum rating must be between 1 and 10'
      };
    }

    return { isValid: true };
  }, [SUPPORTED_FIELD_TYPES]);

  // Enhanced field creation with better defaults
  const createFieldFromData = useCallback((data, insertIndex) => {
    const fieldType = data.type;
    const fieldId = Date.now() + Math.floor(Math.random() * 1000);
    
    const baseField = {
      Id: fieldId,
      type: fieldType,
      label: data.label || `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: data.placeholder || (fieldType === 'textarea' ? 'Enter text' : `Enter ${fieldType}`),
      required: Boolean(data.required),
      helpText: data.helpText || "",
      showCondition: data.showCondition || {
        enabled: false,
        fieldId: '',
        operator: 'equals',
        value: ''
      },
      validationRules: data.validationRules || [],
      position: insertIndex
    };

    // Type-specific properties
    if (fieldType === "select" || fieldType === "radio") {
      baseField.options = (data.options?.length > 0) ? data.options : ["Option 1", "Option 2"];
    }

    if (fieldType === "number") {
      if (data.min !== undefined) baseField.min = data.min;
      if (data.max !== undefined) baseField.max = data.max;
    }

    if (fieldType === "rating") {
      baseField.maxRating = data.maxRating || 5;
    }

    if (fieldType === "file") {
      baseField.acceptedTypes = data.acceptedTypes || ".pdf,.doc,.docx,.jpg,.png";
    }

    if (fieldType === "page-break") {
      baseField.stepTitle = data.stepTitle || "New Step";
    }

    return baseField;
  }, []);

  // Enhanced drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    
    const transferData = e.dataTransfer.getData("application/json");
    let isFromLibrary = true;
    
    try {
      const data = JSON.parse(transferData);
      isFromLibrary = !data.isReorder;
    } catch (err) {
      isFromLibrary = true;
    }
    
    e.dataTransfer.dropEffect = isFromLibrary ? 'copy' : 'move';
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    let insertIndex = fields.length;
    const fieldElements = canvas.querySelectorAll('[data-field-id]');
    
    for (let i = 0; i < fieldElements.length; i++) {
      const fieldElement = fieldElements[i];
      const fieldRect = fieldElement.getBoundingClientRect();
      const fieldY = fieldRect.top - rect.top;
      const fieldCenter = fieldY + fieldRect.height / 2;
      
      if (y < fieldCenter) {
        insertIndex = i;
        break;
      }
    }
    
    if (!isFromLibrary) {
      const draggedIndex = fields.findIndex(f => f.Id === dragState.draggedFieldId);
      if (draggedIndex !== -1 && 
          (insertIndex === draggedIndex || insertIndex === draggedIndex + 1)) {
        setDragState(prev => ({ ...prev, dragOverIndex: null }));
        return;
      }
    }
    
    setDragState(prev => ({
      ...prev,
      dragOverIndex: insertIndex,
      isDraggedOver: true,
      draggedFromLibrary: isFromLibrary
    }));
  }, [fields, dragState.draggedFieldId]);

  const handleDragLeave = useCallback((e) => {
    if (!canvasRef.current?.contains(e.relatedTarget)) {
      setDragState(prev => ({
        ...prev,
        dragOverIndex: null,
        isDraggedOver: false,
        draggedFromLibrary: false
      }));
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const finalDragOverIndex = dragState.dragOverIndex;
    
    setDragState(prev => ({
      ...prev,
      dragOverIndex: null,
      isDraggedOver: false,
      draggedFromLibrary: false
    }));

    try {
      const transferData = e.dataTransfer.getData("application/json");
      if (!transferData) {
        toast.error('No data received from drag operation');
        return;
      }
      
      let data;
      try {
        data = JSON.parse(transferData);
      } catch (err) {
        toast.error('Invalid drag data format');
        return;
      }
      
      if (!data.isReorder) {
        const validation = validateFieldData(data);
        if (!validation.isValid) {
          toast.error(validation.error);
          return;
        }
      }
      
      const insertIndex = finalDragOverIndex !== null ? finalDragOverIndex : fields.length;
      const newFields = [...fields];
      
      if (data.isReorder && data.fieldId) {
        const draggedFieldIndex = fields.findIndex(f => f.Id === data.fieldId);
        if (draggedFieldIndex === -1) {
          toast.error('Could not find field to reorder');
          return;
        }
        
        if (insertIndex === draggedFieldIndex || insertIndex === draggedFieldIndex + 1) {
          toast.info('Field is already in this position');
          return;
        }
        
        const draggedField = fields[draggedFieldIndex];
        newFields.splice(draggedFieldIndex, 1);
        
        let targetIndex = insertIndex;
        if (draggedFieldIndex < insertIndex) {
          targetIndex = insertIndex - 1;
        }
        
        newFields.splice(targetIndex, 0, draggedField);
        onFieldsChange(newFields);
        toast.success(`Field moved to position ${targetIndex + 1}`);
      } else {
        try {
          const newField = createFieldFromData(data, insertIndex);
          
          if (fields.length > 50) {
            toast.warning('Form has many fields. Consider using page breaks for better user experience.');
          }
          
          const duplicateLabel = fields.find(f => 
            f.label.toLowerCase() === newField.label.toLowerCase()
          );
          if (duplicateLabel) {
            newField.label = `${newField.label} (${fields.length + 1})`;
          }
          
          newFields.splice(insertIndex, 0, newField);
          onFieldsChange(newFields);
          
          toast.success(`${newField.label} added successfully`);
          setTimeout(() => onFieldSelect(newField.Id), 100);
        } catch (error) {
          toast.error('Failed to create field from drag data');
        }
      }
    } catch (error) {
      toast.error('Unexpected error during drop operation');
    }
  }, [dragState.dragOverIndex, fields, validateFieldData, createFieldFromData, onFieldsChange, onFieldSelect]);

  const handleFieldDragStart = useCallback((e, fieldId) => {
    const fieldIndex = fields.findIndex(f => f.Id === fieldId);
    
    setDragState(prev => ({
      ...prev,
      draggedFieldId: fieldId,
      dragStartPosition: fieldIndex
    }));
    
    const dragData = {
      isReorder: true,
      fieldId: fieldId
    };
    
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  }, [fields]);

  const handleFieldDragEnd = useCallback((e) => {
    setDragState(prev => ({
      ...prev,
      draggedFieldId: null,
      dragOverIndex: null,
      dragStartPosition: null
    }));
  }, []);

  // Field management operations
  const removeField = useCallback((fieldId) => {
    try {
      const fieldToRemove = fields.find(f => f.Id === fieldId);
      if (!fieldToRemove) {
        toast.error('Field not found for removal');
        return;
      }
      
      const newFields = fields.filter(field => field.Id !== fieldId);
      onFieldsChange(newFields);
      toast.success(`${fieldToRemove.label} removed from form`);
      
      if (selectedFieldId === fieldId) {
        onFieldSelect(null);
      }
    } catch (error) {
      toast.error('Failed to remove field. Please try again.');
    }
  }, [fields, onFieldsChange, selectedFieldId, onFieldSelect]);

  const updateField = useCallback((fieldId, updates) => {
    try {
      const fieldExists = fields.find(f => f.Id === fieldId);
      if (!fieldExists) {
        toast.error('Field not found for update');
        return;
      }
      
      if (updates.type && updates.type !== fieldExists.type) {
        const validation = validateFieldData({ ...fieldExists, ...updates });
        if (!validation.isValid) {
          toast.error(validation.error);
          return;
        }
      }
      
      onFieldsChange(fields.map(field => 
        field.Id === fieldId ? { ...field, ...updates } : field
      ));
    } catch (error) {
      toast.error('Failed to update field. Please try again.');
    }
  }, [fields, onFieldsChange, validateFieldData]);

  // Style utilities
  const getFormWidthClass = useCallback(() => {
    switch (formStyle?.formWidth) {
      case 'narrow': return 'max-w-lg';
      case 'wide': return 'max-w-4xl';
      default: return 'max-w-2xl';
    }
  }, [formStyle?.formWidth]);

  const getFontFamilyClass = useCallback(() => {
    switch (formStyle?.fontFamily) {
      case 'Plus Jakarta Sans': return 'font-display';
      case 'Georgia': return 'font-serif';
      case 'Courier New': return 'font-mono';
      default: return 'font-sans';
    }
  }, [formStyle?.fontFamily]);

  // AI form generation
  const generateFormFromPrompt = useCallback(async (prompt) => {
    try {
      const mockFields = [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Message', required: false }
      ];
      
      return mockFields.map(field => createFieldFromData(field, fields.length));
    } catch (error) {
      console.error('Error generating form from prompt:', error);
      throw error;
    }
  }, [createFieldFromData, fields.length]);

  // Click-to-add fallback
  const handleFieldClickToAdd = useCallback((fieldType) => {
    try {
      const fieldData = {
        type: fieldType,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`
      };
      
      const validation = validateFieldData(fieldData);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      const newField = createFieldFromData(fieldData, fields.length);
      onFieldsChange([...fields, newField]);
      toast.success(`${newField.label} added successfully`);
      setTimeout(() => onFieldSelect(newField.Id), 100);
    } catch (error) {
      toast.error('Failed to add field. Please try again.');
    }
  }, [validateFieldData, createFieldFromData, fields, onFieldsChange, onFieldSelect]);

  // Email validation helper
  const isValidEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  // Add email to notifications
  const addEmailToNotifications = useCallback(() => {
    const email = uiState.emailInput.trim();
    if (!email || !isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (notificationSettings.recipients.includes(email)) {
      toast.info('Email already added to recipients');
      return;
    }

    onNotificationSettingsChange({
      ...notificationSettings,
      recipients: [...notificationSettings.recipients, email]
    });
    
    setUiState(prev => ({ ...prev, emailInput: '' }));
    toast.success('Email added to notification recipients');
  }, [uiState.emailInput, isValidEmail, notificationSettings, onNotificationSettingsChange]);

  // Remove email from notifications
  const removeEmailFromNotifications = useCallback((index) => {
    const newRecipients = notificationSettings.recipients.filter((_, i) => i !== index);
    onNotificationSettingsChange({
      ...notificationSettings,
      recipients: newRecipients
    });
    toast.success('Email removed from notification recipients');
  }, [notificationSettings, onNotificationSettingsChange]);

  // Field rendering function
  const renderField = useCallback((field, index) => {
    const isSelected = selectedFieldId === field.Id;
    const isDragging = dragState.draggedFieldId === field.Id;
    const showDragIndicator = dragState.dragOverIndex === index && dragState.draggedFieldId;

    return (
      <React.Fragment key={field.Id}>
        <AnimatePresence>
          {showDragIndicator && (
            <motion.div 
              key={`drag-indicator-${index}`}
              className="h-2 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full mx-4 shadow-sm"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
</AnimatePresence>
        
        {field.type === 'page-break' ? (
          <motion.div
            data-field-id={field.Id}
            layout
            draggable
            onDragStart={(e) => handleFieldDragStart(e, field.Id)}
            onDragEnd={handleFieldDragEnd}
            className={`group relative p-4 border-2 border-dashed rounded-xl backdrop-blur-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
              isDragging 
                ? 'opacity-40 transform scale-98 border-orange-400/60 shadow-2xl cursor-grabbing bg-gradient-to-br from-orange-100/30 to-orange-200/20' 
                : isSelected 
                  ? 'border-orange-400/80 bg-gradient-to-br from-orange-100/40 to-orange-200/30 shadow-lg cursor-grab backdrop-blur-md' 
                  : 'border-orange-300/40 bg-gradient-to-br from-orange-50/20 to-orange-100/10 hover:border-orange-400/60 hover:shadow-xl cursor-grab hover:backdrop-blur-md hover:bg-gradient-to-br hover:from-orange-100/30 hover:to-orange-200/20'
            }`}
            style={{
              boxShadow: isDragging 
                ? '0 20px 40px rgba(251, 146, 60, 0.25), 0 0 60px rgba(251, 146, 60, 0.15)' 
                : isSelected 
                  ? '0 10px 30px rgba(251, 146, 60, 0.2), 0 0 40px rgba(251, 146, 60, 0.1)'
                  : '0 4px 20px rgba(251, 146, 60, 0.1)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isDragging ? 0.4 : 1, 
              y: 0,
              scale: isDragging ? 0.98 : 1
            }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => !isDragging && onFieldSelect(field.Id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onFieldSelect(field.Id);
              } else if (e.key === 'Delete') {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm('Remove this page break?')) {
                  removeField(field.Id);
                }
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Page break: ${field.stepTitle || 'Page Break'}`}
            whileHover={{ 
              scale: isDragging ? 0.98 : 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ApperIcon name="SeparatorHorizontal" size={20} className="text-orange-600" />
                <div>
                  <div className="font-medium text-orange-900">
                    {field.stepTitle || 'Page Break'}
                  </div>
                  <div className="text-sm text-orange-700">
                    Splits form into multiple steps
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Remove this page break?')) {
                      removeField(field.Id);
                    }
                  }}
                  className="p-2 text-orange-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                  title="Delete page break (Delete key)"
                  tabIndex={0}
                >
                  <ApperIcon name="X" size={16} className="text-orange-400 hover:text-red-500" />
                </button>
                <div 
                  className="cursor-move p-2 text-orange-400 hover:text-orange-600 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-lg"
                  title="Drag to reorder"
                  tabIndex={0}
                  role="button"
                  aria-label="Drag handle"
                >
                  <ApperIcon name="GripVertical" size={16} className="text-orange-400 hover:text-orange-600" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
<motion.div
            data-field-id={field.Id}
            layout
            draggable
            onDragStart={(e) => handleFieldDragStart(e, field.Id)}
            onDragEnd={handleFieldDragEnd}
            className={`group relative p-4 border rounded-xl backdrop-blur-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
              isDragging 
                ? 'opacity-40 transform scale-98 border-primary-400/60 shadow-2xl cursor-grabbing bg-gradient-to-br from-primary-100/30 to-accent-100/20' 
                : isSelected 
                  ? 'border-primary-500/80 bg-gradient-to-br from-primary-50/40 to-accent-50/30 shadow-lg cursor-grab backdrop-blur-md hover:border-primary-400/60' 
                  : 'border-gray-200/40 bg-gradient-to-br from-white/20 to-gray-50/10 hover:border-primary-300/60 hover:shadow-xl cursor-grab hover:backdrop-blur-md hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-accent-50/20'
            }`}
            style={{
              boxShadow: isDragging 
                ? '0 20px 40px rgba(139, 92, 246, 0.25), 0 0 60px rgba(0, 212, 255, 0.15)' 
                : isSelected 
                  ? '0 10px 30px rgba(139, 92, 246, 0.2), 0 0 40px rgba(0, 212, 255, 0.1)'
                  : '0 4px 20px rgba(139, 92, 246, 0.1)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isDragging ? 0.4 : 1, 
              y: 0,
              scale: isDragging ? 0.98 : 1
            }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => !isDragging && onFieldSelect(field.Id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onFieldSelect(field.Id);
              } else if (e.key === 'Delete') {
                e.preventDefault();
                e.stopPropagation();
                const fieldLabel = field.label || field.type || 'Untitled field';
                const confirmDelete = window.confirm(
                  `Are you sure you want to delete "${fieldLabel}"?\n\nThis action cannot be undone.`
                );
                if (confirmDelete) {
                  removeField(field.Id);
                }
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${field.type} field: ${field.label || 'Untitled field'}`}
            whileHover={{ 
              scale: isDragging ? 0.98 : 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out ${
              isDragging 
                ? 'opacity-100 scale-110' 
                : 'opacity-0 group-hover:opacity-100 group-hover:scale-105'
            }`}>
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-sm">
                <ApperIcon name="GripVertical" size={16} className={`transition-colors duration-200 ${
                  isDragging ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                }`} />
              </div>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3 ml-6">
                <div className="flex items-center gap-2">
                  <ApperIcon 
                    name={FIELD_ICONS[field.type] || "Type"}
                    size={16} 
                    className="text-gray-500"
                  />
                  <div 
                    className="font-medium text-gray-900 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFieldSelect(field.Id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onFieldSelect(field.Id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Edit field label"
                  >
                    {field.label || 'Click to edit label'}
                  </div>
                  <label className="flex items-center gap-1 text-sm text-gray-500">
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => updateField(field.Id, { required: e.target.checked })}
                      className="rounded focus:ring-2 focus:ring-primary-500"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={0}
                    />
                    Required
                  </label>
                </div>
                
                <div 
                  className="w-full text-sm text-gray-500 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFieldSelect(field.Id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onFieldSelect(field.Id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Edit field placeholder"
                >
                  {field.placeholder || 'Click to edit placeholder'}
                </div>
                
                {field.type === "select" && field.options && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Options:</label>
                    {field.options.map((option, optionIndex) => (
                      <div key={`${field.Id}-option-${optionIndex}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[optionIndex] = e.target.value;
                            updateField(field.Id, { options: newOptions });
                          }}
                          className="flex-1 text-sm px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                          placeholder="Option text"
                          onClick={(e) => e.stopPropagation()}
                          tabIndex={0}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newOptions = (field.options || []).filter((_, i) => i !== optionIndex);
                            updateField(field.Id, { options: newOptions });
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none rounded p-1"
                          tabIndex={0}
                          title="Remove option"
                        >
                          <ApperIcon name="X" size={16} className="text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newOptions = [...(field.options || []), ""];
                        updateField(field.Id, { options: newOptions });
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none rounded px-2 py-1"
                      tabIndex={0}
                    >
                      + Add option
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const fieldLabel = field.label || field.type || 'Untitled field';
                    const confirmDelete = window.confirm(
                      `Are you sure you want to delete "${fieldLabel}"?\n\nThis action cannot be undone.`
                    );
                    if (confirmDelete) {
                      removeField(field.Id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                  title="Delete field (Delete key)"
                  tabIndex={0}
                >
                  <ApperIcon name="X" size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
                <div 
                  className="cursor-move p-2 text-gray-400 hover:text-primary-500 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none rounded-lg"
                  title="Drag to reorder"
                  tabIndex={0}
                  role="button"
                  aria-label="Drag handle"
                >
                  <ApperIcon name="GripVertical" size={16} className="text-gray-400 hover:text-primary-500 transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </React.Fragment>
    );
  }, [selectedFieldId, dragState, onFieldSelect, handleFieldDragStart, handleFieldDragEnd, removeField, updateField, FIELD_ICONS]);

return (
    <div 
      className="flex flex-col h-full bg-gradient-to-br from-surface-50/30 to-surface-100/20 backdrop-blur-xl"
      style={{
        '--primary-color': formStyle?.primaryColor || '#8B7FFF',
        '--primary-50': (formStyle?.primaryColor || '#8B7FFF') + '0D',
        '--primary-100': (formStyle?.primaryColor || '#8B7FFF') + '1A',
        '--primary-200': (formStyle?.primaryColor || '#8B7FFF') + '33',
        '--primary-300': (formStyle?.primaryColor || '#8B7FFF') + '4D',
        '--primary-400': (formStyle?.primaryColor || '#8B7FFF') + '66',
        '--primary-500': formStyle?.primaryColor || '#8B7FFF',
        '--primary-600': (formStyle?.primaryColor || '#8B7FFF') + 'E6',
        '--primary-700': (formStyle?.primaryColor || '#8B7FFF') + 'CC'
      }}
    >
      <div className="flex-1 flex flex-col p-8">
        <div className={`${getFormWidthClass()} mx-auto w-full ${getFontFamilyClass()}`}>
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              value={formName || ''}
              onChange={(e) => onFormNameChange?.(e.target.value)}
              placeholder="Untitled Form"
              className="text-2xl font-display font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-primary-300 rounded-lg px-3 py-1 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              tabIndex={0}
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                <Button
                  onClick={onUndo}
                  disabled={!canUndo}
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500"
                  title="Undo (Ctrl+Z)"
                  tabIndex={0}
                >
                  <ApperIcon name="Undo2" size={16} className="text-gray-600" />
                  Undo
                </Button>
                <Button
                  onClick={onRedo}
                  disabled={!canRedo}
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500"
                  title="Redo (Ctrl+Y)"
                  tabIndex={0}
                >
                  <ApperIcon name="Redo2" className="w-4 h-4" />
                  Redo
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onLivePreviewToggle}
                  variant="secondary"
                  className="flex items-center gap-2 focus:ring-2 focus:ring-primary-500"
                  title="Open live preview in modal (Press P)"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'p' || e.key === 'P') {
                      e.preventDefault();
                      onLivePreviewToggle?.();
                    }
                  }}
                >
                  <ApperIcon name="Eye" size={16} className="text-gray-600" />
                  Live Preview
                </Button>
                
                <div className="h-6 w-px bg-gray-200" />
                
                <Button 
                  onClick={onSave} 
                  className="inline-flex items-center gap-2 focus:ring-2 focus:ring-primary-500" 
                  title="Save Form (Ctrl+S)"
                  tabIndex={0}
                >
                  <ApperIcon name="Save" size={16} className="text-gray-600" />
                  Save Form
                </Button>
                
                {currentForm && (
                  <>
                    {currentForm.isPublished ? (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={onShowPublishModal}
                          variant="secondary"
                          className="inline-flex items-center gap-2 focus:ring-2 focus:ring-primary-500"
                          tabIndex={0}
                        >
                          <ApperIcon name="Globe" size={16} className="text-white" />
                          View Link
                        </Button>
                        <Button
                          onClick={onUnpublish}
                          variant="secondary"
                          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 focus:ring-2 focus:ring-orange-500"
                          tabIndex={0}
                        >
                          <ApperIcon name="EyeOff" size={16} className="text-white" />
                          Unpublish
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={onPublish}
                        variant="secondary"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 focus:ring-2 focus:ring-green-500"
                        tabIndex={0}
                      >
                        <ApperIcon name="Globe" className="w-4 h-4" />
                        Publish Form
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Form builder tabs">
              {[
                { id: 'design', icon: 'Layout', label: 'Design' },
                { id: 'style', icon: 'Palette', label: 'Style' },
                { id: 'notifications', icon: 'Mail', label: 'Notifications' },
                { id: 'thankyou', icon: 'Heart', label: 'Thank You' },
                { id: 'ai', icon: 'Bot', label: 'Ask AI' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUiState(prev => ({ ...prev, activeTab: tab.id }))}
                  className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    uiState.activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  role="tab"
                  aria-selected={uiState.activeTab === tab.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setUiState(prev => ({ ...prev, activeTab: tab.id }));
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <ApperIcon name={tab.icon} size={14} className="text-gray-600" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {uiState.activeTab === 'style' ? (
// Style Tab Content
<div className="bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-8 shadow-2xl texture-glass bg-pattern-dots" style={{boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1), 0 0 60px rgba(0, 212, 255, 0.05)'}}>
              <div className="text-center">
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Form Styling</h3>
                <p className="text-gray-600">Customize the appearance of your form</p>
              </div>

              {/* Primary Color */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    '#8B7FFF', '#3B82F6', '#10B981', '#F59E0B',
                    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16',
                    '#F97316', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
key={color}
                      onClick={() => onStyleChange?.({ ...formStyle, primaryColor: color })}
                      className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-primary-500/50 focus:outline-none backdrop-blur-sm transform ${
                        formStyle?.primaryColor === color
                          ? 'border-white/60 scale-110 shadow-2xl ring-4 ring-white/30'
                          : 'border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-xl'
                      }`}
                      style={{ 
                        backgroundColor: color,
                        boxShadow: formStyle?.primaryColor === color 
                          ? `0 10px 30px ${color}40, 0 0 40px ${color}20`
                          : `0 4px 20px ${color}20`
                      }}
                      title={color}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStyleChange?.({ ...formStyle, primaryColor: color });
                        }
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Custom:</span>
                  <input
                    type="color"
                    value={formStyle?.primaryColor || '#8B7FFF'}
                    onChange={(e) => onStyleChange?.({ ...formStyle, primaryColor: e.target.value })}
                    className="w-12 h-8 border border-gray-200 rounded cursor-pointer focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    tabIndex={0}
                  />
                  <span className="text-sm font-mono text-gray-500">{formStyle?.primaryColor || '#8B7FFF'}</span>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Font Family</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'Inter', label: 'Inter (Default)', preview: 'The quick brown fox' },
                    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', preview: 'The quick brown fox' },
                    { value: 'Georgia', label: 'Georgia', preview: 'The quick brown fox' },
                    { value: 'Courier New', label: 'Courier New', preview: 'The quick brown fox' }
                  ].map((font) => (
<button
                      key={font.value}
                      onClick={() => onStyleChange?.({ ...formStyle, fontFamily: font.value })}
                      className={`p-4 text-left border rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.fontFamily === font.value
                          ? 'border-2 border-primary-500/80 bg-gradient-to-br from-primary-50/60 to-accent-50/40 shadow-lg scale-[1.02] texture-glass'
                          : 'border-white/30 bg-gradient-to-br from-white/20 to-gray-50/10 hover:border-primary-300/60 hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-accent-50/20 hover:shadow-xl hover:scale-[1.01]'
                      }`}
                      style={{
                        boxShadow: formStyle?.fontFamily === font.value 
                          ? '0 10px 30px rgba(139, 92, 246, 0.2), 0 0 40px rgba(0, 212, 255, 0.1)'
                          : '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStyleChange?.({ ...formStyle, fontFamily: font.value });
                        }
                      }}
                    >
                      <div className={`font-medium text-gray-900 mb-1 ${
                        font.value === 'Plus Jakarta Sans' ? 'font-display' :
                        font.value === 'Georgia' ? 'font-serif' :
                        font.value === 'Courier New' ? 'font-mono' : 'font-sans'
                      }`}>
                        {font.label}
                      </div>
                      <div className={`text-sm text-gray-500 ${
                        font.value === 'Plus Jakarta Sans' ? 'font-display' :
                        font.value === 'Georgia' ? 'font-serif' :
                        font.value === 'Courier New' ? 'font-mono' : 'font-sans'
                      }`}>
                        {font.preview}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Width */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Form Width</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'narrow', label: 'Narrow', description: '512px max width' },
                    { value: 'medium', label: 'Medium', description: '672px max width' },
                    { value: 'wide', label: 'Wide', description: '896px max width' }
                  ].map((width) => (
                    <button
key={width.value}
onClick={() => onStyleChange?.({ ...formStyle, formWidth: width.value })}
                      className={`p-4 text-center border rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.formWidth === width.value
                          ? 'border-2 border-primary-500/80 bg-gradient-to-br from-primary-50/60 to-accent-50/40 shadow-lg scale-[1.02] texture-glass animate-glow-pulse'
                          : 'border-white/30 bg-gradient-to-br from-white/20 to-gray-50/10 hover:border-primary-300/60 hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-accent-50/20 hover:shadow-xl hover:scale-[1.01]'
                      }`}
                      style={{
                        boxShadow: formStyle?.formWidth === width.value 
                          ? '0 10px 30px rgba(139, 92, 246, 0.2), 0 0 40px rgba(0, 212, 255, 0.1)'
                          : '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStyleChange?.({ ...formStyle, formWidth: width.value });
                        }
                      }}
                    >
                      <div className="font-medium text-gray-900 mb-1">{width.label}</div>
                      <div className="text-sm text-gray-500">{width.description}</div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full bg-primary-500 rounded-full ${
                            width.value === 'narrow' ? 'w-1/2' :
                            width.value === 'medium' ? 'w-3/4' : 'w-full'
                          }`} 
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-3">Preview</div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div 
                    className={`mx-auto p-4 bg-white rounded-lg shadow-sm ${getFontFamilyClass()}`}
                    style={{ 
                      borderColor: formStyle?.primaryColor || '#8B7FFF',
                      maxWidth: formStyle?.formWidth === 'narrow' ? '320px' : 
                               formStyle?.formWidth === 'wide' ? '480px' : '400px'
                    }}
                  >
                    <h4 className="font-bold text-gray-900 mb-3">Sample Form</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          style={{ borderColor: (formStyle?.primaryColor || '#8B7FFF') + '40' }}
                          placeholder="Enter your name"
                        />
                      </div>
                      <button 
                        className="px-4 py-2 text-white rounded-md font-medium"
                        style={{ backgroundColor: formStyle?.primaryColor || '#8B7FFF' }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : uiState.activeTab === 'thankyou' ? (
// Thank You Page Tab Content
            <div className="bg-white rounded-xl shadow-card p-8 space-y-8">
              <div className="text-center">
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">Thank You Page</h3>
                <p className="text-gray-600">Customize what users see after submitting your form</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustomThankYou"
                    checked={thankYouSettings?.useCustom || false}
                    onChange={(e) => onThankYouSettingsChange?.({
                      ...thankYouSettings,
                      useCustom: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                    tabIndex={0}
                  />
                  <label htmlFor="useCustomThankYou" className="text-sm text-gray-700 cursor-pointer">
                    Customize thank you page
                  </label>
                </div>

                {thankYouSettings?.useCustom && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thank You Message
                      </label>
                      <textarea
                        value={thankYouSettings?.message || "Thank you for your submission!"}
                        onChange={(e) => onThankYouSettingsChange?.({
                          ...thankYouSettings,
                          message: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter your custom thank you message"
                        tabIndex={0}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Redirect URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={thankYouSettings?.redirectUrl || ""}
                        onChange={(e) => onThankYouSettingsChange?.({
                          ...thankYouSettings,
                          redirectUrl: e.target.value
                        })}
                        placeholder="https://example.com/success"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        tabIndex={0}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showCreateFormButton"
                        checked={thankYouSettings?.showCreateFormButton !== false}
                        onChange={(e) => onThankYouSettingsChange?.({
                          ...thankYouSettings,
                          showCreateFormButton: e.target.checked
                        })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                        tabIndex={0}
                      />
                      <label htmlFor="showCreateFormButton" className="text-sm text-gray-700 cursor-pointer">
                        Show "Create Your Own Form" button
                      </label>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="CheckCircle" size={24} className="text-success" />
                    </div>
                    <h4 className="text-lg font-display font-bold text-gray-900 mb-2">
                      Thank you!
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {thankYouSettings?.useCustom 
                        ? (thankYouSettings.message || "Thank you for your submission!")
                        : "Your form has been submitted successfully."
                      }
                    </p>
                    
                    {(!thankYouSettings?.useCustom || thankYouSettings?.showCreateFormButton !== false) && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm">
                        Create Your Own Form
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : uiState.activeTab === 'notifications' ? (
// Notifications Tab Content
            <div className="bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6 shadow-2xl texture-glass bg-pattern-circuit" style={{boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1), 0 0 60px rgba(0, 212, 255, 0.05)'}}>
              {/* Background Pattern Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Background Pattern
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'None', value: '', preview: 'bg-gray-100' },
                    { name: 'Dots', value: 'dots', preview: 'bg-pattern-dots bg-gray-100' },
                    { name: 'Grid', value: 'grid', preview: 'bg-pattern-grid bg-gray-100' },
                    { name: 'Circuit', value: 'circuit', preview: 'bg-pattern-circuit bg-gray-100' },
                    { name: 'Hexagon', value: 'hexagon', preview: 'bg-pattern-hexagon bg-gray-100' },
                    { name: 'Diagonal', value: 'diagonal', preview: 'bg-pattern-diagonal bg-gray-100' }
                  ].map(pattern => (
                    <button
                      key={pattern.value}
                      onClick={() => onStyleChange?.({ ...formStyle, backgroundPattern: pattern.value })}
                      className={`p-4 text-center border rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.backgroundPattern === pattern.value
                          ? 'border-2 border-primary-500/80 bg-gradient-to-br from-primary-50/60 to-accent-50/40 shadow-lg scale-[1.02] texture-glass'
                          : 'border-white/30 bg-gradient-to-br from-white/20 to-gray-50/10 hover:border-primary-300/60 hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-accent-50/20 hover:shadow-xl hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg ${pattern.preview} mb-2 border border-gray-200`}></div>
                      <span className="text-sm font-medium text-gray-700">{pattern.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Texture Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Background Texture
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'None', value: '', preview: 'bg-gray-100' },
                    { name: 'Paper', value: 'paper', preview: 'texture-paper bg-gray-100' },
                    { name: 'Fabric', value: 'fabric', preview: 'texture-fabric bg-gray-100' },
                    { name: 'Glass', value: 'glass', preview: 'texture-glass bg-gray-100' },
                    { name: 'Noise', value: 'noise', preview: 'texture-noise bg-gray-100' }
                  ].map(texture => (
                    <button
                      key={texture.value}
                      onClick={() => onStyleChange?.({ ...formStyle, backgroundTexture: texture.value })}
                      className={`p-4 text-center border rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.backgroundTexture === texture.value
                          ? 'border-2 border-primary-500/80 bg-gradient-to-br from-primary-50/60 to-accent-50/40 shadow-lg scale-[1.02] texture-glass animate-glow-pulse'
                          : 'border-white/30 bg-gradient-to-br from-white/20 to-gray-50/10 hover:border-primary-300/60 hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-accent-50/20 hover:shadow-xl hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg ${texture.preview} mb-2 border border-gray-200 relative overflow-hidden`}>
                        {texture.value === 'glass' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{texture.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Assistant Elements */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  AI Assistant Elements
                </label>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50/20 to-accent-50/20 rounded-xl border border-primary-200/30">
                  <div className="flex items-center space-x-4">
                    <div className="ai-orb"></div>
                    <div>
                      <p className="font-medium text-gray-900">Smart Form Assistant</p>
                      <p className="text-sm text-gray-600">Floating AI helper with contextual suggestions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStyleChange?.({ ...formStyle, showAiAssistant: !formStyle?.showAiAssistant })}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 micro-bounce ${
                      formStyle?.showAiAssistant
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {formStyle?.showAiAssistant ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600 mt-1">Get notified when someone submits this form</p>
                </div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings?.enabled || false}
                    onChange={(e) => onNotificationSettingsChange?.({
                      ...notificationSettings,
                      enabled: e.target.checked
                    })}
                    className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    tabIndex={0}
                  />
                  <span className="text-sm font-medium text-gray-700">Enable notifications</span>
                </label>
              </div>

              {notificationSettings?.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email Addresses
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={uiState.emailInput}
                        onChange={(e) => setUiState(prev => ({ ...prev, emailInput: e.target.value }))}
                        placeholder="Enter email address"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addEmailToNotifications();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addEmailToNotifications}
                        variant="secondary"
                        size="sm"
                        tabIndex={0}
                      >
                        <ApperIcon name="Plus" size={16} className="text-white" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add an email address</p>
                  </div>

                  {notificationSettings?.recipients?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Recipients ({notificationSettings.recipients.length})
                      </label>
                      <div className="space-y-2">
                        {notificationSettings.recipients.map((email, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <ApperIcon name="Mail" size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-700">{email}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEmailFromNotifications(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none rounded"
                              title={`Remove ${email}`}
                              tabIndex={0}
                            >
                              <ApperIcon name="X" size={16} className="text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">How it works</p>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Email notifications will be sent whenever someone submits this form</li>
                          <li>• All specified recipients will receive the notification</li>
                          <li>• Notifications include form submission details and timestamp</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
) : uiState.activeTab === 'ai' ? (
            <>
              {/* AI Form Generation Tab Content - Enhanced Visual */}
              <div className="bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-8 shadow-2xl texture-glass bg-pattern-hexagon animate-morph-pattern">
                {/* AI Assistant Orb */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="ai-orb"></div>
                    {/* Floating particles */}
                    <div className="ai-particle" style={{ top: '10px', left: '20px', animationDelay: '0s' }}></div>
                    <div className="ai-particle" style={{ top: '30px', right: '15px', animationDelay: '1s' }}></div>
                    <div className="ai-particle" style={{ bottom: '20px', left: '10px', animationDelay: '2s' }}></div>
                    {/* Neural links */}
                    <div className="ai-neural-link" style={{ top: '-30px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="ai-neural-link" style={{ bottom: '-30px', left: '50%', transform: 'translateX(-50%) rotate(180deg)' }}></div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Form Generator</h3>
                  <p className="text-gray-600">Let our AI assistant help you create the perfect form</p>
                </div>
                
                {/* Enhanced AI Generation Content */}
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Smart Suggestions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 animate-float">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-glow-pulse"></div>
                        <span className="text-sm text-gray-600">Optimize field order for better completion rates</span>
                      </div>
                      <div className="flex items-center space-x-3 animate-float-reverse">
                        <div className="w-2 h-2 rounded-full bg-accent-500 animate-glow-pulse"></div>
                        <span className="text-sm text-gray-600">Suggest conditional logic for dynamic forms</span>
                      </div>
                      <div className="flex items-center space-x-3 animate-float">
                        <div className="w-2 h-2 rounded-full bg-cyber-500 animate-glow-pulse"></div>
                        <span className="text-sm text-gray-600">Recommend validation rules and help text</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Form Builder Interface */}
              <div className="bg-white rounded-xl shadow-card p-8 space-y-8">
                <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Bot" size={32} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">AI Form Builder</h3>
                <p className="text-gray-600">Describe the form you want and I'll create it for you</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your form
                  </label>
                  <textarea
                    value={uiState.aiPrompt}
                    onChange={(e) => setUiState(prev => ({ ...prev, aiPrompt: e.target.value }))}
                    placeholder="Example: Create a contact form with name, email, phone number, company, message, and a dropdown for inquiry type with options: Sales, Support, Partnership, Other"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    rows={4}
                    disabled={uiState.isGeneratingForm}
                    tabIndex={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be specific about field types, labels, and options for better results
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={async () => {
                      if (!uiState.aiPrompt.trim()) {
                        toast.error('Please describe the form you want to create');
                        return;
                      }
                      
                      setUiState(prev => ({ ...prev, isGeneratingForm: true }));
                      
                      try {
                        const generatedFields = await generateFormFromPrompt(uiState.aiPrompt);
                        
                        if (generatedFields && generatedFields.length > 0) {
                          onFieldsChange([...fields, ...generatedFields]);
                          toast.success(`Generated ${generatedFields.length} fields from your description`);
                          setUiState(prev => ({ ...prev, aiPrompt: '', activeTab: 'design' }));
                        } else {
                          toast.warning('Could not generate fields from the description. Please try being more specific.');
                        }
                      } catch (error) {
                        console.error('Error generating form from AI:', error);
                        toast.error('Failed to generate form. Please try again.');
                      } finally {
                        setUiState(prev => ({ ...prev, isGeneratingForm: false }));
                      }
                    }}
                    disabled={uiState.isGeneratingForm || !uiState.aiPrompt.trim()}
                    className="flex-1 focus:ring-2 focus:ring-primary-500"
                    tabIndex={0}
                  >
                    {uiState.isGeneratingForm ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Wand2" className="w-4 h-4" />
                        Generate Form
                      </div>
                    )}
                  </Button>
                  
                  {fields.length > 0 && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (window.confirm('This will replace all existing fields. Are you sure?')) {
                          onFieldsChange([]);
                          toast.info('Form cleared. Describe your new form above.');
                        }
                      }}
                      disabled={uiState.isGeneratingForm}
                    >
                      Clear Form
                    </Button>
                  )}
                </div>

                {/* Example prompts */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <ApperIcon name="Lightbulb" size={16} className="text-amber-600" />
                    Example prompts to get you started
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Create a job application form with personal info, experience, skills, and file upload for resume",
                      "Make a customer feedback survey with rating questions and comment boxes",
                      "Build an event registration form with attendee details, dietary preferences, and payment info",
                      "Design a product order form with quantity, size options, delivery address, and special instructions"
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setUiState(prev => ({ ...prev, aiPrompt: example }))}
                        disabled={uiState.isGeneratingForm}
                        className="text-left w-full text-sm text-gray-700 hover:text-primary-600 hover:bg-white p-2 rounded transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setUiState(prev => ({ ...prev, aiPrompt: example }));
                          }
                        }}
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">Tips for better results</p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Specify field types (text, email, phone, dropdown, checkbox, etc.)</li>
                        <li>• Include specific labels and placeholder text you want</li>
                        <li>• For dropdowns, list the exact options you need</li>
                        <li>• Mention if fields should be required or optional</li>
                        <li>• Describe the form's purpose (contact, survey, registration, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
) : (
            <>
              {/* Design Tab Content (Form Canvas) */}
              <div
                ref={canvasRef}
                className={`bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl rounded-2xl border border-white/20 p-8 min-h-[500px] flex-1 transition-all duration-500 ease-out relative texture-glass ${
                  formStyle?.backgroundPattern ? `bg-pattern-${formStyle.backgroundPattern}` : ''
                } ${
                  formStyle?.backgroundTexture ? `texture-${formStyle.backgroundTexture}` : ''
                } ${
                  dragState.isDraggedOver && dragState.draggedFromLibrary 
                    ? "bg-gradient-to-br from-primary-100/40 via-primary-50/30 to-accent-100/20 border-2 border-primary-500/80 border-dashed shadow-2xl ring-4 ring-primary-200/30 animate-pulse backdrop-blur-lg animate-glow-pulse" 
                    : dragState.isDraggedOver 
                      ? "bg-gradient-to-br from-indigo-100/30 to-indigo-50/20 border-2 border-indigo-400/60 border-dashed shadow-xl ring-2 ring-indigo-200/30 backdrop-blur-lg" 
                      : dragState.draggedFieldId 
                        ? "bg-gradient-to-br from-slate-100/30 to-slate-50/20 shadow-lg backdrop-blur-lg" 
                        : "hover:shadow-2xl hover:border-white/40 backdrop-blur-xl"
                } ${
                  dragState.dragOverIndex !== null 
                    ? "shadow-2xl transform scale-[1.01]" 
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
                role="region"
                aria-label="Form canvas - drop fields here"
              >
                {fields.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ApperIcon name="MousePointer2" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Drop form fields here</p>
                      <p className="mb-6">Drag fields from the library to start building your form</p>
                      
                      {/* Fallback field addition methods */}
                      <div className="bg-gray-50 rounded-lg p-4 mt-6 max-w-md mx-auto">
                        <p className="text-sm font-medium text-gray-600 mb-3">
                          Drag and drop not working? Try these alternatives:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFieldClickToAdd('text')}
                            className="text-xs focus:ring-2 focus:ring-primary-500"
                            tabIndex={0}
                          >
                            <ApperIcon name="Type" size={14} className="mr-1 text-blue-600" />
                            Add Text
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFieldClickToAdd('email')}
                            className="text-xs focus:ring-2 focus:ring-primary-500"
                            tabIndex={0}
                          >
                            <ApperIcon name="Mail" size={14} className="mr-1 text-green-600" />
                            Add Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFieldClickToAdd('select')}
                            className="text-xs focus:ring-2 focus:ring-primary-500"
                            tabIndex={0}
                          >
                            <ApperIcon name="ChevronDown" size={14} className="mr-1 text-purple-600" />
                            Add Select
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Double-click on library fields also works as a backup method
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {formSteps.length > 1 ? (
                      // Multi-step form preview
                      <div className="space-y-6">
                        {/* Step Navigation */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">
                              Step {currentStep} of {formSteps.length}
                            </span>
                            <div className="flex space-x-1">
                              {formSteps.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => onStepChange?.(index + 1)}
                                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                                    currentStep === index + 1
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                  tabIndex={0}
                                  aria-label={`Go to step ${index + 1}`}
                                >
                                  {index + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 transition-all duration-300"
                              style={{ width: `${(currentStep / formSteps.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Current Step Fields */}
                        <div className="space-y-4">
                          <div className="text-center py-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Step {currentStep}: Form Fields
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formSteps[currentStep - 1]?.length || 0} fields in this step
                            </p>
                          </div>

                          <AnimatePresence>
                            {formSteps[currentStep - 1]?.map((field, index) => 
                              renderField(field, index)
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {fields.map((field, index) => renderField(field, index))}
                        </AnimatePresence>
                        {dragState.dragOverIndex === fields.length && dragState.draggedFieldId && (
                          <motion.div 
                            className="h-2 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full mx-4 shadow-sm"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilderCanvas;