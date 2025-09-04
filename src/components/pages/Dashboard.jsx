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
  const [categoryTags, setCategoryTags] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterMode, setFilterMode] = useState("AND"); // AND or OR
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
      } else if (statusFilter === "active") {
        // Forms with responses in last 30 days
        matchesStatus = form.submissionCount > 0;
      } else if (statusFilter === "archived") {
        // Forms not updated in last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const formDate = new Date(form.updatedAt || form.createdAt || Date.now());
        matchesStatus = formDate < ninetyDaysAgo;
      }
      
      // Category tag filter
      let matchesTags = true;
      if (categoryTags.length > 0) {
        const formTags = form.Tags ? form.Tags.split(',').map(tag => tag.trim()) : [];
        if (filterMode === "AND") {
          matchesTags = categoryTags.every(tag => formTags.includes(tag));
        } else {
          matchesTags = categoryTags.some(tag => formTags.includes(tag));
        }
      }
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRange.start || dateRange.end) {
        const formDate = new Date(form.created_at_c || form.createdAt || Date.now());
        if (dateRange.start && dateRange.end) {
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          matchesDateRange = formDate >= startDate && formDate <= endDate;
        } else if (dateRange.start) {
          const startDate = new Date(dateRange.start);
          matchesDateRange = formDate >= startDate;
        } else if (dateRange.end) {
          const endDate = new Date(dateRange.end);
          matchesDateRange = formDate <= endDate;
        }
      }
      
      // Apply filter combination logic
      if (filterMode === "AND") {
        return matchesSearch && matchesStatus && matchesTags && matchesDateRange;
      } else {
        return matchesSearch && (matchesStatus || matchesTags || matchesDateRange);
      }
    });

    // Sort forms
    filtered.sort((a, b) => {
      if (sortBy === "createdAt") {
        const dateA = new Date(a.created_at_c || a.createdAt || Date.now());
        const dateB = new Date(b.created_at_c || b.createdAt || Date.now());
        return dateB - dateA;
      } else if (sortBy === "updatedAt") {
        const dateA = new Date(a.updated_at_c || a.updatedAt || a.createdAt || Date.now());
        const dateB = new Date(b.updated_at_c || b.updatedAt || b.createdAt || Date.now());
        return dateB - dateA;
      } else if (sortBy === "responses") {
        return (b.submission_count_c || b.submissionCount || 0) - (a.submission_count_c || a.submissionCount || 0);
      } else if (sortBy === "name") {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    return filtered;
  }, [forms, searchQuery, statusFilter, sortBy, categoryTags, dateRange, filterMode]);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadForms} />;
  return (
<div
className="p-8 lg:p-16 bg-gradient-to-br from-gray-50 to-white min-h-screen bg-pattern-dots texture-paper animate-morph-pattern">
    <motion.div
        initial={{
            opacity: 0,
            y: -20,
            scale: 0.95
        }}
        animate={{
            opacity: 1,
            y: 0,
            scale: 1
        }}
        transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100
        }}
        className="stagger-item"
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
                x: 20,
                rotateY: 10
            }}
            animate={{
                opacity: 1,
                x: 0,
                rotateY: 0
            }}
            transition={{
                duration: 0.6,
                delay: 0.15,
                type: "spring",
                stiffness: 120
            }}
            className="stagger-item"
            className="flex-shrink-0">
<Button
                onClick={handleCreateNew}
                size="xl"
                className="w-full sm:w-auto">
                <ApperIcon name="Plus" size={24} className="mr-3 text-white" />Create New Form
                            </Button>
        </motion.div>
    </motion.div>
    {/* Search and Filter Section */}
{forms.length > 0 && <motion.div
        initial={{
            opacity: 0,
            y: 30,
            scale: 0.9
        }}
        animate={{
            opacity: 1,
            y: 0,
            scale: 1
        }}
        transition={{
            duration: 0.7,
            delay: 0.25,
            type: "spring",
            stiffness: 80
        }}
        className="stagger-item"
        className="space-y-8 mb-10">
        {/* Enhanced Search Bar */}
        <div className="relative max-w-lg">
            <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<ApperIcon name="Search" size={20} className="text-gray-500" />
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
<ApperIcon name="X" size={20} className="text-gray-500 hover:text-gray-700 transition-colors" />
            </button>}
        </div>
        {/* Enhanced Filter and Sort Controls */}
<div
            className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100 glass-card texture-glass stagger-item micro-bounce">
            {/* Status Filter Buttons */}
