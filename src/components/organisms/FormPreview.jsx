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

switch (field.type) {
      case "text":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "email":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "phone":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "number":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              min={field.min}
              max={field.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "date":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "file":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept={field.acceptedTypes}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "textarea":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              {...commonProps}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "select":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...commonProps}
            >
              <option value="">{field.placeholder || "Select an option"}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "radio":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`field-${field.Id}`}
                    value={option}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    {...commonProps}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "checkbox":
        return (
          <div className="field-wrapper">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...commonProps}
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
            </label>
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case "rating":
        return (
          <div className="field-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-1">
              {Array.from({ length: field.maxRating || 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400 transition-colors"
                  onMouseEnter={(e) => {
                    const stars = e.currentTarget.parentElement.children;
                    for (let i = 0; i <= index; i++) {
                      stars[i].classList.add('text-yellow-400');
                      stars[i].classList.remove('text-gray-300');
                    }
                    for (let i = index + 1; i < stars.length; i++) {
                      stars[i].classList.remove('text-yellow-400');
                      stars[i].classList.add('text-gray-300');
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stars = e.currentTarget.parentElement.children;
                    for (let i = 0; i < stars.length; i++) {
                      stars[i].classList.remove('text-yellow-400');
                      stars[i].classList.add('text-gray-300');
                    }
                  }}
                >
                  <ApperIcon name="Star" className="w-6 h-6" />
                </button>
              ))}
            </div>
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 overflow-y-auto custom-scrollbar max-h-[90vh]">
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
            {fields.map(renderField)}
            
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium py-4 px-6 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto custom-scrollbar">
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
            {fields.map(renderField)}
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium py-3 px-4 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200"
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