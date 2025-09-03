import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ResponsesAnalytics from "./ResponsesAnalytics";
import { formService } from "@/services/api/formService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { copyToClipboard } from "@/utils/cn";
import Card from "@/components/atoms/Card";

const FormCard = ({ form, onEdit, onDelete, onDuplicate, onViewResponses }) => {
  const navigate = useNavigate();
const isPublished = form.isPublished || false;
  const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0;
  const submissionCount = form.submissionCount || 0;
  const [activeTab, setActiveTab] = React.useState('overview');
  const [copyingHtml, setCopyingHtml] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
<Card variant="elevated" className="p-8 hover:border-primary-200 group hover:shadow-2xl">
<div className="flex items-start justify-between mb-6">
          <div className="flex-1">
<h3 
              className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors cursor-pointer"
              onClick={() => onEdit(form)}
            >
              {form.name}
            </h3>
<div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {form.created_at_c && !isNaN(new Date(form.created_at_c)) 
                    ? format(new Date(form.created_at_c), "MMM d, yyyy")
                    : form.createdAt && !isNaN(new Date(form.createdAt)) 
                      ? format(new Date(form.createdAt), "MMM d, yyyy")
                      : 'Date not available'
                  }
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="FormInput" className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{fieldCount} field{fieldCount !== 1 ? "s" : ""}</span>
                </div>
                {form.isPublished && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Send" className="w-4 h-4 text-success" />
                    <span className="font-medium text-success">{submissionCount} response{submissionCount !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
            {form.isPublished && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                Published
              </div>
            )}
          </div>
          
<div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <ApperIcon name="FileText" className="w-7 h-7 text-primary-600" />
          </div>
        </div>

        {fieldCount > 0 && (
<div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Fields:</p>
<div className="flex flex-wrap gap-2">
              {Array.isArray(form.fields) && form.fields.slice(0, 3).map((field, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded-lg transition-colors"
                >
                  {field.label || 'Untitled Field'}
                </span>
              ))}
              {fieldCount > 3 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-xs font-medium text-primary-700 rounded-lg">
                  +{fieldCount - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
<div className="flex border-b border-gray-200 pt-6">
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
<div className="pt-5">
          {activeTab === 'overview' && (
<div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(form)}
                className="flex-1 shadow-md hover:shadow-lg"
              >
                <ApperIcon name="Edit3" className="w-4 h-4 mr-2" />
                Edit
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(form)}
                className="flex-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
              >
                <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(form.Id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
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
            <div className="flex gap-3 pt-5 border-t border-gray-200">
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  if (form.publishId || form.publishUrl) {
                    const url = form.publishUrl || `/form/${form.publishId}`;
                    window.open(url, '_blank');
                  } else {
                    toast.error('Form URL is not available');
                  }
                }}
                className="flex-1 shadow-md hover:shadow-lg"
              >
                <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
                View Form
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const htmlCode = form.htmlCode || form.html_code_c;
                  if (htmlCode && htmlCode.trim()) {
                    setCopyingHtml(true);
                    await copyToClipboard(htmlCode, 'HTML code');
                    setTimeout(() => setCopyingHtml(false), 1000);
                  } else {
                    toast.error('HTML code is not available for this form');
                  }
                }}
                disabled={copyingHtml}
                className="flex-1 disabled:opacity-50"
              >
                <ApperIcon 
                  name={copyingHtml ? "Loader2" : "Copy"} 
                  className={`w-4 h-4 mr-2 ${copyingHtml ? "animate-spin" : ""}`} 
                />
                {copyingHtml ? 'Copying...' : 'Copy HTML'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default FormCard;