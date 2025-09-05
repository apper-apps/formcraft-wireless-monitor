import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Layout from "@/components/organisms/Layout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const FieldPropertiesPanel = ({ selectedFieldId, fields, onFieldsChange, onFieldSelect, notificationSettings, onNotificationSettingsChange, thankYouSettings, onThankYouSettingsChange, formSteps, currentStep, onStepChange }) => {
const [localLabel, setLocalLabel] = useState('');
  const [localPlaceholder, setLocalPlaceholder] = useState('');
  const [localRequired, setLocalRequired] = useState(false);
  const [localHelpText, setLocalHelpText] = useState('');
  const [localOptions, setLocalOptions] = useState([]);
  const [localMin, setLocalMin] = useState('');
  const [localMax, setLocalMax] = useState('');
  const [localMaxRating, setLocalMaxRating] = useState(5);
  const [localAcceptedTypes, setLocalAcceptedTypes] = useState('');
  const [localShowCondition, setLocalShowCondition] = useState({
    enabled: false,
    fieldId: '',
    operator: 'equals',
    value: ''
  });
  const [localCurrencySettings, setLocalCurrencySettings] = useState({
    symbol: '$',
    code: 'USD'
  });
  const [localSliderSettings, setLocalSliderSettings] = useState({
    step: 1,
    defaultValue: 0
  });
  const [localContentSettings, setLocalContentSettings] = useState({
    headingLevel: 'h2',
    headingText: 'Heading Text',
    paragraphText: 'Enter your paragraph text here.',
    textAlign: 'left',
    htmlContent: '<p>Enter your HTML content here</p>'
  });
const [localLayoutSettings, setLocalLayoutSettings] = useState({
    columnSpan: 1,
    layoutWidth: 'full',
    gridColumn: 'auto',
    gridRow: 'auto',
    alignSelf: 'stretch',
    justifySelf: 'stretch'
  });
  const selectedField = fields.find(field => field.Id === selectedFieldId);
const availableFields = fields.filter(field => field.Id !== selectedFieldId);
useEffect(() => {
if (selectedField) {
      setLocalLabel(selectedField.label || '');
      setLocalPlaceholder(selectedField.placeholder || '');
      setLocalRequired(selectedField.required || false);
      setLocalHelpText(selectedField.helpText || '');
      setLocalOptions(selectedField.options || []);
      setLocalMin(selectedField.min || '');
      setLocalMax(selectedField.max || '');
      setLocalMaxRating(selectedField.maxRating || 5);
      setLocalAcceptedTypes(selectedField.acceptedTypes || '');
      setLocalShowCondition(selectedField.showCondition || {
        enabled: false,
        fieldId: '',
        operator: 'equals',
        value: ''
      });
      setLocalCurrencySettings({
        symbol: selectedField.currencySymbol || '$',
        code: selectedField.currencyCode || 'USD'
      });
      setLocalSliderSettings({
        step: selectedField.step || 1,
        defaultValue: selectedField.defaultValue || 0
      });
      setLocalContentSettings({
        headingLevel: selectedField.headingLevel || 'h2',
        headingText: selectedField.headingText || 'Heading Text',
        paragraphText: selectedField.paragraphText || 'Enter your paragraph text here.',
        textAlign: selectedField.textAlign || 'left',
        htmlContent: selectedField.htmlContent || '<p>Enter your HTML content here</p>'
      });
setLocalLayoutSettings({
        columnSpan: selectedField.columnSpan || 1,
        layoutWidth: selectedField.layoutWidth || 'full',
        gridColumn: selectedField.gridColumn || 'auto',
        gridRow: selectedField.gridRow || 'auto',
        alignSelf: selectedField.alignSelf || 'stretch',
        justifySelf: selectedField.justifySelf || 'stretch'
      });
    } else {
      setLocalLabel('');
      setLocalPlaceholder('');
      setLocalRequired(false);
      setLocalHelpText('');
      setLocalOptions([]);
      setLocalMin('');
      setLocalMax('');
      setLocalMaxRating(5);
      setLocalAcceptedTypes('');
      setLocalShowCondition({
        enabled: false,
        fieldId: '',
        operator: 'equals',
        value: ''
      });
      setLocalCurrencySettings({ symbol: '$', code: 'USD' });
      setLocalSliderSettings({ step: 1, defaultValue: 0 });
      setLocalContentSettings({
        headingLevel: 'h2',
        headingText: 'Heading Text',
        paragraphText: 'Enter your paragraph text here.',
        textAlign: 'left',
        htmlContent: '<p>Enter your HTML content here</p>'
});
      setLocalLayoutSettings({ 
        columnSpan: 1, 
        layoutWidth: 'full',
        gridColumn: 'auto',
        gridRow: 'auto',
        alignSelf: 'stretch',
        justifySelf: 'stretch'
      });
    }
  }, [selectedField]);

