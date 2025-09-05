import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const FieldLibrary = () => {
  const fieldTypes = [
// Basic Input Fields
    {
      type: "text",
      label: "Text Input",
      icon: "Type",
      description: "Single line text field",
      placeholder: "Enter text...",
      category: "input"
    },
    {
      type: "email",
      label: "Email",
      icon: "Mail",
      description: "Email address field",
      placeholder: "Enter email address...",
      category: "input"
    },
    {
      type: "number",
      label: "Number",
      icon: "Hash",
      description: "Numeric input field",
      placeholder: "Enter number...",
      category: "input"
    },
    {
      type: "tel",
      label: "Phone",
      icon: "Phone",
      description: "Phone number field",
      placeholder: "Enter phone number...",
      category: "input"
    },
    {
      type: "url",
      label: "Website URL",
      icon: "Link",
      description: "Website URL field",
      placeholder: "https://...",
      category: "input"
    },
    {
      type: "password",
      label: "Password",
      icon: "Lock",
      description: "Password input field",
      placeholder: "Enter password...",
      category: "input"
    },
    {
      type: "textarea",
      label: "Long Text",
      icon: "FileText",
      description: "Multi-line text area",
      placeholder: "Enter detailed text...",
      category: "input"
    },
    
    // Selection Fields
    {
      type: "select",
      label: "Dropdown",
      icon: "ChevronDown",
      description: "Single choice dropdown",
      options: ["Option 1", "Option 2", "Option 3"],
      category: "choice"
    },
    {
      type: "radio",
      label: "Multiple Choice",
      icon: "Circle",
      description: "Radio button group",
      options: ["Choice A", "Choice B", "Choice C"],
      category: "choice"
    },
    {
      type: "checkbox",
      label: "Checkbox",
      icon: "Square",
      description: "Single checkbox field",
      category: "choice"
    },
    
    // Date & Time Fields
    {
      type: "date",
      label: "Date",
      icon: "Calendar",
      description: "Date picker field",
      category: "datetime"
    },
    {
      type: "time",
      label: "Time",
      icon: "Clock",
      description: "Time picker field",
      category: "datetime"
    },
    {
      type: "datetime-local",
      label: "Date & Time",
      icon: "CalendarClock",
      description: "Combined date and time picker",
      category: "datetime"
    },
    {
      type: "week",
      label: "Week",
      icon: "Calendar",
      description: "Week picker field",
      category: "datetime"
    },
    {
      type: "month",
      label: "Month",
      icon: "Calendar",
      description: "Month picker field",
      category: "datetime"
    },
    
    // Advanced Input Fields
    {
      type: "currency",
      label: "Currency",
      icon: "DollarSign",
      description: "Currency input field",
      placeholder: "0.00",
      category: "advanced"
    },
    {
      type: "slider",
      label: "Slider",
      icon: "Sliders",
      description: "Range slider input",
      min: 0,
      max: 100,
      category: "advanced"
    },
    {
      type: "range",
      label: "Range",
      icon: "Sliders",
      description: "Range input field",
      min: 0,
      max: 100,
      category: "advanced"
    },
    {
      type: "color",
      label: "Color Picker",
      icon: "Palette",
      description: "Color selection field",
      category: "advanced"
    },
    {
      type: "file",
      label: "File Upload",
      icon: "Upload",
      description: "File upload field",
      acceptedTypes: ".pdf,.doc,.docx,.jpg,.png",
      category: "advanced"
    },
    {
      type: "rating",
      label: "Rating",
      icon: "Star",
      description: "Star rating field",
      maxRating: 5,
      category: "advanced"
    },
    
    // Content & Layout Fields
    {
      type: "heading",
      label: "Heading",
      icon: "Heading",
      description: "Section heading",
      headingText: "Section Title",
      headingLevel: "h2",
      category: "content"
    },
    {
      type: "paragraph",
      label: "Paragraph",
      icon: "AlignLeft",
      description: "Text paragraph",
      paragraphText: "Add descriptive text here.",
      category: "content"
    },
    {
      type: "divider",
      label: "Divider",
      icon: "Minus",
      description: "Visual separator line",
      category: "content"
    },
    {
      type: "image",
      label: "Image",
      icon: "Image",
      description: "Display image",
      category: "content"
    },
    {
      type: "html",
      label: "HTML Content",
      icon: "Code",
      description: "Custom HTML content",
      htmlContent: "<p>Custom HTML content</p>",
      category: "content"
    },
    {
      type: "page-break",
      label: "Page Break",
      icon: "SeparatorHorizontal",
      description: "Multi-step form separator",
      stepTitle: "Next Step",
      category: "layout"
    },
  ];

const handleDragStart = (e, field) => {
    // Set drag data
    e.dataTransfer.setData("application/json", JSON.stringify(field));
    e.dataTransfer.effectAllowed = "copy";
    
    // Create enhanced drag preview
    const sourceElement = e.currentTarget;
    const dragPreview = sourceElement.cloneNode(true);
    
    // Style the drag preview for better visual feedback
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.left = '-1000px';
    dragPreview.style.width = `${sourceElement.offsetWidth}px`;
    dragPreview.style.transform = 'rotate(1deg) scale(1.05)';
    dragPreview.style.opacity = '0.95';
    dragPreview.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.4)';
    dragPreview.style.border = '2px solid rgba(139, 92, 246, 0.6)';
    dragPreview.style.borderRadius = '12px';
    dragPreview.style.pointerEvents = 'none';
    dragPreview.style.zIndex = '9999';
    dragPreview.style.background = 'linear-gradient(135deg, #f4f2ff 0%, #ebe7ff 100%)';
    document.body.appendChild(dragPreview);
    
    // Set drag image with proper positioning
    const rect = sourceElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setDragImage(dragPreview, offsetX, offsetY);
    
    // Add dragging class to source element
    sourceElement.classList.add('dragging');
    
    // Clean up preview after drag starts
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 1);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
<div className="field-library bg-gray-50 border-r border-gray-200 p-5 flex flex-col h-full">
      <h3 className="text-lg font-display font-bold text-gray-900 mb-6">
        Field Library
      </h3>
<div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {fieldTypes.map((field, index) => (
<motion.div
            key={field.type}
className="field-item p-4 m-2 select-none group relative transition-all duration-200 rounded-lg border border-gray-200 hover:border-blue-300 bg-white hover:shadow-md"
            draggable
            onDragStart={(e) => handleDragStart(e, field)}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            style={{ cursor: 'grab' }}
            onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
            onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
          >
{/* Enhanced drag handle indicator */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="p-1 rounded-md bg-gray-100 border border-gray-300">
                <ApperIcon name="GripVertical" size={16} className="text-gray-500" />
              </div>
            </div>
            
<div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200">
                <ApperIcon name={field.icon} className="w-5 h-5 text-blue-600" />
</div>
              <div className="flex-1 min-w-0">
<h4 className="font-medium text-gray-900 truncate text-sm">
{field.label}
</h4>
                <p className="text-xs text-surface-700 truncate leading-relaxed">
                  {field.description}
                </p>
              </div>
<ApperIcon name="Plus" className="w-4 h-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 mx-2">
        <div className="flex items-center gap-2 mb-3">
          <ApperIcon name="Info" className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-900 text-sm">How to use</h4>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          Drag fields from this library onto the form canvas to build your form. 
          Click on fields in the canvas to edit their properties.
        </p>
      </div>
    </div>
  );
};

export default FieldLibrary;