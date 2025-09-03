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
<Card variant="elevated" className="p-8 hover:border-indigo-300 group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100">
<div className="flex items-start justify-between mb-6">
<div className="flex-1">
            <h3 
              className="text-2xl font-display font-black text-gray-900 mb-4 group-hover:text-indigo-700 transition-colors cursor-pointer leading-tight"
              onClick={() => onEdit(form)}
            >
              {form.name}
            </h3>
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
<ApperIcon name="Calendar" size={16} className="text-gray-500" />
                <span className="font-semibold">
                  {form.created_at_c && !isNaN(new Date(form.created_at_c)) 
                    ? format(new Date(form.created_at_c), "MMM d, yyyy")
                    : form.createdAt && !isNaN(new Date(form.createdAt)) 
                      ? format(new Date(form.createdAt), "MMM d, yyyy")
                      : 'Date not available'
                  }
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
<ApperIcon name="FormInput" size={16} className="text-gray-500" />
                  <span className="font-semibold">{fieldCount} field{fieldCount !== 1 ? "s" : ""}</span>
                </div>
                {form.isPublished && (
                  <div className="flex items-center gap-2">
<ApperIcon name="Send" size={16} className="text-emerald-500" />
                    <span className="font-semibold text-emerald-600">{submissionCount} response{submissionCount !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
            {form.isPublished && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-sm font-bold rounded-full border border-emerald-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Live & Published
              </div>
            )}
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 via-indigo-300 to-purple-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
<ApperIcon name="FileText" size={32} className="text-indigo-700" />
          </div>
        </div>

        {fieldCount > 0 && (
<div className="mb-8">
            <p className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wide">Form Fields:</p>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(form.fields) && form.fields.slice(0, 3).map((field, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-sm font-bold text-gray-800 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200"
                >
                  {field.label || 'Untitled Field'}
                </span>
              ))}
              {fieldCount > 3 && (
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-sm font-bold text-indigo-700 rounded-xl shadow-md border border-indigo-200">
                  +{fieldCount - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
<div className="flex border-b-2 border-gray-200 pt-8 mb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-bold transition-all duration-300 rounded-t-xl ${
                activeTab === 'overview'
                  ? 'text-indigo-700 border-b-4 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            {form.isPublished && (
              <button
                onClick={() => setActiveTab('responses')}
                className={`px-6 py-3 text-sm font-bold transition-all duration-300 rounded-t-xl ${
                  activeTab === 'responses'
                    ? 'text-indigo-700 border-b-4 border-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                Responses ({submissionCount})
              </button>
            )}
          </div>

        {/* Tab Content */}
<div className="pt-5">
          {activeTab === 'overview' && (
<div className="flex gap-4 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => onEdit(form)}
                className="flex-1 shadow-xl hover:shadow-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
              >
<ApperIcon name="Edit3" size={20} className="mr-2 text-white" />
                Edit Form
              </Button>
              
              <Button
                variant="secondary"
                size="md"
                onClick={() => onDuplicate(form)}
                className="flex-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
<ApperIcon name="Copy" size={20} className="mr-2 text-gray-700" />
                Duplicate
              </Button>
              
              <Button
                variant="ghost"
                size="md"
                onClick={() => onDelete(form.Id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
<ApperIcon name="Trash2" size={20} className="text-red-600" />
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
<div className="flex gap-4 pt-6 border-t-2 border-gray-200 mt-4">
              <Button
                variant="success"
                size="md"
                onClick={() => {
                  if (form.publishId || form.publishUrl) {
                    const url = form.publishUrl || `/form/${form.publishId}`;
                    window.open(url, '_blank');
                  } else {
                    toast.error('Form URL is not available');
                  }
                }}
                className="flex-1 shadow-xl hover:shadow-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300"
              >
<ApperIcon name="ExternalLink" size={20} className="mr-2 text-white" />
                View Live Form
              </Button>
              
              <Button
                variant="secondary"
                size="md"
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
                className="flex-1 disabled:opacity-50 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
<ApperIcon 
                  name={copyingHtml ? "Loader2" : "Copy"} 
                  size={20}
                  className={`mr-2 text-gray-700 ${copyingHtml ? "animate-spin" : ""}`}
                />
                {copyingHtml ? 'Copying...' : 'Copy Embed Code'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default FormCard;