const updateField = (updates) => {
    if (!selectedFieldId) return;

    const updatedFields = fields.map(field =>
      field.Id === selectedFieldId ? { ...field, ...updates } : field
    );
    onFieldsChange(updatedFields);
  };

  const handleLabelChange = (value) => {
    setLocalLabel(value);
    updateField({ label: value });
  };

  const handlePlaceholderChange = (value) => {
    setLocalPlaceholder(value);
    updateField({ placeholder: value });
  };
const handleRequiredChange = (value) => {
    setLocalRequired(value);
    updateField({ required: value });
  };

  const handleHelpTextChange = (value) => {
    setLocalHelpText(value);
    updateField({ helpText: value });
  };

  const handleOptionsChange = (value) => {
    const options = value.split('\n').filter(opt => opt.trim());
    setLocalOptions(options);
    updateField({ options });
  };

const handleMinChange = (value) => {
    setLocalMin(value);
    updateField({ min: value ? parseFloat(value) : undefined });
  };

  const handleMaxChange = (value) => {
    setLocalMax(value);
    updateField({ max: value ? parseFloat(value) : undefined });
  };

  const handleMaxRatingChange = (value) => {
    setLocalMaxRating(value);
    updateField({ maxRating: parseInt(value) });
  };

  const handleAcceptedTypesChange = (value) => {
    setLocalAcceptedTypes(value);
    updateField({ acceptedTypes: value });
  };

  const handleCurrencyChange = (field, value) => {
    const newSettings = { ...localCurrencySettings, [field]: value };
    setLocalCurrencySettings(newSettings);
    updateField({ 
      currencySymbol: newSettings.symbol, 
      currencyCode: newSettings.code 
    });
  };

  const handleSliderChange = (field, value) => {
    const newSettings = { ...localSliderSettings, [field]: value };
    setLocalSliderSettings(newSettings);
    updateField({ 
      step: newSettings.step, 
      defaultValue: newSettings.defaultValue 
    });
  };

  const handleContentChange = (field, value) => {
    const newSettings = { ...localContentSettings, [field]: value };
    setLocalContentSettings(newSettings);
    updateField({ 
      headingLevel: newSettings.headingLevel,
      headingText: newSettings.headingText,
      paragraphText: newSettings.paragraphText,
      textAlign: newSettings.textAlign,
      htmlContent: newSettings.htmlContent
    });
  };

const handleLayoutChange = (field, value) => {
    const newSettings = { ...localLayoutSettings, [field]: value };
    setLocalLayoutSettings(newSettings);
    updateField({ 
      columnSpan: newSettings.columnSpan,
      layoutWidth: newSettings.layoutWidth,
      gridColumn: newSettings.gridColumn,
      gridRow: newSettings.gridRow,
      alignSelf: newSettings.alignSelf,
      justifySelf: newSettings.justifySelf
    });
  };
function handleShowConditionChange(updates) {
    const newCondition = { ...localShowCondition, ...updates };
    setLocalShowCondition(newCondition);
    updateField({ showCondition: newCondition });
    toast.success('Show/hide condition updated');
  }
  const deleteField = () => {
    if (!selectedFieldId) return;
    
    const updatedFields = fields.filter(field => field.Id !== selectedFieldId);
    onFieldsChange(updatedFields);
    onFieldSelect(null);
    toast.success('Field deleted successfully');
  };

  const duplicateField = () => {
    if (!selectedField) return;

    const maxId = Math.max(...fields.map(f => f.Id), 0);
    const duplicatedField = {
      ...selectedField,
      Id: maxId + 1,
      label: `${selectedField.label || 'Field'} Copy`
    };

    onFieldsChange([...fields, duplicatedField]);
    onFieldSelect(duplicatedField.Id);
    toast.success('Field duplicated successfully');
  };