<div className="flex flex-col gap-6">
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
                    }, {
                        key: "active",
                        label: "Active",
                        icon: "Activity"
                    }, {
                        key: "archived",
                        label: "Archived",
                        icon: "Archive"
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
    <ApperIcon name={icon} size={16} className="mr-2" />
                        {label}
                    </button>)}
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200">
                        <ApperIcon name={showAdvancedFilters ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
                        Advanced Filters
                        {(categoryTags.length > 0 || dateRange.start || dateRange.end) && (
                            <span className="ml-2 px-2 py-1 text-xs bg-indigo-600 text-white rounded-full">
                                {categoryTags.length + (dateRange.start || dateRange.end ? 1 : 0)}
                            </span>
                        )}
                    </button>
                    
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 font-bold">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-6 py-3 border-2 border-gray-200 rounded-xl bg-white text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 shadow-md hover:shadow-lg transition-all duration-300">
                            <option value="createdAt">Creation Date</option>
                            <option value="updatedAt">Last Updated</option>
                            <option value="responses">Response Count</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
{showAdvancedFilters && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100 glass-card texture-glass animate-float">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Category Tags Filter */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">
                                    Category Tags
                                </label>
                                <div className="space-y-2">
                                    {['Survey', 'Contact', 'Registration', 'Feedback', 'Application', 'Newsletter'].map(tag => (
                                        <label key={tag} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={categoryTags.includes(tag)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCategoryTags([...categoryTags, tag]);
                                                    } else {
                                                        setCategoryTags(categoryTags.filter(t => t !== tag));
                                                    }
                                                }}
                                                className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{tag}</span>
                                        </label>
                                    ))}
                                </div>
                                {categoryTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {categoryTags.map(tag => (
                                            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {tag}
                                                <button
                                                    onClick={() => setCategoryTags(categoryTags.filter(t => t !== tag))}
                                                    className="ml-2 h-4 w-4 text-indigo-600 hover:text-indigo-800">
                                                    <ApperIcon name="X" size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Date Range Filter */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">
                                    Date Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* Date Range Presets */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {[
                                        { label: 'Last 7 days', days: 7 },
                                        { label: 'Last 30 days', days: 30 },
                                        { label: 'This month', preset: 'thisMonth' },
                                        { label: 'Last month', preset: 'lastMonth' }
                                    ].map(preset => (
                                        <button
                                            key={preset.label}
                                            onClick={() => {
                                                const today = new Date();
                                                let start, end;
                                                
                                                if (preset.days) {
                                                    start = new Date(today.getTime() - preset.days * 24 * 60 * 60 * 1000);
                                                    end = today;
                                                } else if (preset.preset === 'thisMonth') {
                                                    start = new Date(today.getFullYear(), today.getMonth(), 1);
                                                    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                                                } else if (preset.preset === 'lastMonth') {
                                                    start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                                                    end = new Date(today.getFullYear(), today.getMonth(), 0);
                                                }
                                                
                                                setDateRange({
                                                    start: start.toISOString().split('T')[0],
                                                    end: end.toISOString().split('T')[0]
                                                });
                                            }}
                                            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors">
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Mode */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">
                                    Filter Mode
                                </label>
                                <div className="flex gap-3">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="filterMode"
                                            value="AND"
                                            checked={filterMode === "AND"}
                                            onChange={(e) => setFilterMode(e.target.value)}
                                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Match All</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="filterMode"
                                            value="OR"
                                            checked={filterMode === "OR"}
                                            onChange={(e) => setFilterMode(e.target.value)}
                                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Match Any</span>
                                    </label>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-indigo-200">
                                    <button
                                        onClick={() => {
                                            setCategoryTags([]);
                                            setDateRange({ start: "", end: "" });
                                            setFilterMode("AND");
                                        }}
                                        className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        Clear Advanced Filters
                                    </button>
                                </div>
</div>
                        </div>
                    </motion.div>
                )}
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
<ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
        <p className="text-gray-600">
            {searchQuery || statusFilter !== "all" ? "Try adjusting your search or filters" : "Create your first form to get started"}
        </p>
{(searchQuery || statusFilter !== "all" || categoryTags.length > 0 || dateRange.start || dateRange.end) && (
            <div className="mt-6 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                <div className="flex items-center gap-2">
                    <ApperIcon name="Filter" size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                        Filters active: {[
                            searchQuery && "Search",
                            statusFilter !== "all" && "Status",
                            categoryTags.length > 0 && `${categoryTags.length} Tag${categoryTags.length !== 1 ? 's' : ''}`,
                            (dateRange.start || dateRange.end) && "Date Range"
                        ].filter(Boolean).join(", ")}
                    </span>
                </div>
                <button
                    onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setCategoryTags([]);
                        setDateRange({ start: "", end: "" });
                        setFilterMode("AND");
                        toast.success("All filters cleared");
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-all duration-200">
                    <ApperIcon name="X" size={16} className="mr-2" />
                    Clear All Filters
                </button>
            </div>
        )}
</motion.div> : <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        initial={{
            opacity: 0,
            scale: 0.9
        }}
        animate={{
            opacity: 1,
            scale: 1
        }}
        transition={{
            duration: 0.8,
            delay: 0.35,
            type: "spring",
            stiffness: 60
        }}>
        {filteredAndSortedForms.map((form, index) => <motion.div
            key={form.Id}
            initial={{
                opacity: 0,
                y: 50,
                scale: 0.8,
                rotateX: 10
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 150,
                damping: 15
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                rotateX: -2,
                transition: { duration: 0.2 }
            }}
            className="stagger-item">
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