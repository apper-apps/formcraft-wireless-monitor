import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formService } from "@/services/api/formService";
import ApperIcon from "@/components/ApperIcon";
import FormCard from "@/components/organisms/FormCard";
import FormTemplatesModal from "@/components/organisms/FormTemplatesModal";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";

const Dashboard = () => {
const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await formService.getAll();
      setForms(data);
    } catch (err) {
      setError("Failed to load forms. Please try again.");
    } finally {
      setLoading(false);
    }
};

  const handleCreateNew = () => {
    setShowTemplatesModal(true);
  };

  const handleCloseTemplatesModal = () => {
    setShowTemplatesModal(false);
  };

  const handleStartBlank = () => {
    setShowTemplatesModal(false);
    navigate("/builder");
  };

  const handleShowTemplates = () => {
    setShowTemplatesModal(true);
  };

const handleEditForm = (form) => {
    navigate(`/builder/${form.Id}`);
  };

  const handleViewResponses = (form) => {
    navigate(`/form/${form.Id}/responses`);
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await formService.delete(formId);
        setForms(forms.filter(form => form.Id !== formId));
        toast.success("Form deleted successfully");
      } catch (err) {
        toast.error("Failed to delete form");
      }
    }
  };

const handleDuplicateForm = async (form) => {
    try {
      const duplicatedForm = {
        Name: `${form.name} (Copy)`,
        Tags: form.Tags || "",
        description_c: form.description,
        fields_c: form.fields || [],
        settings_c: form.settings || {},
        style_c: form.style || {},
        notifications_c: form.notifications || {},
        thank_you_c: form.thankYou || {},
        is_published_c: false,
        submission_count_c: 0
      };
      
      const newForm = await formService.create(duplicatedForm);
      setForms([newForm, ...forms]);
      toast.success("Form duplicated successfully");
    } catch (err) {
      toast.error("Failed to duplicate form");
    }
  };
// Filter and sort forms based on search and filters
const filteredAndSortedForms = React.useMemo(() => {
    let filtered = forms.filter(form => {
      // Search filter
      const matchesSearch = (form.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === "published") {
        matchesStatus = form.isPublished === true;
      } else if (statusFilter === "draft") {
        matchesStatus = form.isPublished !== true;
      } else if (statusFilter === "recent") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const formDate = new Date(form.updatedAt || form.createdAt || Date.now());
        matchesStatus = formDate > oneWeekAgo;
      }
      
      return matchesSearch && matchesStatus;
    });

    // Sort forms
    filtered.sort((a, b) => {
      if (sortBy === "createdAt") {
        const dateA = new Date(a.createdAt || Date.now());
        const dateB = new Date(b.createdAt || Date.now());
        return dateB - dateA;
      } else if (sortBy === "updatedAt") {
        const dateA = new Date(a.updatedAt || a.createdAt || Date.now());
        const dateB = new Date(b.updatedAt || b.createdAt || Date.now());
        return dateB - dateA;
      } else if (sortBy === "responses") {
        return (b.submissionCount || 0) - (a.submissionCount || 0);
      }
      return 0;
    });

    return filtered;
  }, [forms, searchQuery, statusFilter, sortBy]);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadForms} />;
  return (
<div
    className="p-8 lg:p-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
    <motion.div
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            duration: 0.5
        }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
        <div className="mb-6 sm:mb-0">
            <h1
                className="text-5xl lg:text-6xl font-display font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">Dashboard
                            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-md leading-relaxed">Create, manage, and analyze your forms with powerful tools
                            </p>
        </div>
        <motion.div
            initial={{
                opacity: 0,
                x: 20
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            transition={{
                duration: 0.5,
                delay: 0.15
            }}
            className="flex-shrink-0">
            <Button
                onClick={handleCreateNew}
                size="xl"
                className="w-full sm:w-auto shadow-2xl hover:shadow-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:via-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300">
                <ApperIcon name="Plus" className="w-6 h-6 mr-3" />Create New Form
                            </Button>
        </motion.div>
    </motion.div>
    {/* Search and Filter Section */}
    {forms.length > 0 && <motion.div
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            duration: 0.5,
            delay: 0.25
        }}
        className="space-y-8 mb-10">
        {/* Enhanced Search Bar */}
        <div className="relative max-w-lg">
            <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ApperIcon name="Search" className="w-5 h-5 text-gray-500" />
            </div>
            <input
                type="text"
                placeholder="Search forms by name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl bg-white text-lg font-medium placeholder-gray-500" />
            {searchQuery && <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-2xl transition-colors duration-200">
                <ApperIcon name="X" className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>}
        </div>
        {/* Enhanced Filter and Sort Controls */}
        <div
            className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-3">
                {[{
                    key: "all",
                    label: "All Forms",
                    icon: "LayoutGrid"
                }, {
                    key: "published",
                    label: "Published",
                    icon: "Eye"
                }, {
                    key: "draft",
                    label: "Draft",
                    icon: "Edit3"
                }, {
                    key: "recent",
                    label: "Recently Updated",
                    icon: "Clock"
                }].map((
                    {
                        key,
                        label,
                        icon
                    }
                ) => <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${statusFilter === key ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-2 border-indigo-200" : "bg-gradient-to-r from-white to-gray-50 text-gray-700 border-2 border-gray-200 hover:from-gray-50 hover:to-gray-100 hover:border-gray-300"}`}>
                    <ApperIcon name={icon} className="w-4 h-4 mr-2" />
                    {label}
                </button>)}
            </div>
            {/* Enhanced Sort Dropdown */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-bold">Sort by:</span>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl bg-white text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 shadow-md hover:shadow-lg transition-all duration-300">
                    <option value="createdAt">Creation Date</option>
                    <option value="updatedAt">Last Updated</option>
                    <option value="responses">Response Count</option>
                </select>
            </div>
        </div>
    </motion.div>}
    {forms.length === 0 ? <Empty
        title="No forms created yet"
        description="Get started by creating your first form with our intuitive drag-and-drop builder or choose from our pre-built templates"
        actionLabel="Create Your First Form"
        onAction={handleCreateNew}
        icon="FormInput" /> : filteredAndSortedForms.length === 0 ? <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        className="text-center py-12">
        <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
        <p className="text-gray-600">
            {searchQuery || statusFilter !== "all" ? "Try adjusting your search or filters" : "Create your first form to get started"}
        </p>
        {(searchQuery || statusFilter !== "all") && <button
            onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
            }}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium">Clear filters
                        </button>}
    </motion.div> : <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        transition={{
            duration: 0.6,
            delay: 0.35
        }}>
        {filteredAndSortedForms.map((form, index) => <motion.div
            key={form.Id}
            initial={{
                opacity: 0,
                y: 30,
                scale: 0.95
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1
            }}
            transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeOut"
            }}
            whileHover={{
                y: -5
            }}>
            <FormCard
                form={form}
                onEdit={handleEditForm}
                onDelete={handleDeleteForm}
                onDuplicate={handleDuplicateForm}
                onViewResponses={handleViewResponses} />
        </motion.div>)}
    </motion.div>}
    {/* Templates Modal */}
    <FormTemplatesModal
        isOpen={showTemplatesModal}
        onClose={handleCloseTemplatesModal}
        onStartBlank={handleStartBlank} />
</div>
  );
};

export default Dashboard;