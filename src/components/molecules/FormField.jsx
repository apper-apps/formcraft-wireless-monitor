import React from "react";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  required, 
  error, 
  options = [], 
  min, 
  max, 
  step, 
  acceptedTypes, 
  allowMultiple,
  helpText 
}) => {
  const renderInput = () => {
const baseClasses = cn(
      "w-full px-4 py-3 border rounded-lg transition-colors duration-200",
      "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
      "hover:border-gray-400",
      "min-h-[44px]", // Touch-friendly minimum height
      error 
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500" 
        : "border-gray-300 bg-white focus:border-blue-500",
      "disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
    );

    // Date and Time inputs
    if (['date', 'time', 'datetime-local', 'week', 'month'].includes(type)) {
      return (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={baseClasses}
        />
      );
    }

    // Dropdown/Select
    if (type === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // Radio buttons
    if (type === 'radio' && options.length > 0) {
      return (
        <div className="space-y-3">
          {options.map((option, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
                required={required}
className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 transition-colors duration-200"
              />
<span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                {option}
              </span>
            </label>
          ))}
        </div>
      );
    }

    // Checkbox
    if (type === 'checkbox') {
      return (
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value === true || value === 'true'}
            onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
            required={required}
className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200"
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
            {label}
          </span>
        </label>
      );
    }

    // Textarea
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={baseClasses}
        />
      );
    }

    // File upload
    if (type === 'file') {
      return (
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          accept={acceptedTypes}
          multiple={allowMultiple}
required={required}
          className={cn(baseClasses, "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100")}
        />
      );
    }

    // Number input
    if (type === 'number') {
      return (
        <input
          type="number"
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={baseClasses}
        />
      );
    }

    // Range/Slider input
    if (type === 'range' || type === 'slider') {
      return (
        <div className="space-y-2">
          <input
            type="range"
            id={name}
            name={name}
            value={value || min || 0}
            onChange={onChange}
            required={required}
            min={min || 0}
            max={max || 100}
            step={step || 1}
className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{min || 0}</span>
            <span className="font-medium text-gray-700">{value || min || 0}</span>
            <span>{max || 100}</span>
          </div>
        </div>
      );
    }

    // URL input
    if (type === 'url') {
      return (
        <input
          type="url"
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder || "https://example.com"}
          required={required}
          className={baseClasses}
        />
      );
    }

    // Phone/Tel input
    if (type === 'phone' || type === 'tel') {
      return (
        <input
          type="tel"
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder || "+1 (555) 000-0000"}
          required={required}
          className={baseClasses}
        />
      );
    }

    // Default text-based inputs (text, email, password, etc.)
    return (
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={baseClasses}
      />
    );
  };

  return (
    <div className="space-y-2">
      {label && type !== 'checkbox' && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helpText && (
        <p className="mt-2 text-sm text-gray-600">{helpText}</p>
      )}
{error && (
        <p className="mt-2 text-sm font-medium text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;