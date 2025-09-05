import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { formService } from "@/services/api/formService";
import ApperIcon from "@/components/ApperIcon";
import Layout from "@/components/organisms/Layout";
import Sidebar from "@/components/organisms/Sidebar";
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
// Optimized drag state management for better stability
const [dragState, setDragState] = useState({
    dragOverIndex: null,
    draggedFieldId: null,
    isDraggedOver: false,
    draggedFromLibrary: false,
    dragStartPosition: null,
    isProcessing: false,
    dragPreviewElement: null,
    dragIntensity: 0
  });
  
  const [uiState, setUiState] = useState({
    activeTab: 'design',
    emailInput: '',
    aiPrompt: '',
    isGeneratingForm: false
  });
const canvasRef = useRef(null);

  // Hamburger Menu Component
const HamburgerMenu = ({ 
    onUndo, onRedo, onLivePreviewToggle, onSave, onShowPublishModal, 
    onUnpublish, onPublish, canUndo, canRedo, currentForm, formStyle, onStyleChange 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLivePreviewActive, setIsLivePreviewActive] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }, [isOpen]);

const handleMenuAction = async (action, actionType = 'default') => {
      if (actionType === 'save') {
        setIsSaving(true);
        try {
          await action();
        } catch (error) {
          console.error('Save action failed:', error);
        } finally {
          setIsSaving(false);
        }
      } else if (actionType === 'livePreview') {
        setIsLivePreviewActive(!isLivePreviewActive);
        action();
      } else if (actionType === 'layoutChange') {
        // Layout changes should keep menu open for continued adjustments
        action();
        return; // Don't close menu
      } else {
        action();
      }
      setIsOpen(false);
    };

return (
      <div className="relative" ref={menuRef}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="menu"
          size="sm"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary-500"
          title="More actions (Alt+M to toggle menu)"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={isOpen ? 'Close actions menu' : 'Open actions menu'}
        >
          <ApperIcon name="Menu" size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Actions</span>
        </Button>

{/* Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 backdrop-blur-sm"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="hamburger-button"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
{/* Form Actions Group */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ApperIcon name="FileText" size={12} className="text-gray-400" />
                Form Actions
              </div>
<button
                onClick={() => handleMenuAction(onSave, 'save')}
                disabled={isSaving}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                role="menuitem"
                tabIndex={0}
                aria-label="Save form with Ctrl+S shortcut"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ApperIcon name="Save" size={16} className="text-blue-600" />
                )}
                <span className="flex-1 text-left">
                  {isSaving ? 'Saving...' : 'Save Form'}
                </span>
                {!isSaving && <span className="text-xs text-gray-400 font-mono">Ctrl+S</span>}
              </button>

