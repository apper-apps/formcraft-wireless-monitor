import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FormPreview = ({ fields, formName, isModal = false, onCloseModal }) => {
  const renderField = (field) => {
    const commonProps = {
      key: field.Id,
      name: `field_${field.Id}`,
      placeholder: field.placeholder,
      required: field.required
    };

const baseInputClasses = "w-full px-4 py-3 border border-white/30 bg-white/20 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 hover:bg-white/30";
    
    // Get column span class for field layout
    const getColumnSpanClass = (columnSpan) => {
      switch (columnSpan) {
        case 2: return 'col-span-2';
        case 3: return 'col-span-3';
        default: return 'col-span-1';
      }
    };

    const getLayoutWidthClass = (layoutWidth) => {
      switch (layoutWidth) {
        case 'half': return 'w-1/2';
        case 'third': return 'w-1/3';
        case 'quarter': return 'w-1/4';
        default: return 'w-full';
      }
    };

    switch (field.type) {
      // Basic Input Fields
      case "text":
      case "email":
      case "tel":
      case "url":
      case "password":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              className={baseInputClasses}
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "number":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              min={field.min}
              max={field.max}
              className={baseInputClasses}
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "currency":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-600 text-sm">
                {field.currencySymbol || '$'}
              </span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                step="0.01"
                className={`${baseInputClasses} pl-8`}
                {...commonProps}
              />
            </div>
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "textarea":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className={`${baseInputClasses} resize-none`}
              rows={4}
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      // Date & Time Fields
      case "date":
      case "time":
      case "datetime-local":
      case "week":
      case "month":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              className={baseInputClasses}
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      // Selection Fields
      case "select":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              className={`${baseInputClasses} appearance-none`}
              {...commonProps}
            >
              <option value="">{field.placeholder || "Select an option"}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "radio":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-3">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer">
                  <input
                    type="radio"
                    name={`field-${field.Id}`}
                    value={option}
                    className="w-4 h-4 text-primary-600 border-white/40 focus:ring-primary-500/50 bg-white/20"
                  />
                  <span className="text-sm text-gray-800">{option}</span>
                </label>
              ))}
            </div>
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "checkbox":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-white/40 text-primary-600 focus:ring-primary-500/50 bg-white/20"
                {...commonProps}
              />
              <span className="text-sm font-medium text-gray-800">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
            </label>
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      // Advanced Fields
      case "slider":
      case "range":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <input
                type="range"
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 1}
                defaultValue={field.defaultValue || field.min || 0}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                {...commonProps}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{field.min || 0}</span>
                <span>{field.max || 100}</span>
              </div>
            </div>
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "color":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="color"
              className="w-full h-12 border border-white/30 bg-white/20 backdrop-blur-sm rounded-xl cursor-pointer"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "file":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept={field.acceptedTypes}
              multiple={field.allowMultiple}
              className={`${baseInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-primary-100/60 file:to-accent-100/40 file:backdrop-blur-sm file:text-primary-700 hover:file:from-primary-200/60 hover:file:to-accent-200/40 file:transition-all file:duration-300`}
              {...commonProps}
            />
            {field.maxFileSize && (
              <p className="text-xs text-gray-500 mt-1">Max file size: {field.maxFileSize}MB</p>
            )}
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      case "rating":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-2 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              {Array.from({ length: field.maxRating || 5 }, (_, index) => (
                <button
                  key={`${field.Id}-star-${index}`}
                  type="button"
                  className="text-gray-400 hover:text-yellow-400 focus:text-yellow-400 transition-all duration-300 transform hover:scale-110"
                  onMouseEnter={(e) => {
                    const stars = e.currentTarget.parentElement.children;
                    for (let i = 0; i <= index; i++) {
                      stars[i].classList.add('text-yellow-400');
                      stars[i].classList.remove('text-gray-400');
                    }
                    for (let i = index + 1; i < stars.length; i++) {
                      stars[i].classList.remove('text-yellow-400');
                      stars[i].classList.add('text-gray-400');
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stars = e.currentTarget.parentElement.children;
                    for (let i = 0; i < stars.length; i++) {
                      stars[i].classList.remove('text-yellow-400');
                      stars[i].classList.add('text-gray-400');
                    }
                  }}
                >
                  <ApperIcon name="Star" className="w-7 h-7" />
                </button>
              ))}
            </div>
            {field.helpText && <p className="text-xs text-gray-600 mt-2">{field.helpText}</p>}
          </div>
        );

      // Content Fields
      case "heading":
        const HeadingTag = field.headingLevel || 'h2';
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <HeadingTag 
              className={`font-bold text-gray-900 ${
                HeadingTag === 'h1' ? 'text-3xl' :
                HeadingTag === 'h2' ? 'text-2xl' :
                HeadingTag === 'h3' ? 'text-xl' :
                HeadingTag === 'h4' ? 'text-lg' :
                HeadingTag === 'h5' ? 'text-base' : 'text-sm'
              } text-${field.textAlign || 'left'}`}
            >
              {field.headingText || 'Heading Text'}
            </HeadingTag>
          </div>
        );

      case "paragraph":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <p className={`text-gray-700 leading-relaxed text-${field.textAlign || 'left'}`}>
              {field.paragraphText || 'Paragraph text content'}
            </p>
          </div>
        );

      case "divider":
        return (
          <div className="field-wrapper mb-6 w-full">
            <hr className={`border-t ${
              field.dividerStyle === 'dashed' ? 'border-dashed' :
              field.dividerStyle === 'dotted' ? 'border-dotted' : 'border-solid'
            }`} style={{ borderColor: field.dividerColor || '#e5e7eb' }} />
          </div>
        );

      case "image":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            {field.imageUrl ? (
              <img
                src={field.imageUrl}
                alt={field.altText || 'Form image'}
                className="rounded-lg"
                style={{ 
                  width: field.imageWidth || 'auto',
                  height: field.imageHeight || 'auto',
                  maxWidth: '100%'
                }}
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Image" size={32} className="text-gray-400" />
              </div>
            )}
          </div>
        );

      case "html":
        return (
          <div className={`field-wrapper mb-6 ${getLayoutWidthClass(field.layoutWidth)}`}>
            <div 
              dangerouslySetInnerHTML={{ 
                __html: field.htmlContent || '<p>HTML content will appear here</p>' 
              }}
              className="prose prose-sm max-w-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isModal) {
      alert('This is a preview mode. Form submission is disabled.');
    }
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape' && isModal && onCloseModal) {
      onCloseModal();
    }
  };

  const modalContent = (
<div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white/40 to-gray-50/30 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl p-8 overflow-y-auto custom-scrollbar max-h-[90vh]" style={{boxShadow: '0 30px 60px rgba(139, 92, 246, 0.2), 0 0 80px rgba(0, 212, 255, 0.1)'}}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ApperIcon name="Eye" className="w-6 h-6 text-primary-600" />
          <h3 className="text-2xl font-display font-bold text-gray-900">
            Live Preview
          </h3>
        </div>
        <button
          onClick={onCloseModal}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="X" className="w-6 h-6" />
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ApperIcon name="FileText" className="w-16 h-16 mx-auto mb-6" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No fields added yet</h4>
          <p className="text-sm">Add some fields to your form to see the preview</p>
        </div>
      ) : (
        <motion.div
          className="form-preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-8 text-center">
            {formName || "Untitled Form"}
          </h2>
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
{fields.map((field, index) => (
  <div key={field.Id}>{renderField(field, index, field.Id)}</div>
))}
            
            <div className="pt-6 border-t border-gray-200">
<button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 hover:from-primary-400 hover:via-primary-300 hover:to-accent-400 text-white font-bold py-4 px-6 rounded-xl backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                style={{boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3), 0 0 40px rgba(0, 212, 255, 0.2)'}}
              >
                Submit Form (Preview Mode)
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                This is a preview - form submission is disabled
              </p>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );

  const sidebarContent = (
<div className="w-80 bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl border-l border-white/20 p-6 overflow-y-auto custom-scrollbar shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="Eye" className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-display font-bold text-gray-900">
          Live Preview
        </h3>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ApperIcon name="FileText" className="w-12 h-12 mx-auto mb-4" />
          <p className="text-sm">Preview will appear here</p>
        </div>
      ) : (
        <motion.div
          className="form-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
            {formName || "Untitled Form"}
          </h2>
          
          <form className="space-y-4" onSubmit={handleFormSubmit}>
{fields.map((field, index) => (
  <div key={field.Id}>{renderField(field, index, field.Id)}</div>
))}
            
            <div className="pt-4 border-t border-gray-200">
<button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 hover:from-primary-400 hover:via-primary-300 hover:to-accent-400 text-white font-bold py-3 px-4 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Submit Form
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget && onCloseModal) {
            onCloseModal();
          }
        }}
        onKeyDown={handleModalKeyDown}
        tabIndex={-1}
      >
        {modalContent}
      </div>
    );
  }

  return sidebarContent;
};

export default FormPreview;