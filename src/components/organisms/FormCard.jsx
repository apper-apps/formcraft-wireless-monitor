import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ResponsesAnalytics from "./ResponsesAnalytics";
import { formService } from "@/services/api/formService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const FormCard = ({ form, onEdit, onDelete, onDuplicate, onViewResponses }) => {
  const navigate = useNavigate();
const isPublished = form.isPublished || false;
  const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0;
  const submissionCount = form.submissionCount || 0;
  const [activeTab, setActiveTab] = React.useState('overview');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 hover:border-primary-200 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
<h3 
              className="text-lg font-display font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors cursor-pointer"
              onClick={() => onEdit(form)}
            >
              {form.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
<ApperIcon name="Calendar" className="w-4 h-4" />
                {form.created_at_c && !isNaN(new Date(form.created_at_c)) 
                  ? format(new Date(form.created_at_c), "MMM d, yyyy")
                  : form.createdAt && !isNaN(new Date(form.createdAt)) 
                    ? format(new Date(form.createdAt), "MMM d, yyyy")
                    : 'Date not available'
                }
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ApperIcon name="FormInput" className="w-4 h-4" />
                  {fieldCount} field{fieldCount !== 1 ? "s" : ""}
                </div>
                {form.isPublished && (
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Send" className="w-4 h-4 text-success" />
                    {submissionCount} response{submissionCount !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        {fieldCount > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Fields:</p>
            <div className="flex flex-wrap gap-1">
{Array.isArray(form.fields) && form.fields.slice(0, 3).map((field, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-md"
                >
                  {field.label || 'Untitled Field'}
                </span>
              ))}
              {fieldCount > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-500 rounded-md">
                  +{fieldCount - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-100 pt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          {form.isPublished && (
            <button
              onClick={() => setActiveTab('responses')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'responses'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Responses ({submissionCount})
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {activeTab === 'overview' && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(form)}
                className="flex-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              >
                <ApperIcon name="Edit3" className="w-4 h-4 mr-2" />
                Edit
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(form)}
                className="flex-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              
<Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(form.Id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          )}

{activeTab === 'responses' && (
            <ResponsesAnalytics 
              form={form} 
              submissionCount={submissionCount}
              onViewResponses={onViewResponses}
            />
          )}

{form.isPublished && activeTab === 'overview' && (
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (form.publishId || form.publishUrl) {
                    const url = form.publishUrl || `/form/${form.publishId}`;
                    window.open(url, '_blank');
                  } else {
                    toast.error('Form URL is not available');
                  }
                }}
                className="flex-1 text-success hover:text-success-dark hover:bg-success-light"
              >
                <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
                View Form
              </Button>
              
<Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const htmlCode = form.htmlCode || form.html_code_c;
                  if (htmlCode && htmlCode.trim()) {
                    navigator.clipboard.writeText(htmlCode);
                    toast.success('HTML code copied to clipboard!');
                  } else {
                    toast.error('HTML code is not available for this form');
                  }
                }}
                className="flex-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              >
                <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                Copy HTML
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default FormCard;