<button
                onClick={() => handleMenuAction(onLivePreviewToggle, 'livePreview')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                role="menuitem"
                tabIndex={0}
                aria-label="Toggle live preview with P shortcut"
                aria-pressed={isLivePreviewActive}
              >
                <ApperIcon name="Eye" size={16} className={isLivePreviewActive ? "text-green-600" : "text-gray-500"} />
                <span className="flex-1 text-left">Live Preview</span>
                <div className="flex items-center gap-2">
                  {isLivePreviewActive && (
                    <ApperIcon name="Check" size={14} className="text-green-600" />
                  )}
                  <span className="text-xs text-gray-400 font-mono">P</span>
                </div>
              </button>

              {currentForm?.isPublished && (
<button
                  onClick={() => handleMenuAction(onShowPublishModal)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  role="menuitem"
                  tabIndex={0}
                  aria-label="View published form link"
                >
                  <ApperIcon name="Globe" size={16} className="text-blue-600" />
                  <span className="flex-1 text-left">View Link</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Published"></span>
                  </div>
                </button>
              )}
            </div>

{/* Edit Actions Group */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ApperIcon name="Edit3" size={12} className="text-gray-400" />
                Edit Actions
              </div>
<button
                onClick={() => handleMenuAction(onUndo)}
                disabled={!canUndo}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{
                  color: canUndo ? '#374151' : '#9CA3AF',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (canUndo) e.target.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                role="menuitem"
                tabIndex={0}
                aria-label={canUndo ? "Undo last action with Ctrl+Z shortcut" : "Undo not available"}
                aria-disabled={!canUndo}
              >
                <ApperIcon name="Undo2" size={16} className={canUndo ? "text-gray-600" : "text-gray-400"} />
                <span className="flex-1 text-left">Undo</span>
                <span className={`text-xs font-mono ${canUndo ? 'text-gray-400' : 'text-gray-300'}`}>Ctrl+Z</span>
              </button>

<button
                onClick={() => handleMenuAction(onRedo)}
                disabled={!canRedo}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{
                  color: canRedo ? '#374151' : '#9CA3AF',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (canRedo) e.target.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                role="menuitem"
                tabIndex={0}
                aria-label={canRedo ? "Redo last undone action with Ctrl+Y shortcut" : "Redo not available"}
                aria-disabled={!canRedo}
              >
                <ApperIcon name="Redo2" size={16} className={canRedo ? "text-gray-600" : "text-gray-400"} />
                <span className="flex-1 text-left">Redo</span>
                <span className={`text-xs font-mono ${canRedo ? 'text-gray-400' : 'text-gray-300'}`}>Ctrl+Y</span>
              </button>
</div>

            {/* Form Layout Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ApperIcon name="Layout" size={12} className="text-gray-400" />
                Form Layout
              </div>
              
              {/* Grid Columns */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Grid Columns
                </label>
<select
                  value={formStyle?.gridColumns || '1'}
                  onChange={(e) => handleMenuAction(() => onStyleChange?.({ ...formStyle, gridColumns: e.target.value }), 'layoutChange')}
                  className="layout-dropdown w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="1">Single Column</option>
                  <option value="2">Two Columns</option>
                  <option value="3">Three Columns</option>
                  <option value="4">Four Columns</option>
                  <option value="auto">Auto-Responsive</option>
                </select>
              </div>
              
              {/* Column Gap */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Column Gap
                </label>
<select
                  value={formStyle?.columnGap || 'normal'}
                  onChange={(e) => handleMenuAction(() => onStyleChange?.({ ...formStyle, columnGap: e.target.value }), 'layoutChange')}
                  className="layout-dropdown w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="tight">Tight</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="loose">Loose</option>
                </select>
              </div>
              
              {/* Layout Presets */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Layout Presets
                </label>
                <div className="layout-presets grid grid-cols-2 gap-2">
<button
                    type="button"
                    onClick={() => handleMenuAction(() => onStyleChange?.({ 
                      ...formStyle, 
                      gridColumns: '2', 
                      columnGap: 'normal',
                      gridTemplate: 'equal' 
                    }), 'layoutChange')}
                    className={`preset-button px-2 py-1.5 text-xs rounded-md border transition-colors text-center ${
                      formStyle?.gridTemplate === 'equal' 
                        ? 'preset-button active bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Equal Columns
                  </button>
<button
                    type="button"
                    onClick={() => handleMenuAction(() => onStyleChange?.({ 
                      ...formStyle, 
                      gridColumns: '2', 
                      columnGap: 'normal',
                      gridTemplate: 'sidebar' 
                    }), 'layoutChange')}
                    className={`preset-button px-2 py-1.5 text-xs rounded-md border transition-colors text-center ${
                      formStyle?.gridTemplate === 'sidebar' 
                        ? 'preset-button active bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Main + Sidebar
                  </button>
<button
                    type="button"
                    onClick={() => handleMenuAction(() => onStyleChange?.({ 
                      ...formStyle, 
                      gridColumns: '3', 
                      columnGap: 'normal',
                      gridTemplate: 'thirds' 
                    }), 'layoutChange')}
                    className={`preset-button px-2 py-1.5 text-xs rounded-md border transition-colors text-center ${
                      formStyle?.gridTemplate === 'thirds' 
                        ? 'preset-button active bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Three Equal
                  </button>
<button
                    type="button"
                    onClick={() => handleMenuAction(() => onStyleChange?.({ 
                      ...formStyle, 
                      gridColumns: 'auto', 
                      columnGap: 'normal',
                      gridTemplate: 'responsive' 
                    }), 'layoutChange')}
                    className={`preset-button px-2 py-1.5 text-xs rounded-md border transition-colors text-center ${
                      formStyle?.gridTemplate === 'responsive' 
                        ? 'preset-button active bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Auto-Responsive
                  </button>
                </div>
              </div>
              
              {/* Responsive Behavior */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Responsive Behavior
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
<input
                      type="checkbox"
                      id="menuStackOnMobile"
                      checked={formStyle?.stackOnMobile !== false}
                      onChange={(e) => handleMenuAction(() => onStyleChange?.({ ...formStyle, stackOnMobile: e.target.checked }), 'layoutChange')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="menuStackOnMobile" className="text-xs text-gray-600">
                      Stack on mobile devices
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
<input
                      type="checkbox"
                      id="menuShowGridGuides"
                      checked={formStyle?.showGridGuides || false}
                      onChange={(e) => handleMenuAction(() => onStyleChange?.({ ...formStyle, showGridGuides: e.target.checked }), 'layoutChange')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="menuShowGridGuides" className="text-xs text-gray-600">
                      Show grid guides (preview only)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Actions Group */}
            {currentForm && (
              <div className="px-4 py-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ApperIcon name="Settings" size={12} className="text-gray-400" />
                  Status Actions
                </div>
                {currentForm.isPublished ? (
                  <button
                    onClick={() => handleMenuAction(onUnpublish)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    role="menuitem"
                    tabIndex={0}
                    aria-label="Unpublish form to make it private"
                  >
                    <ApperIcon name="EyeOff" size={16} className="text-orange-600" />
                    <span className="flex-1 text-left">Unpublish</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full" title="Currently published"></span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => handleMenuAction(onPublish)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    role="menuitem"
                    tabIndex={0}
                    aria-label="Publish form to make it publicly accessible"
                  >
                    <ApperIcon name="Globe" size={16} className="text-green-600" />
                    <span className="flex-1 text-left">Publish Form</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full" title="Not published"></span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  // Memoized constants
const SUPPORTED_FIELD_TYPES = useMemo(() => [
    'text', 'email', 'number', 'textarea', 'select', 'radio', 
    'checkbox', 'date', 'time', 'datetime-local', 'url', 'tel', 'phone', 'password', 
    'file', 'rating', 'slider', 'range', 'currency', 'color', 'week', 'month',
    'page-break', 'heading', 'paragraph', 'divider', 'image', 'html'
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
    time: "Clock",
    'datetime-local': "CalendarClock",
    url: "Link",
    tel: "Phone",
    password: "Lock",
    file: "Upload",
    rating: "Star",
    slider: "Sliders",
    range: "Sliders",
    currency: "DollarSign",
    color: "Palette",
    week: "Calendar",
    month: "Calendar",
    'page-break': "SeparatorHorizontal",
    heading: "Heading",
    paragraph: "AlignLeft",
    divider: "Minus",
    image: "Image",
    html: "Code"
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

    if (fieldType === "number" || fieldType === "range" || fieldType === "slider") {
      if (data.min !== undefined) baseField.min = data.min;
      if (data.max !== undefined) baseField.max = data.max;
      if (fieldType === "slider" || fieldType === "range") {
        baseField.step = data.step || 1;
        baseField.defaultValue = data.defaultValue || data.min || 0;
      }
    }

    if (fieldType === "currency") {
      baseField.currencySymbol = data.currencySymbol || "$";
      baseField.currencyCode = data.currencyCode || "USD";
      baseField.min = data.min || 0;
      if (data.max !== undefined) baseField.max = data.max;
    }

    if (fieldType === "rating") {
      baseField.maxRating = data.maxRating || 5;
      baseField.ratingStyle = data.ratingStyle || "stars"; // stars, numbers, hearts
    }

    if (fieldType === "file") {
      baseField.acceptedTypes = data.acceptedTypes || ".pdf,.doc,.docx,.jpg,.png";
      baseField.maxFileSize = data.maxFileSize || 10; // MB
      baseField.allowMultiple = data.allowMultiple || false;
    }

    if (fieldType === "page-break") {
      baseField.stepTitle = data.stepTitle || "New Step";
      baseField.stepDescription = data.stepDescription || "";
    }

    if (fieldType === "heading") {
      baseField.headingLevel = data.headingLevel || "h2"; // h1, h2, h3, h4, h5, h6
      baseField.headingText = data.headingText || "Heading Text";
      baseField.textAlign = data.textAlign || "left"; // left, center, right
    }

    if (fieldType === "paragraph") {
      baseField.paragraphText = data.paragraphText || "Enter your paragraph text here.";
      baseField.textAlign = data.textAlign || "left";
    }

    if (fieldType === "divider") {
      baseField.dividerStyle = data.dividerStyle || "solid"; // solid, dashed, dotted
      baseField.dividerColor = data.dividerColor || "#e5e7eb";
    }

    if (fieldType === "image") {
      baseField.imageUrl = data.imageUrl || "";
      baseField.altText = data.altText || "";
      baseField.imageWidth = data.imageWidth || "auto";
      baseField.imageHeight = data.imageHeight || "auto";
    }

    if (fieldType === "html") {
      baseField.htmlContent = data.htmlContent || "<p>Enter your HTML content here</p>";
    }

// Enhanced Layout properties for multi-column support
    baseField.columnSpan = data.columnSpan || 1; // 1, 2, 3, 4 for multi-column layouts
    baseField.layoutWidth = data.layoutWidth || "full"; // full, half, third, quarter
    baseField.gridColumn = data.gridColumn || "auto"; // CSS grid column positioning
    baseField.gridRow = data.gridRow || "auto"; // CSS grid row positioning
    baseField.alignSelf = data.alignSelf || "stretch"; // Individual field alignment
    baseField.justifySelf = data.justifySelf || "stretch"; // Individual field justification
    // Advanced conditional logic properties
    baseField.conditionalLogic = data.conditionalLogic || {
      enabled: false,
      rules: [], // Multiple rules support
      action: "show", // show, hide, enable, disable, setValue, skipToStep
      actionValue: ""
    };

    // Custom validation properties
    baseField.customValidation = data.customValidation || {
      enabled: false,
      rules: [], // regex, range, custom function, etc.
      errorMessage: ""
    };

    return baseField;
  }, []);

  // Enhanced drag and drop handlers
// Enhanced drag over handler with improved stability and performance
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    
    // Skip processing if already processing or no canvas
    const canvas = canvasRef.current;
    if (!canvas || dragState.isProcessing) return;
    
    // Determine drag type more reliably
    let isFromLibrary = true;
    try {
      const transferData = e.dataTransfer.getData("application/json");
      if (transferData) {
        const data = JSON.parse(transferData);
        isFromLibrary = !data.isReorder;
      }
    } catch (err) {
      // Default to library drag on error
      isFromLibrary = true;
    }
    
    // Set appropriate drop effect with enhanced visual feedback
    e.dataTransfer.dropEffect = isFromLibrary ? 'copy' : 'move';
    
    // Calculate drag intensity for enhanced visual feedback
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
    const intensity = Math.max(0, 1 - (distance / maxDistance));
    
    // Calculate insertion index with improved accuracy
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
    
    // Prevent unnecessary updates for reorder operations
    if (!isFromLibrary && dragState.draggedFieldId) {
      const draggedIndex = fields.findIndex(f => f.Id === dragState.draggedFieldId);
      if (draggedIndex !== -1 && 
          (insertIndex === draggedIndex || insertIndex === draggedIndex + 1)) {
        // Only clear if currently showing an indicator
        if (dragState.dragOverIndex !== null) {
          setDragState(prev => ({ 
            ...prev, 
            dragOverIndex: null, 
            isDraggedOver: false,
            dragIntensity: 0
          }));
        }
        return;
      }
    }
    
    // Batch state updates for better performance with enhanced feedback
    setDragState(prev => ({
      ...prev,
      dragOverIndex: insertIndex,
      isDraggedOver: true,
      draggedFromLibrary: isFromLibrary,
      dragIntensity: intensity
    }));
  }, [fields, dragState.draggedFieldId, dragState.isProcessing]);

// Optimized drag leave handler with better boundary detection
  const handleDragLeave = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // More reliable check for leaving the canvas area
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !canvas.contains(relatedTarget)) {
      setDragState(prev => ({
        ...prev,
        dragOverIndex: null,
        isDraggedOver: false,
        draggedFromLibrary: false,
        dragIntensity: 0,
        dragPreviewElement: null
      }));
    }
  }, []);

// Robust drop handler with comprehensive error handling and stability
const handleDrop = useCallback((e) => {
    e.preventDefault();
    
    // Capture drag state before clearing with enhanced feedback
    const finalDragOverIndex = dragState.dragOverIndex;
    const dropIntensity = dragState.dragIntensity;
    
    // Set processing state and clear drag indicators with smooth transition
    setDragState(prev => ({
      ...prev,
      dragOverIndex: null,
      isDraggedOver: false,
      draggedFromLibrary: false,
      isProcessing: true,
      dragIntensity: 0,
      dragPreviewElement: null
    }));
    
    // Process drop operation with comprehensive error handling and enhanced feedback
    const processDropOperation = async () => {
      try {
// Validate transfer data
        const transferData = e.dataTransfer.getData("application/json");
        if (!transferData) {
          toast.error('✋ No data received from drag operation', {
            style: {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }
          });
          return;
        }
        
        // Parse and validate data
        let data;
        try {
          data = JSON.parse(transferData);
        } catch (parseError) {
console.error('Failed to parse drag data:', parseError);
          toast.error('❌ Invalid drag data format', {
            style: {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }
          });
          return;
        }
        
        // Validate field data for new fields
        if (!data.isReorder) {
          const validation = validateFieldData(data);
          if (!validation.isValid) {
            toast.error(`⚠️ ${validation.error}`, {
              className: "!bg-gradient-to-r !from-error/10 !to-neural-500/10 !text-surface-900",
            });
            return;
          }
        }
        
        // Calculate safe insertion index
        const insertIndex = finalDragOverIndex !== null ? finalDragOverIndex : fields.length;
        const newFields = [...fields];
        
        // Handle field reordering with enhanced feedback
        if (data.isReorder && data.fieldId) {
          const draggedFieldIndex = fields.findIndex(f => f.Id === data.fieldId);
          
          if (draggedFieldIndex === -1) {
            toast.error('🔍 Could not find field to reorder', {
              className: "!bg-gradient-to-r !from-error/10 !to-neural-500/10 !text-surface-900",
            });
            return;
          }
          
          // Check if position actually changes
          if (insertIndex === draggedFieldIndex || insertIndex === draggedFieldIndex + 1) {
            // No actual change needed
            return;
          }
          
          // Perform reordering with safe array operations
          const draggedField = fields[draggedFieldIndex];
          newFields.splice(draggedFieldIndex, 1);
          
          let targetIndex = insertIndex;
          if (draggedFieldIndex < insertIndex) {
            targetIndex = insertIndex - 1;
          }
          
          newFields.splice(targetIndex, 0, draggedField);
          onFieldsChange(newFields);
          
toast.success(`✨ ${draggedField.label || 'Field'} moved to position ${targetIndex + 1}`, {
            style: {
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)',
              color: 'white',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              boxShadow: `0 8px 32px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, ${dropIntensity * 0.2})`
            }
          });
        } else {
          // Handle new field creation with enhanced visual feedback
          try {
            const newField = createFieldFromData(data, insertIndex);
            
            // Performance warning for large forms
            if (fields.length > 50) {
              toast.warning('📊 Form has many fields. Consider using page breaks for better user experience.', {
                className: "!bg-gradient-to-r !from-neural-500/10 !to-neural-600/10 !text-surface-900",
              });
            }
            
            // Handle duplicate labels
            const duplicateLabel = fields.find(f => 
              f.label && newField.label && 
              f.label.toLowerCase() === newField.label.toLowerCase()
            );
            if (duplicateLabel) {
              newField.label = `${newField.label} (${fields.length + 1})`;
            }
            
            // Add field with safe array operation
            newFields.splice(insertIndex, 0, newField);
            onFieldsChange(newFields);
            
toast.success(`🎉 ${newField.label} added successfully`, {
              style: { 
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)',
                color: 'white',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                boxShadow: `0 8px 32px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, ${dropIntensity * 0.3})`
              }
            });
            
            // Select new field after brief delay for stability
            setTimeout(() => {
              try {
                onFieldSelect(newField.Id);
              } catch (selectionError) {
                console.warn('Field selection failed:', selectionError);
              }
            }, 100);
            
          } catch (creationError) {
            console.error('Field creation failed:', creationError);
            toast.error('❌ Failed to create field. Please try again.', {
              className: "!bg-gradient-to-r !from-error/10 !to-neural-500/10 !text-surface-900",
            });
          }
        }
        
      } catch (error) {
        console.error('Drop operation failed:', error);
        toast.error('⚠️ Unexpected error during drop operation', {
          className: "!bg-gradient-to-r !from-error/10 !to-neural-500/10 !text-surface-900",
        });
      } finally {
        // Clear processing state with smooth transition
        setTimeout(() => {
          setDragState(prev => ({ ...prev, isProcessing: false }));
        }, 200);
      }
    };
    
    // Execute drop processing
    processDropOperation();
  }, [dragState.dragOverIndex, dragState.dragIntensity, fields, validateFieldData, createFieldFromData, onFieldsChange, onFieldSelect]);

// Streamlined field drag start handler
const handleFieldDragStart = useCallback((e, fieldId) => {
    try {
      const fieldIndex = fields.findIndex(f => f.Id === fieldId);
      
      if (fieldIndex === -1) {
        console.error('Field not found for drag operation:', fieldId);
        return;
      }
      
      // Create enhanced drag preview
      const sourceElement = e.currentTarget;
      const dragPreview = sourceElement.cloneNode(true);
      
      // Enhanced drag preview styling
      dragPreview.style.position = 'absolute';
      dragPreview.style.top = '-1000px';
      dragPreview.style.left = '-1000px';
      dragPreview.style.width = `${sourceElement.offsetWidth}px`;
      dragPreview.style.transform = 'rotate(-1deg) scale(1.08)';
dragPreview.style.opacity = '0.92';
      dragPreview.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4), 0 0 100px rgba(139, 92, 246, 0.3)';
      dragPreview.style.border = '2px solid rgba(139, 92, 246, 0.6)';
      dragPreview.style.borderRadius = '16px';
      dragPreview.style.pointerEvents = 'none';
      dragPreview.style.zIndex = '9999';
      dragPreview.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)';
      dragPreview.style.backdropFilter = 'blur(20px)';
      document.body.appendChild(dragPreview);
      
      // Set drag image with proper positioning
      const rect = sourceElement.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setDragImage(dragPreview, offsetX, offsetY);
      
      // Update drag state with enhanced feedback
      setDragState(prev => ({
        ...prev,
        draggedFieldId: fieldId,
        dragStartPosition: fieldIndex,
        isProcessing: false,
        dragPreviewElement: dragPreview
      }));
      
      // Set drag data
      const dragData = {
        isReorder: true,
        fieldId: fieldId
      };
      
      e.dataTransfer.setData("application/json", JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'move';
      
      // Clean up preview after drag starts
      setTimeout(() => {
        if (document.body.contains(dragPreview)) {
          document.body.removeChild(dragPreview);
        }
      }, 50);
      
    } catch (error) {
      console.error('Field drag start failed:', error);
      toast.error('❌ Failed to start drag operation', {
        className: "!bg-gradient-to-r !from-error/10 !to-neural-500/10 !text-surface-900",
      });
    }
  }, [fields]);

// Clean field drag end handler
const handleFieldDragEnd = useCallback(() => {
    // Clean up drag preview if it exists
    if (dragState.dragPreviewElement && document.body.contains(dragState.dragPreviewElement)) {
      document.body.removeChild(dragState.dragPreviewElement);
    }
    
    // Clear drag state with enhanced cleanup
    setDragState(prev => ({
      ...prev,
      draggedFieldId: null,
      dragOverIndex: null,
      dragStartPosition: null,
      isProcessing: false,
      dragPreviewElement: null,
      dragIntensity: 0
    }));
  }, [dragState.dragPreviewElement]);

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
// Optimized field rendering with better performance and stability
  const renderField = useCallback((field, index) => {
    // Memoized state calculations to reduce re-renders
    const isSelected = selectedFieldId === field.Id;
    const isDragging = dragState.draggedFieldId === field.Id;
    const showDragIndicator = dragState.dragOverIndex === index && dragState.draggedFieldId;
    
// Skip rendering during processing state for better performance
    if (dragState.isProcessing && isDragging) {
      return null;
    }

    return (
      <React.Fragment key={field.Id}>
        <AnimatePresence>
          {showDragIndicator && (
            <motion.div 
key={`drag-indicator-${index}`}
              className="h-3 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 rounded-full mx-4 shadow-lg animate-glow-pulse backdrop-blur-sm"
              initial={{ scaleX: 0, opacity: 0, y: -15 }}
              animate={{ 
                scaleX: 1, 
                opacity: 0.9 + (dragState.dragIntensity * 0.1), 
                y: 0,
                scale: 1 + (dragState.dragIntensity * 0.1)
              }}
              exit={{ scaleX: 0, opacity: 0, y: 15 }}
              transition={{ 
                duration: 0.25, 
                type: "spring", 
                stiffness: 400, 
                damping: 25 
              }}
              style={{
                boxShadow: `0 0 25px rgba(139, 92, 246, ${0.6 + dragState.dragIntensity * 0.3}), 0 4px 15px rgba(139, 92, 246, ${0.4 + dragState.dragIntensity * 0.2})`,
                background: `linear-gradient(90deg, 
                  rgba(139, 92, 246, ${0.8 + dragState.dragIntensity * 0.2}) 0%, 
                  rgba(139, 92, 246, ${0.9 + dragState.dragIntensity * 0.1}) 50%, 
                  rgba(139, 92, 246, ${0.8 + dragState.dragIntensity * 0.2}) 100%)`
              }}
            />
          )}
        </AnimatePresence>
        {field.type === 'page-break' ? (
          <motion.div
            data-field-id={field.Id}
            layout
            layoutId={`page-break-${field.Id}`}
            draggable={!dragState.isProcessing}
            onDragStart={(e) => handleFieldDragStart(e, field.Id)}
            onDragEnd={handleFieldDragEnd}
            className={`group relative p-6 border-2 border-dashed rounded-2xl backdrop-blur-xl transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 texture-glass micro-bounce ${
              isDragging 
                ? 'opacity-50 transform scale-97 border-orange-400/70 shadow-3xl cursor-grabbing bg-gradient-to-br from-orange-100/40 to-orange-200/30 animate-glow-pulse backdrop-blur-2xl' 
                : isSelected 
                  ? 'border-orange-400/90 bg-gradient-to-br from-orange-100/50 to-orange-200/40 shadow-xl cursor-grab backdrop-blur-xl animate-float hover:shadow-2xl' 
                  : 'border-orange-300/50 bg-gradient-to-br from-orange-50/30 to-orange-100/20 hover:border-orange-400/70 hover:shadow-2xl cursor-grab hover:backdrop-blur-xl hover:bg-gradient-to-br hover:from-orange-100/40 hover:to-orange-200/30'
            }`}
style={{
              boxShadow: isDragging 
                ? '0 25px 60px rgba(251, 146, 60, 0.4), 0 0 120px rgba(251, 146, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : isSelected 
                  ? '0 20px 50px rgba(251, 146, 60, 0.35), 0 0 80px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  : '0 8px 30px rgba(251, 146, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, y: 40, rotateX: -20 }}
            animate={{ 
              opacity: isDragging ? 0.5 : 1, 
              y: 0,
              rotateX: 0,
              scale: isDragging ? 0.97 : 1
            }}
            exit={{ opacity: 0, y: -40, rotateX: 20 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 25
            }}
            onClick={() => !isDragging && !dragState.isProcessing && onFieldSelect(field.Id)}
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
              scale: isDragging ? 0.97 : 1.04,
              y: isDragging ? 0 : -4,
              transition: { 
                duration: 0.2,
                type: "spring",
                stiffness: 500
              }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200 shadow-sm"
                  whileHover={{ rotate: 8, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ApperIcon name="SeparatorHorizontal" size={22} className="text-orange-600" />
                </motion.div>
                <div>
                  <div className="font-semibold text-orange-900 text-lg">
                    {field.stepTitle || 'Page Break'}
                  </div>
                  <div className="text-sm text-orange-700 mt-1">
                    Splits form into multiple steps
                  </div>
                </div>
              </div>
              <motion.div 
                className="flex items-center gap-2 opacity-0 group-hover:opacity-100"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: isSelected ? 1 : 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Remove this page break?')) {
                      removeField(field.Id);
                    }
                  }}
                  className="p-2.5 text-orange-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
                  title="Delete page break (Delete key)"
                  tabIndex={0}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" size={18} className="text-orange-400 hover:text-red-500" />
                </motion.button>
                <motion.div 
                  className="cursor-move p-2.5 text-orange-400 hover:text-orange-600 transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-xl backdrop-blur-sm"
                  title="Drag to reorder"
                  tabIndex={0}
                  role="button"
                  aria-label="Drag handle"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="GripVertical" size={18} className="text-orange-400 hover:text-orange-600" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            data-field-id={field.Id}
            layout
            layoutId={`field-${field.Id}`}
            draggable={!dragState.isProcessing}
            onDragStart={(e) => handleFieldDragStart(e, field.Id)}
            onDragEnd={handleFieldDragEnd}
            className={`group relative p-5 border rounded-2xl backdrop-blur-xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 texture-glass micro-bounce ${
              isDragging 
                ? 'opacity-50 transform scale-97 border-primary-400/70 shadow-3xl cursor-grabbing bg-gradient-to-br from-primary-100/40 to-accent-100/30 animate-glow-pulse backdrop-blur-2xl' 
                : isSelected 
                  ? 'border-primary-500/90 bg-gradient-to-br from-primary-50/50 to-accent-50/40 shadow-xl cursor-grab backdrop-blur-xl hover:border-primary-400/70 animate-float hover:shadow-2xl' 
                  : 'border-gray-200/50 bg-gradient-to-br from-white/30 to-gray-50/20 hover:border-primary-300/70 hover:shadow-2xl cursor-grab hover:backdrop-blur-xl hover:bg-gradient-to-br hover:from-primary-50/40 hover:to-accent-50/30'
            }`}
            style={{
boxShadow: isDragging 
                ? '0 30px 70px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : isSelected 
                  ? '0 20px 50px rgba(139, 92, 246, 0.35), 0 0 80px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  : '0 8px 30px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, y: 40, rotateX: -15 }}
            animate={{ 
              opacity: isDragging ? 0.5 : 1, 
              y: 0,
              rotateX: 0,
              scale: isDragging ? 0.97 : 1
            }}
            exit={{ opacity: 0, y: -40, rotateX: 15 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 25,
              opacity: { duration: 0.4 }
            }}
            onClick={() => !isDragging && !dragState.isProcessing && onFieldSelect(field.Id)}
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
              scale: isDragging ? 0.97 : 1.04,
              y: isDragging ? 0 : -4,
              transition: { 
                duration: 0.2,
                type: "spring",
                stiffness: 500
              }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-400 ease-out ${
                isDragging 
                  ? 'opacity-100 scale-120' 
                  : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
              }`}
              initial={{ x: -15, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: isDragging || isSelected ? 1 : 0,
                scale: isDragging ? 1.2 : isSelected ? 1.1 : 1
              }}
              whileHover={{ opacity: 1, scale: 1.2 }}
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-md micro-glow backdrop-blur-sm">
                <ApperIcon name="GripVertical" size={18} className={`transition-colors duration-300 ${
                  isDragging ? 'text-primary-700' : 'text-gray-500 group-hover:text-primary-700'
                }`} />
              </div>
            </motion.div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4 ml-8">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ApperIcon 
                      name={FIELD_ICONS[field.type] || "Type"}
                      size={18} 
                      className="text-gray-600"
                    />
                  </motion.div>
                  <motion.div 
                    className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none micro-bounce"
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
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {field.label || 'Click to edit label'}
                  </motion.div>
                  <motion.label 
                    className="flex items-center gap-2 text-sm text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => updateField(field.Id, { required: e.target.checked })}
                      className="rounded focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={0}
                    />
                    Required
                  </motion.label>
                </div>
                
                <motion.div 
                  className="w-full text-sm text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none micro-bounce"
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
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {field.placeholder || 'Click to edit placeholder'}
                </motion.div>
                
                {field.type === "select" && field.options && (
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-sm font-semibold text-gray-700">Options:</label>
                    {field.options.map((option, optionIndex) => (
                      <motion.div 
                        key={`${field.Id}-option-${optionIndex}`} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: optionIndex * 0.1 }}
                      >
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[optionIndex] = e.target.value;
                            updateField(field.Id, { options: newOptions });
                          }}
                          className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-300"
                          placeholder="Option text"
                          onClick={(e) => e.stopPropagation()}
                          tabIndex={0}
                        />
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newOptions = (field.options || []).filter((_, i) => i !== optionIndex);
                            updateField(field.Id, { options: newOptions });
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none rounded-lg p-2"
                          tabIndex={0}
                          title="Remove option"
                          whileHover={{ scale: 1.15, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ApperIcon name="X" size={18} className="text-red-500 hover:text-red-700" />
                        </motion.button>
                      </motion.div>
                    ))}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newOptions = [...(field.options || []), ""];
                        updateField(field.Id, { options: newOptions });
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none rounded-lg px-3 py-2 micro-bounce"
                      tabIndex={0}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      + Add option
                    </motion.button>
                  </motion.div>
                )}
              </div>
              
              <motion.div 
                className="flex items-center gap-2 opacity-0 group-hover:opacity-100"
                initial={{ x: 25, opacity: 0 }}
                animate={{ x: 0, opacity: isSelected ? 1 : 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <motion.button
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
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none backdrop-blur-sm"
                  title="Delete field (Delete key)"
                  tabIndex={0}
                  whileHover={{ scale: 1.15, rotate: 20 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
                </motion.button>
                <motion.div 
                  className="cursor-move p-2.5 text-gray-400 hover:text-primary-500 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none rounded-xl backdrop-blur-sm"
                  title="Drag to reorder"
                  tabIndex={0}
                  role="button"
                  aria-label="Drag handle"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="GripVertical" size={18} className="text-gray-400 hover:text-primary-500 transition-colors" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </React.Fragment>
    );
  }, [selectedFieldId, dragState, onFieldSelect, handleFieldDragStart, handleFieldDragEnd, removeField, updateField, FIELD_ICONS]);

return (
<div 
      className="flex flex-col h-full bg-gray-50"
      style={{
        '--primary-color': formStyle?.primaryColor || '#3b82f6',
        '--primary-50': (formStyle?.primaryColor || '#3b82f6') + '0D',
        '--primary-100': (formStyle?.primaryColor || '#3b82f6') + '1A',
        '--primary-200': (formStyle?.primaryColor || '#3b82f6') + '33',
        '--primary-300': (formStyle?.primaryColor || '#3b82f6') + '4D',
        '--primary-400': (formStyle?.primaryColor || '#3b82f6') + '66',
        '--primary-500': formStyle?.primaryColor || '#3b82f6',
        '--primary-600': (formStyle?.primaryColor || '#3b82f6') + 'E6',
        '--primary-700': (formStyle?.primaryColor || '#3b82f6') + 'CC'
      }}
    >
      <div className="flex-1 flex flex-col p-8">
<div className={`${getFormWidthClass()} mx-auto w-full ${getFontFamilyClass()}`}>
<div className="flex items-center justify-between mb-8 gap-4">
            <input
              type="text"
              value={formName || ''}
              onChange={(e) => onFormNameChange?.(e.target.value)}
              placeholder="Untitled Form"
              className="text-3xl font-display font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border-2 focus:border-primary-300 rounded-lg px-4 py-2 transition-all duration-200 focus:ring-2 focus:ring-primary-500 flex-1 min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              tabIndex={0}
            />
<div className="flex-shrink-0">
<HamburgerMenu 
                onUndo={onUndo}
                onRedo={onRedo}
                onLivePreviewToggle={onLivePreviewToggle}
                onSave={onSave}
                onShowPublishModal={onShowPublishModal}
                onUnpublish={onUnpublish}
                onPublish={onPublish}
                canUndo={canUndo}
                canRedo={canRedo}
                currentForm={currentForm}
                formStyle={formStyle}
                onStyleChange={onStyleChange}
              />
            </div>
          </div>

          {/* Tab Navigation */}
<div className="mb-8">
<div className="flex space-x-1 bg-gray-100 rounded-xl p-1.5 gap-1" role="tablist" aria-label="Form builder tabs">
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
className={`flex-1 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    uiState.activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
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
<div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 shadow-sm">
              <div className="text-center">
<h3 className="text-xl font-display font-bold text-gray-900 mb-3">Form Styling</h3>
<p className="text-gray-600">Customize the appearance of your form</p>
              </div>

              {/* Primary Color */}
              <div className="space-y-6">
<label className="block text-sm font-semibold text-gray-700">Primary Color</label>
                <div className="grid grid-cols-6 gap-4">
                  {[
                    '#8B7FFF', '#3B82F6', '#10B981', '#F59E0B',
                    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16',
                    '#F97316', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => onStyleChange?.({ ...formStyle, primaryColor: color })}
                      className={`w-14 h-14 rounded-2xl border-2 transition-all duration-400 focus:ring-2 focus:ring-primary-500/50 focus:outline-none backdrop-blur-sm transform micro-bounce ${
                        formStyle?.primaryColor === color
                          ? 'border-white/70 scale-115 shadow-3xl ring-4 ring-white/40 animate-glow-pulse'
                          : 'border-white/40 hover:border-white/60 hover:scale-110 hover:shadow-2xl'
                      }`}
                      style={{ 
                        backgroundColor: color,
                        boxShadow: formStyle?.primaryColor === color 
                          ? `0 15px 40px ${color}40, 0 0 60px ${color}30, inset 0 1px 0 rgba(255,255,255,0.3)`
                          : `0 8px 25px ${color}25, inset 0 1px 0 rgba(255,255,255,0.2)`
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
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 font-medium">Custom:</span>
                  <input
                    type="color"
                    value={formStyle?.primaryColor || '#8B7FFF'}
                    onChange={(e) => onStyleChange?.({ ...formStyle, primaryColor: e.target.value })}
                    className="w-14 h-10 border-2 border-gray-200 rounded-xl cursor-pointer focus:ring-2 focus:ring-primary-500 focus:outline-none backdrop-blur-sm"
                    tabIndex={0}
                  />
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{formStyle?.primaryColor || '#8B7FFF'}</span>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-6">
                <label className="block text-sm font-semibold text-gray-700">Font Family</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'Inter', label: 'Inter (Default)', preview: 'The quick brown fox' },
                    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', preview: 'The quick brown fox' },
                    { value: 'Georgia', label: 'Georgia', preview: 'The quick brown fox' },
                    { value: 'Courier New', label: 'Courier New', preview: 'The quick brown fox' }
                  ].map((font) => (
                    <button
                      key={font.value}
                      onClick={() => onStyleChange?.({ ...formStyle, fontFamily: font.value })}
                      className={`p-5 text-left border-2 rounded-2xl backdrop-blur-sm transition-all duration-400 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.fontFamily === font.value
                          ? 'border-primary-500/90 bg-gradient-to-br from-primary-50/70 to-accent-50/50 shadow-xl scale-[1.03] texture-glass animate-glow-pulse'
                          : 'border-white/40 bg-gradient-to-br from-white/30 to-gray-50/20 hover:border-primary-300/70 hover:bg-gradient-to-br hover:from-primary-50/40 hover:to-accent-50/30 hover:shadow-2xl hover:scale-[1.02]'
                      }`}
                      style={{
                        boxShadow: formStyle?.fontFamily === font.value 
                          ? '0 15px 40px rgba(139, 92, 246, 0.25), 0 0 60px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
                          : '0 8px 25px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStyleChange?.({ ...formStyle, fontFamily: font.value });
                        }
                      }}
                    >
                      <div className={`font-semibold text-gray-900 mb-2 ${
                        font.value === 'Plus Jakarta Sans' ? 'font-display' :
                        font.value === 'Georgia' ? 'font-serif' :
                        font.value === 'Courier New' ? 'font-mono' : 'font-sans'
                      }`}>
                        {font.label}
                      </div>
                      <div className={`text-sm text-gray-600 ${
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
              <div className="space-y-6">
                <label className="block text-sm font-semibold text-gray-700">Form Width</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'narrow', label: 'Narrow', description: '512px max width' },
                    { value: 'medium', label: 'Medium', description: '672px max width' },
                    { value: 'wide', label: 'Wide', description: '896px max width' }
                  ].map((width) => (
                    <button
                      key={width.value}
                      onClick={() => onStyleChange?.({ ...formStyle, formWidth: width.value })}
                      className={`p-5 text-center border-2 rounded-2xl backdrop-blur-sm transition-all duration-400 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.formWidth === width.value
                          ? 'border-primary-500/90 bg-gradient-to-br from-primary-50/70 to-accent-50/50 shadow-xl scale-[1.03] texture-glass animate-glow-pulse'
                          : 'border-white/40 bg-gradient-to-br from-white/30 to-gray-50/20 hover:border-primary-300/70 hover:bg-gradient-to-br hover:from-primary-50/40 hover:to-accent-50/30 hover:shadow-2xl hover:scale-[1.02]'
                      }`}
                      style={{
                        boxShadow: formStyle?.formWidth === width.value 
                          ? '0 15px 40px rgba(139, 92, 246, 0.25), 0 0 60px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
                          : '0 8px 25px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStyleChange?.({ ...formStyle, formWidth: width.value });
                        }
                      }}
                    >
                      <div className="font-semibold text-gray-900 mb-2">{width.label}</div>
                      <div className="text-sm text-gray-600 mb-3">{width.description}</div>
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 ${
                            width.value === 'narrow' ? 'w-1/2' :
                            width.value === 'medium' ? 'w-3/4' : 'w-full'
                          }`} 
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Preview */}
              <div className="pt-6 border-t border-gray-200/50">
                <div className="text-sm font-semibold text-gray-700 mb-4">Live Preview</div>
                <div className="border-2 border-gray-200/50 rounded-2xl p-6 bg-gradient-to-br from-gray-50/50 to-white/30 backdrop-blur-sm">
                  <div 
                    className={`mx-auto p-6 bg-white rounded-2xl shadow-lg ${getFontFamilyClass()}`}
                    style={{ 
                      borderColor: formStyle?.primaryColor || '#8B7FFF',
                      maxWidth: formStyle?.formWidth === 'narrow' ? '320px' : 
                               formStyle?.formWidth === 'wide' ? '480px' : '400px',
                      boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 0 20px ${formStyle?.primaryColor || '#8B7FFF'}20`
                    }}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Sample Form</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:outline-none transition-all"
                          style={{ 
                            borderColor: (formStyle?.primaryColor || '#8B7FFF') + '40',
                            focusRingColor: (formStyle?.primaryColor || '#8B7FFF') + '50'
                          }}
                          placeholder="Enter your name"
                        />
                      </div>
                      <button 
                        className="w-full py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg transform hover:scale-105"
                        style={{ 
                          backgroundColor: formStyle?.primaryColor || '#8B7FFF',
                          boxShadow: `0 4px 15px ${formStyle?.primaryColor || '#8B7FFF'}30`
                        }}
                      >
                        Submit Form
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
// Enhanced Background & Styling Tab Content
            <div className="bg-gradient-to-br from-white/40 to-gray-50/30 backdrop-blur-2xl rounded-3xl border border-white/30 p-10 space-y-8 shadow-3xl texture-glass bg-pattern-circuit animate-morph-pattern" style={{boxShadow: '0 25px 50px rgba(139, 92, 246, 0.15), 0 0 80px rgba(0, 212, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}}>
              {/* Background Pattern Selection */}
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Grid3X3" size={16} className="text-white" />
                  </div>
                  Background Pattern
                </label>
                <div className="grid grid-cols-3 gap-5">
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
                      className={`p-6 text-center border-2 rounded-2xl backdrop-blur-sm transition-all duration-400 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.backgroundPattern === pattern.value
                          ? 'border-primary-500/90 bg-gradient-to-br from-primary-50/70 to-accent-50/50 shadow-xl scale-[1.03] texture-glass animate-glow-pulse'
                          : 'border-white/40 bg-gradient-to-br from-white/30 to-gray-50/20 hover:border-primary-300/70 hover:bg-gradient-to-br hover:from-primary-50/40 hover:to-accent-50/30 hover:shadow-2xl hover:scale-[1.02]'
                      }`}
                      style={{
                        boxShadow: formStyle?.backgroundPattern === pattern.value 
                          ? '0 15px 40px rgba(139, 92, 246, 0.25), 0 0 60px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
                          : '0 8px 25px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <div className={`w-full h-20 rounded-xl ${pattern.preview} mb-3 border-2 border-gray-200 shadow-inner`}></div>
                      <span className="text-sm font-semibold text-gray-700">{pattern.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Texture Selection */}
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-cyber-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Layers" size={16} className="text-white" />
                  </div>
                  Background Texture
                </label>
                <div className="grid grid-cols-3 gap-5">
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
                      className={`p-6 text-center border-2 rounded-2xl backdrop-blur-sm transition-all duration-400 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transform micro-bounce ${
                        formStyle?.backgroundTexture === texture.value
                          ? 'border-primary-500/90 bg-gradient-to-br from-primary-50/70 to-accent-50/50 shadow-xl scale-[1.03] texture-glass animate-glow-pulse'
                          : 'border-white/40 bg-gradient-to-br from-white/30 to-gray-50/20 hover:border-primary-300/70 hover:bg-gradient-to-br hover:from-primary-50/40 hover:to-accent-50/30 hover:shadow-2xl hover:scale-[1.02]'
                      }`}
                      style={{
                        boxShadow: formStyle?.backgroundTexture === texture.value 
                          ? '0 15px 40px rgba(139, 92, 246, 0.25), 0 0 60px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
                          : '0 8px 25px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <div className={`w-full h-20 rounded-xl ${texture.preview} mb-3 border-2 border-gray-200 relative overflow-hidden shadow-inner`}>
                        {texture.value === 'glass' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                        )}
                        {texture.value === 'noise' && (
                          <div className="absolute inset-0 opacity-40"></div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{texture.name}</span>
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
              {/* Enhanced AI Form Generation Tab Content */}
              <div className="bg-gradient-to-br from-white/40 to-gray-50/30 backdrop-blur-2xl rounded-3xl border border-white/30 p-12 space-y-10 shadow-3xl texture-glass bg-pattern-hexagon animate-morph-pattern" style={{boxShadow: '0 25px 50px rgba(139, 92, 246, 0.15), 0 0 80px rgba(0, 212, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}}>
                {/* Enhanced AI Assistant Orb */}
                <div className="flex justify-center mb-12">
                  <div className="relative">
                    <div className="ai-orb w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/40 to-accent-500/40 backdrop-blur-xl border-2 border-white/30 shadow-3xl"></div>
                    {/* Enhanced floating particles */}
                    <div className="ai-particle" style={{ top: '12px', left: '25px', animationDelay: '0s', background: 'linear-gradient(45deg, rgba(0, 255, 136, 0.9), rgba(0, 212, 255, 0.9))' }}></div>
                    <div className="ai-particle" style={{ top: '35px', right: '18px', animationDelay: '1s', background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.9), rgba(0, 212, 255, 0.9))' }}></div>
                    <div className="ai-particle" style={{ bottom: '25px', left: '15px', animationDelay: '2s', background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.9), rgba(139, 92, 246, 0.9))' }}></div>
                    {/* Enhanced neural links */}
                    <div className="ai-neural-link w-1 h-16 bg-gradient-to-b from-primary-500/60 to-transparent" style={{ top: '-40px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="ai-neural-link w-1 h-16 bg-gradient-to-t from-accent-500/60 to-transparent" style={{ bottom: '-40px', left: '50%', transform: 'translateX(-50%) rotate(180deg)' }}></div>
                  </div>
                </div>
                
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">AI Form Generator</h3>
                  <p className="text-lg text-gray-600">Let our AI assistant help you create the perfect form with enhanced intelligence</p>
                </div>
                
                {/* Enhanced AI Generation Content */}
                <div className="space-y-8">
                  <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl">
                    <h4 className="font-bold text-gray-900 mb-5 text-xl flex items-center gap-3">
                      <ApperIcon name="Brain" size={20} className="text-primary-600" />
                      Smart AI Suggestions
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 animate-float p-4 bg-white/30 rounded-xl backdrop-blur-sm">
                        <div className="w-3 h-3 rounded-full bg-primary-500 animate-glow-pulse shadow-lg"></div>
                        <span className="text-sm text-gray-700 font-medium">Optimize field order for better completion rates using UX psychology</span>
                      </div>
                      <div className="flex items-center space-x-4 animate-float-reverse p-4 bg-white/30 rounded-xl backdrop-blur-sm">
                        <div className="w-3 h-3 rounded-full bg-accent-500 animate-glow-pulse shadow-lg"></div>
                        <span className="text-sm text-gray-700 font-medium">Suggest conditional logic for dynamic forms with smart branching</span>
                      </div>
                      <div className="flex items-center space-x-4 animate-float p-4 bg-white/30 rounded-xl backdrop-blur-sm">
                        <div className="w-3 h-3 rounded-full bg-cyber-500 animate-glow-pulse shadow-lg"></div>
                        <span className="text-sm text-gray-700 font-medium">Recommend validation rules and contextual help text automatically</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced AI Form Builder Interface */}
              <div className="bg-gradient-to-br from-white/50 to-gray-50/40 backdrop-blur-xl rounded-3xl shadow-3xl p-10 space-y-10 border border-white/30 texture-glass">
                <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ApperIcon name="Bot" size={36} className="text-primary-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">AI Form Builder</h3>
                <p className="text-gray-600 text-lg">Describe the form you want and I'll create it for you with enhanced capabilities</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ApperIcon name="MessageCircle" size={16} className="text-primary-600" />
                    Describe your form
                  </label>
                  <textarea
                    value={uiState.aiPrompt}
                    onChange={(e) => setUiState(prev => ({ ...prev, aiPrompt: e.target.value }))}
                    placeholder="Example: Create a contact form with name, email, phone number, company, message, and a dropdown for inquiry type with options: Sales, Support, Partnership, Other"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors backdrop-blur-sm bg-white/50 text-gray-900 placeholder-gray-500"
                    rows={5}
                    disabled={uiState.isGeneratingForm}
                    tabIndex={0}
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <ApperIcon name="Info" size={12} className="text-gray-400" />
                    Be specific about field types, labels, and options for better results
                  </p>
                </div>

                <div className="flex gap-4">
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
                    className="flex-1 focus:ring-2 focus:ring-primary-500 py-4 text-lg"
                    tabIndex={0}
                  >
                    {uiState.isGeneratingForm ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating with AI...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Wand2" className="w-5 h-5" />
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
                      className="py-4"
                    >
                      Clear Form
                    </Button>
                  )}
                </div>

                {/* Enhanced example prompts */}
                <div className="bg-gradient-to-br from-gray-50/80 to-white/50 rounded-2xl p-6 border border-gray-200/50 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ApperIcon name="Lightbulb" size={18} className="text-amber-600" />
                    Example prompts to get you started
                  </h4>
                  <div className="space-y-3">
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
                        className="text-left w-full text-sm text-gray-700 hover:text-primary-600 hover:bg-white p-4 rounded-xl transition-all focus:ring-2 focus:ring-primary-500 focus:outline-none backdrop-blur-sm border border-gray-200/30 hover:border-primary-300/50 micro-bounce"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setUiState(prev => ({ ...prev, aiPrompt: example }));
                          }
                        }}
                      >
                        <span className="font-medium">"{example}"</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Tips */}
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border-2 border-blue-200/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <ApperIcon name="Info" size={22} className="text-blue-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-800 mb-3">Tips for better AI results</p>
                      <ul className="text-blue-700 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>Specify field types (text, email, phone, dropdown, checkbox, etc.)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>Include specific labels and placeholder text you want</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>For dropdowns, list the exact options you need</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>Mention if fields should be required or optional</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>Describe the form's purpose (contact, survey, registration, etc.)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <>
{/* Enhanced Design Tab Content (Form Canvas) with improved stability */}
<div
                ref={canvasRef}
                className={`bg-gradient-to-br from-white/40 to-gray-50/30 backdrop-blur-2xl rounded-3xl border border-white/30 p-10 min-h-[600px] flex-1 transition-all duration-500 ease-out relative texture-glass shadow-3xl ${
                  formStyle?.backgroundPattern ? `bg-pattern-${formStyle.backgroundPattern}` : ''
                } ${
                  formStyle?.backgroundTexture ? `texture-${formStyle.backgroundTexture}` : ''
                } ${
                  dragState.isDraggedOver && dragState.draggedFromLibrary 
                    ? "bg-gradient-to-br from-primary-100/50 via-primary-50/40 to-primary-100/30 border-2 border-primary-500/90 border-dashed shadow-4xl ring-4 ring-primary-200/40 animate-glow-pulse backdrop-blur-2xl" 
                    : dragState.isDraggedOver 
                      ? "bg-gradient-to-br from-primary-100/40 to-primary-50/30 border-2 border-primary-400/70 border-dashed shadow-3xl ring-2 ring-primary-200/40 backdrop-blur-2xl" 
                      : dragState.draggedFieldId 
                        ? "bg-gradient-to-br from-slate-100/40 to-slate-50/30 shadow-2xl backdrop-blur-2xl" 
                        : "hover:shadow-4xl hover:border-white/50 backdrop-blur-2xl"
                } ${
                  dragState.dragOverIndex !== null && !dragState.isProcessing
                    ? "shadow-4xl transform scale-[1.01]" 
                    : ""
                } ${
                  dragState.isProcessing ? "pointer-events-none opacity-75" : ""
                }`}
                style={{
                  boxShadow: dragState.isDraggedOver 
                    ? `0 30px 80px rgba(139, 92, 246, ${0.2 + dragState.dragIntensity * 0.1}), 0 0 120px rgba(139, 92, 246, ${0.1 + dragState.dragIntensity * 0.05}), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                    : '0 25px 50px rgba(139, 92, 246, 0.1), 0 0 80px rgba(139, 92, 246, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
                role="region"
                aria-label="Form canvas - drop fields here"
              >
                {dragState.isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-lg">
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-gray-700">Processing...</span>
                    </div>
                  </div>
                )}
                
                {fields.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ApperIcon name="MousePointer2" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Drop form fields here</p>
                      <p className="mb-6">Drag fields from the library to start building your form</p>
                      
                      {/* Enhanced fallback field addition methods */}
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
                            disabled={dragState.isProcessing}
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
                            disabled={dragState.isProcessing}
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
                            disabled={dragState.isProcessing}
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
                      // Enhanced multi-step form preview
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
                                  disabled={dragState.isProcessing}
                                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50 ${
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
                      <>
                        <div className="space-y-4">
                        <AnimatePresence>
                          {fields.map((field, index) => renderField(field, index))}
                        </AnimatePresence>
{dragState.dragOverIndex === fields.length && dragState.draggedFieldId && !dragState.isProcessing && (
<motion.div 
                            className="h-3 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 rounded-full mx-6 shadow-lg animate-glow-pulse backdrop-blur-sm"
                            initial={{ scaleX: 0, opacity: 0, y: -15 }}
                            animate={{ 
                              scaleX: 1, 
                              opacity: 0.9 + (dragState.dragIntensity * 0.1), 
                              y: 0,
                              scale: 1 + (dragState.dragIntensity * 0.1)
                            }}
                            exit={{ scaleX: 0, opacity: 0, y: 15 }}
                            transition={{ 
                              duration: 0.25, 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 25 
                            }}
                            style={{
                              boxShadow: `0 0 25px rgba(139, 92, 246, ${0.6 + dragState.dragIntensity * 0.3}), 0 4px 15px rgba(139, 92, 246, ${0.4 + dragState.dragIntensity * 0.2})`,
                              background: `linear-gradient(90deg, 
                                rgba(139, 92, 246, ${0.8 + dragState.dragIntensity * 0.2}) 0%, 
                                rgba(139, 92, 246, ${0.9 + dragState.dragIntensity * 0.1}) 50%, 
                                rgba(139, 92, 246, ${0.8 + dragState.dragIntensity * 0.2}) 100%)`
                            }}
                          />
)}
                        </div>
                      </>
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