const getFieldOptions = (fieldId) => {
    const field = fields.find(f => f.Id === fieldId);
    if (!field) return [];
    
    if (field.type === 'select' || field.type === 'radio') {
      return field.options || [];
    } else if (field.type === 'checkbox') {
      return ['true', 'false'];
    }
    return [];
  };
const [activeTab, setActiveTab] = useState(selectedFieldId ? 'field' : 'settings');

  return (
<div className="properties-panel bg-gray-50 border-l border-gray-200 flex flex-col h-full" style={{width: '280px'}}>
      {/* Enhanced Header with Tabs */}
<div className="p-6 border-b border-gray-200 bg-white">
<div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Settings" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display">
              Properties
</h3>
          </div>
          {selectedFieldId && (
<Button
              variant="ghost"
size="sm"
              onClick={() => onFieldSelect(null)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
              title="Close properties panel (Escape)"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onFieldSelect(null);
                }
              }}
            >
              <ApperIcon name="X" size={18} />
            </Button>
          )}
        </div>
        
        {/* Enhanced Tab Navigation */}
<div className="flex bg-gray-100 rounded-xl p-1.5 gap-2">
          <button
onClick={() => setActiveTab('field')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'field'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/70'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ApperIcon name="Settings" size={16} />
              Field
            </div>
</button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/70'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ApperIcon name="Sliders" size={16} />
              Form
            </div>
          </button>
        </div>
        
{selectedField && activeTab === 'field' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-700 font-medium">
              Editing {selectedField.type} field
            </p>
          </div>
        )}
      </div>

{/* Content */}
<div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'field' ? (
selectedField ? (
            <div className="p-8 space-y-8">
{/* Enhanced Field Type Display */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ApperIcon name="Tag" size={16} className="text-blue-600" />
                Field Type
              </label>
<div className="flex items-center bg-white rounded-xl p-5 space-x-4 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
<ApperIcon 
                    name={
                      selectedField.type === 'text' ? 'Type' :
                      selectedField.type === 'email' ? 'Mail' :
                      selectedField.type === 'textarea' ? 'FileText' :
selectedField.type === 'select' ? 'ChevronDown' :
                      selectedField.type === 'checkbox' ? 'Square' :
                      selectedField.type === 'phone' ? 'Phone' :
                      selectedField.type === 'radio' ? 'Circle' :
                      selectedField.type === 'number' ? 'Hash' :
                      selectedField.type === 'date' ? 'Calendar' :
                      selectedField.type === 'time' ? 'Clock' :
                      selectedField.type === 'datetime-local' ? 'CalendarClock' :
                      selectedField.type === 'url' ? 'Link' :
                      selectedField.type === 'tel' ? 'Phone' :
                      selectedField.type === 'password' ? 'Lock' :
                      selectedField.type === 'file' ? 'Upload' :
                      selectedField.type === 'rating' ? 'Star' :
                      selectedField.type === 'slider' ? 'Sliders' :
                      selectedField.type === 'range' ? 'Sliders' :
                      selectedField.type === 'currency' ? 'DollarSign' :
                      selectedField.type === 'color' ? 'Palette' :
                      selectedField.type === 'heading' ? 'Heading' :
                      selectedField.type === 'paragraph' ? 'AlignLeft' :
                      selectedField.type === 'divider' ? 'Minus' :
                      selectedField.type === 'image' ? 'Image' :
                      selectedField.type === 'html' ? 'Code' :
                      selectedField.type === 'page-break' ? 'SeparatorHorizontal' : 'Type'
                    }
                    size={20} 
                    className="text-blue-600" 
                  />
                </div>
<span className="text-base font-semibold text-gray-900 capitalize">
                  {selectedField.type === 'page-break' ? 'Page Break' :
                   selectedField.type === 'datetime-local' ? 'Date & Time Field' :
                   selectedField.type === 'html' ? 'HTML Content' :
                   `${selectedField.type} Field`}
                </span>
              </div>
</div>

            {/* Enhanced Label Input */}
<div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ApperIcon name="Tag" size={16} className="text-primary-600" />
                Field Label *
              </label>
<Input
                value={localLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Enter field label"
                className="w-full border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4 transition-all duration-200"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  }
                }}
              />
            </div>

{/* Placeholder Input */}
            {['text', 'email', 'textarea', 'number', 'phone', 'tel', 'url', 'password', 'currency'].includes(selectedField.type) && (
<div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Placeholder Text
                </label>
                <Input
                  value={localPlaceholder}
                  onChange={(e) => handlePlaceholderChange(e.target.value)}
                  placeholder="Enter placeholder text"
                  className="w-full"
                  tabIndex={0}
                />
              </div>
            )}

            {/* Options for Radio and Select */}
            {['radio', 'select'].includes(selectedField.type) && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
<textarea
                  value={localOptions.join('\n')}
                  onChange={(e) => handleOptionsChange(e.target.value)}
                  placeholder="Enter each option on a new line"
                  className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900 placeholder-gray-600"
                  rows={5}
                  tabIndex={0}
                />
                <p className="text-xs text-gray-500">
                  Enter each option on a separate line
                </p>
              </div>
            )}

            {/* Min/Max for Number fields */}
            {selectedField.type === 'number' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
Minimum Value
                  </label>
                  <Input
                    type="number"
                    value={localMin}
                    onChange={(e) => handleMinChange(e.target.value)}
                    placeholder="Min value"
                    className="w-full"
                    tabIndex={0}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Value
                  </label>
                  <Input
                    type="number"
                    value={localMax}
onChange={(e) => handleMaxChange(e.target.value)}
                    placeholder="Max value"
                    className="w-full"
                    tabIndex={0}
                  />
                </div>
              </div>
            )}

            {/* Max Rating for Rating fields */}
            {selectedField.type === 'rating' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Rating
                </label>
                <select
value={localMaxRating}
                  onChange={(e) => handleMaxRatingChange(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                  tabIndex={0}
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </select>
              </div>
            )}

            {/* File Types for File Upload */}
            {selectedField.type === 'file' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Accepted File Types
                </label>
                <Input
value={localAcceptedTypes}
                  onChange={(e) => handleAcceptedTypesChange(e.target.value)}
                  placeholder=".pdf,.doc,.docx,.jpg,.png"
                  className="w-full"
                  tabIndex={0}
                />
                <p className="text-xs text-gray-500">
                  Specify file extensions separated by commas
                </p>
</div>
            )}

            {/* Currency Settings */}
            {selectedField.type === 'currency' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency Symbol
                  </label>
                  <Input
                    value={localCurrencySettings.symbol}
                    onChange={(e) => handleCurrencyChange('symbol', e.target.value)}
                    placeholder="$"
                    className="w-full"
                    tabIndex={0}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency Code
                  </label>
                  <Input
                    value={localCurrencySettings.code}
                    onChange={(e) => handleCurrencyChange('code', e.target.value)}
                    placeholder="USD"
                    className="w-full"
                    tabIndex={0}
                  />
                </div>
              </div>
            )}

            {/* Slider/Range Settings */}
            {(selectedField.type === 'slider' || selectedField.type === 'range') && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Min Value
                    </label>
                    <Input
                      type="number"
                      value={localMin}
                      onChange={(e) => handleMinChange(e.target.value)}
                      placeholder="0"
                      className="w-full"
                      tabIndex={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Value
                    </label>
                    <Input
                      type="number"
                      value={localMax}
                      onChange={(e) => handleMaxChange(e.target.value)}
                      placeholder="100"
                      className="w-full"
                      tabIndex={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Step
                    </label>
                    <Input
                      type="number"
                      value={localSliderSettings.step}
                      onChange={(e) => handleSliderChange('step', parseFloat(e.target.value) || 1)}
                      placeholder="1"
                      className="w-full"
                      tabIndex={0}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Value
                  </label>
                  <Input
                    type="number"
                    value={localSliderSettings.defaultValue}
                    onChange={(e) => handleSliderChange('defaultValue', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full"
                    tabIndex={0}
                  />
                </div>
              </div>
            )}

            {/* Heading Settings */}
            {selectedField.type === 'heading' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Heading Text
                  </label>
                  <Input
                    value={localContentSettings.headingText}
                    onChange={(e) => handleContentChange('headingText', e.target.value)}
                    placeholder="Enter heading text"
                    className="w-full"
                    tabIndex={0}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Heading Level
                    </label>
                    <select
                      value={localContentSettings.headingLevel}
                      onChange={(e) => handleContentChange('headingLevel', e.target.value)}
className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                      tabIndex={0}
                    >
                      <option value="h1">H1 - Main Title</option>
                      <option value="h2">H2 - Section Title</option>
                      <option value="h3">H3 - Subsection</option>
                      <option value="h4">H4 - Minor Heading</option>
                      <option value="h5">H5 - Small Heading</option>
                      <option value="h6">H6 - Tiny Heading</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Text Alignment
                    </label>
                    <select
value={localContentSettings.textAlign}
                      onChange={(e) => handleContentChange('textAlign', e.target.value)}
                      className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                      tabIndex={0}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Paragraph Settings */}
            {selectedField.type === 'paragraph' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paragraph Text
                  </label>
<textarea
                    value={localContentSettings.paragraphText}
                    onChange={(e) => handleContentChange('paragraphText', e.target.value)}
                    placeholder="Enter your paragraph text here"
                    className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900 placeholder-gray-600"
                    rows={5}
                    tabIndex={0}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Text Alignment
                  </label>
                  <select
                    value={localContentSettings.textAlign}
                    onChange={(e) => handleContentChange('textAlign', e.target.value)}
                    className="w-full px-4 py-3 border border-white/30 bg-white/20 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 texture-glass micro-glow"
                    tabIndex={0}
>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {/* HTML Content Settings */}
            {selectedField.type === 'html' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  HTML Content
                </label>
                <textarea
value={localContentSettings.htmlContent}
                  onChange={(e) => handleContentChange('htmlContent', e.target.value)}
                  placeholder="<p>Enter your HTML content here</p>"
                  className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow font-mono text-sm hover:bg-white/40 text-gray-900 placeholder-gray-600"
                  rows={7}
                  tabIndex={0}
                />
                <p className="text-xs text-gray-500">
                  Use HTML tags to format content. Be careful with user-generated content.
                </p>
              </div>
            )}

            {/* Layout Settings */}
{!['page-break', 'divider'].includes(selectedField.type) && (
              <div className="border-t pt-4 space-y-6">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ApperIcon name="Layout" size={16} className="text-gray-600" />
                  Advanced Layout Settings
                </h3>
                
                {/* Basic Layout Controls */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">Basic Layout</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Column Span
                      </label>
                      <select
                        value={localLayoutSettings.columnSpan}
                        onChange={(e) => handleLayoutChange('columnSpan', parseInt(e.target.value))}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                        tabIndex={0}
                      >
                        <option value={1}>1 Column</option>
                        <option value={2}>2 Columns</option>
                        <option value={3}>3 Columns</option>
                        <option value={4}>4 Columns</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Width
                      </label>
                      <select
                        value={localLayoutSettings.layoutWidth}
                        onChange={(e) => handleLayoutChange('layoutWidth', e.target.value)}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                        tabIndex={0}
                      >
                        <option value="full">Full Width</option>
                        <option value="half">Half Width</option>
                        <option value="third">Third Width</option>
                        <option value="quarter">Quarter Width</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Advanced Grid Controls */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">Grid Positioning</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Grid Column
                      </label>
                      <select
                        value={localLayoutSettings.gridColumn}
                        onChange={(e) => handleLayoutChange('gridColumn', e.target.value)}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                        tabIndex={0}
                      >
                        <option value="auto">Auto</option>
                        <option value="1">Column 1</option>
                        <option value="2">Column 2</option>
                        <option value="3">Column 3</option>
                        <option value="4">Column 4</option>
                        <option value="1 / 3">Span Columns 1-2</option>
                        <option value="2 / 4">Span Columns 2-3</option>
                        <option value="1 / -1">Full Row</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Grid Row
                      </label>
                      <select
                        value={localLayoutSettings.gridRow}
                        onChange={(e) => handleLayoutChange('gridRow', e.target.value)}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                        tabIndex={0}
                      >
                        <option value="auto">Auto</option>
                        <option value="1">Row 1</option>
                        <option value="2">Row 2</option>
                        <option value="3">Row 3</option>
                        <option value="span 2">Span 2 Rows</option>
                        <option value="span 3">Span 3 Rows</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Alignment Controls */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">Alignment</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Vertical Align
                      </label>
                      <select
                        value={localLayoutSettings.alignSelf}
                        onChange={(e) => handleLayoutChange('alignSelf', e.target.value)}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                        tabIndex={0}
                      >
                        <option value="stretch">Stretch</option>
                        <option value="start">Top</option>
                        <option value="center">Center</option>
                        <option value="end">Bottom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Horizontal Align
                      </label>
                      <select
                        value={localLayoutSettings.justifySelf}
                        onChange={(e) => handleLayoutChange('justifySelf', e.target.value)}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                        tabIndex={0}
                      >
                        <option value="stretch">Stretch</option>
                        <option value="start">Left</option>
                        <option value="center">Center</option>
                        <option value="end">Right</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Layout Presets */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">Quick Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newSettings = { 
                          ...localLayoutSettings, 
                          columnSpan: 2, 
                          layoutWidth: 'full',
                          gridColumn: '1 / 3',
                          alignSelf: 'stretch' 
                        };
                        setLocalLayoutSettings(newSettings);
                        updateField(newSettings);
                      }}
                      className="px-3 py-2 text-xs bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg border border-primary-200 transition-all duration-200 font-medium"
                    >
                      Wide Field
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newSettings = { 
                          ...localLayoutSettings, 
                          columnSpan: 1, 
                          layoutWidth: 'half',
                          gridColumn: 'auto',
                          alignSelf: 'start' 
                        };
                        setLocalLayoutSettings(newSettings);
                        updateField(newSettings);
                      }}
                      className="px-3 py-2 text-xs bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg border border-primary-200 transition-all duration-200 font-medium"
                    >
                      Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newSettings = { 
                          ...localLayoutSettings, 
                          columnSpan: 1, 
                          layoutWidth: 'full',
                          gridColumn: '1 / -1',
                          alignSelf: 'stretch' 
                        };
                        setLocalLayoutSettings(newSettings);
                        updateField(newSettings);
                      }}
                      className="px-3 py-2 text-xs bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg border border-primary-200 transition-all duration-200 font-medium"
                    >
                      Full Row
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newSettings = { 
                          ...localLayoutSettings, 
                          columnSpan: 1, 
                          layoutWidth: 'quarter',
                          gridColumn: 'auto',
                          justifySelf: 'center' 
                        };
                        setLocalLayoutSettings(newSettings);
                        updateField(newSettings);
                      }}
                      className="px-3 py-2 text-xs bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg border border-primary-200 transition-all duration-200 font-medium"
                    >
                      Centered
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Page Break Title - Only for page-break type */}
            {selectedField.type === 'page-break' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Step Title
                </label>
                <Input
value={selectedField.stepTitle || ''}
                  onChange={(e) => updateField({ stepTitle: e.target.value })}
                  placeholder="Enter step title (optional)"
                  className="w-full"
                  tabIndex={0}
                />
                <p className="text-xs text-gray-500">
                  Optional title for this step in the multi-step form
                </p>
              </div>
            )}

            {/* Help Text Input - Only for non-page-break fields */}
            {selectedField.type !== 'page-break' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Help Text
                </label>
<Input
                  value={localHelpText}
                  onChange={(e) => handleHelpTextChange(e.target.value)}
                  placeholder="Enter help text for users"
                  className="w-full"
                  tabIndex={0}
                />
                <p className="text-xs text-gray-500">
                  Additional guidance or instructions for this field
                </p>
              </div>
            )}

            {/* Required Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localRequired}
                  onChange={(e) => handleRequiredChange(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  tabIndex={0}
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Required Field</span>
                  <p className="text-xs text-gray-500">Users must fill this field</p>
                </div>
              </label>
            </div>

            {/* Show/Hide Logic Section */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ApperIcon name="Eye" size={16} className="text-gray-600" />
                Show/Hide Logic
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableCondition"
                    checked={localShowCondition.enabled}
                    onChange={(e) => handleShowConditionChange({ enabled: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                    tabIndex={0}
                  />
                  <label htmlFor="enableCondition" className="text-sm text-gray-700 cursor-pointer">
                    Enable conditional display
                  </label>
                </div>

                {localShowCondition.enabled && (
<div className="bg-gradient-to-br from-gray-50/60 to-white/40 backdrop-blur-xl p-6 rounded-2xl border-2 border-white/40 space-y-6 shadow-2xl glass-card texture-glass animate-float hover:shadow-3xl transition-all duration-300">
                    <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <ApperIcon name="Eye" size={16} className="text-primary-600" />
                      Show this field only when:
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                          <ApperIcon name="Target" size={14} className="text-gray-500" />
                          Field
                        </label>
                        <select
                          value={localShowCondition.fieldId}
                          onChange={(e) => handleShowConditionChange({ 
                            fieldId: e.target.value,
                            value: '' // Reset value when field changes
                          })}
                          className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                          tabIndex={0}
                        >
                          <option value="">Select field...</option>
                          {availableFields.map(field => (
                            <option key={field.Id} value={field.Id}>
                              {field.label || 'Untitled Field'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                          <ApperIcon name="GitBranch" size={14} className="text-gray-500" />
                          Condition
                        </label>
                        <select
                          value={localShowCondition.operator}
                          onChange={(e) => handleShowConditionChange({ operator: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                          tabIndex={0}
                        >
                          <option value="equals">equals</option>
                          <option value="not_equals">does not equal</option>
                          <option value="contains">contains</option>
                          <option value="is_empty">is empty</option>
                          <option value="is_not_empty">is not empty</option>
                        </select>
                      </div>

                      {localShowCondition.operator !== 'is_empty' && localShowCondition.operator !== 'is_not_empty' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                            <ApperIcon name="Type" size={14} className="text-gray-500" />
                            Value
                          </label>
                          {localShowCondition.fieldId && getFieldOptions(localShowCondition.fieldId).length > 0 ? (
                            <select
                              value={localShowCondition.value}
                              onChange={(e) => handleShowConditionChange({ value: e.target.value })}
                              className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900"
                              tabIndex={0}
                            >
                              <option value="">Select value...</option>
                              {getFieldOptions(localShowCondition.fieldId).map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              value={localShowCondition.value}
                              onChange={(e) => handleShowConditionChange({ value: e.target.value })}
                              placeholder="Enter value..."
                              className="text-sm border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl px-5 py-4 hover:bg-white/40"
                              tabIndex={0}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {localShowCondition.fieldId && (
                      <div className="text-sm text-gray-700 bg-gradient-to-br from-white/50 to-gray-50/40 backdrop-blur-xl p-4 rounded-2xl border-2 border-white/40 shadow-lg glass-card texture-glass">
                        <div className="flex items-start gap-3">
                          <ApperIcon name="Info" size={16} className="text-primary-600 mt-0.5" />
                          <div>
                            <strong className="font-semibold">Preview:</strong> This field will be shown when "
                            {fields.find(f => f.Id === localShowCondition.fieldId)?.label || 'Selected field'}" 
                            {' '}{localShowCondition.operator === 'equals' ? 'equals' : 
                                 localShowCondition.operator === 'not_equals' ? 'does not equal' :
                                 localShowCondition.operator === 'contains' ? 'contains' :
                                 localShowCondition.operator === 'is_empty' ? 'is empty' : 'is not empty'}
                            {(localShowCondition.operator !== 'is_empty' && localShowCondition.operator !== 'is_not_empty') && 
                              ` "${localShowCondition.value || '[value]'}"`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Field Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={duplicateField}
                className="w-full justify-center focus:ring-2 focus:ring-primary-500"
                tabIndex={0}
              >
                <ApperIcon name="Copy" size={16} className="mr-2 text-gray-600" />
                Duplicate Field
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteField}
                className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
                tabIndex={0}
              >
                <ApperIcon name="Trash2" size={16} className="mr-2 text-red-500" />
                Delete Field
              </Button>
            </div>
          </div>
          ) : (
<div className="p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100/60 to-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                  <ApperIcon name="Settings" size={28} className="text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Field Selected
                  </h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Click on a field in the canvas to edit its properties and customize its behavior
                  </p>
                </div>
              </div>
            </div>
          )
        ) : (
          // Form Settings Tab
<div className="p-6 space-y-8">
            {/* Thank You Page Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <ApperIcon name="Heart" size={16} className="text-pink-500" />
                Thank You Page
              </h3>
              
              <div className="space-y-4">
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
<div className="space-y-4 bg-gradient-to-br from-gray-50/40 to-white/30 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-lg glass-card texture-glass animate-float">
                    {/* Custom Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thank You Message
                      </label>
<textarea
                        value={thankYouSettings?.message || "Thank you for your submission! We'll get back to you soon."}
                        onChange={(e) => onThankYouSettingsChange?.({
                          ...thankYouSettings,
                          message: e.target.value
                        })}
                        className="w-full px-4 py-3 border border-white/30 bg-white/20 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 texture-glass micro-glow"
                        rows={4}
                        placeholder="Enter your custom thank you message"
                        tabIndex={0}
                      />
                    </div>

                    {/* Redirect URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Redirect URL (Optional)
                      </label>
<Input
                        value={thankYouSettings?.redirectUrl || ""}
                        onChange={(e) => onThankYouSettingsChange?.({
                          ...thankYouSettings,
                          redirectUrl: e.target.value
                        })}
                        placeholder="https://example.com/success"
                        className="w-full backdrop-blur-sm"
                        tabIndex={0}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Users will be redirected here after 2 seconds
                      </p>
                    </div>

                    {/* Show Create Form Button */}
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

                {/* Preview */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
<div className="bg-gradient-to-br from-white/40 to-gray-50/30 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center shadow-lg glass-card texture-glass animate-float">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="CheckCircle" size={24} className="text-success" />
                    </div>
                    <h4 className="text-lg font-display font-bold text-gray-900 mb-2">
                      Thank you!
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
{thankYouSettings?.useCustom 
                        ? (thankYouSettings.message || "Thank you for your submission! We'll get back to you soon.")
                        : "Thank you for your submission! We'll get back to you soon."
                      }
                    </p>
                    
                    {thankYouSettings?.useCustom && thankYouSettings.redirectUrl && (
                      <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800 flex items-center justify-center gap-1">
                        <ApperIcon name="Clock" size={12} className="text-gray-500" />
                        Redirecting in 2 seconds...
                      </div>
                    )}
                    
                    {(!thankYouSettings?.useCustom || thankYouSettings?.showCreateFormButton !== false) && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm">
                        Create Your Own Form
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Settings */}
            {notificationSettings && onNotificationSettingsChange && (
<div className="border-t-2 border-white/30 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Bell" size={16} className="text-white" />
                  </div>
                  Email Notifications
                </h3>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-white/40 to-gray-50/30 rounded-2xl border border-white/30">
                    <input
                      type="checkbox"
                      id="enableNotifications"
                      checked={notificationSettings?.enabled || false}
                      onChange={(e) => onNotificationSettingsChange?.({
                        ...notificationSettings,
                        enabled: e.target.checked
                      })}
                      className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 transition-all duration-300"
                      tabIndex={0}
                    />
                    <label htmlFor="enableNotifications" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Send email notifications when form is submitted
                    </label>
                  </div>

                  {notificationSettings?.enabled && (
                    <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/30">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <ApperIcon name="Mail" size={16} className="text-blue-600" />
                        Recipients
                      </label>
                      <textarea
                        value={(notificationSettings?.recipients || []).join('\n')}
                        onChange={(e) => onNotificationSettingsChange?.({
                          ...notificationSettings,
                          recipients: e.target.value.split('\n').filter(email => email.trim())
                        })}
                        className="w-full px-5 py-4 border-2 border-white/40 bg-white/30 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/60 transition-all duration-400 texture-glass micro-glow hover:bg-white/40 text-gray-900 placeholder-gray-600"
                        rows={5}
                        placeholder="Enter email addresses, one per line"
                        tabIndex={0}
                      />
                      <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                        <ApperIcon name="Info" size={12} className="text-gray-500" />
                        These recipients will be notified when someone submits the form
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
<div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Select fields to customize labels, placeholders, and validation
        </div>
      </div>
    </div>
  );
};

export default FieldPropertiesPanel;