import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const SaveFormModal = ({ isOpen, onClose, onSave, currentName = "" }) => {
  const [formName, setFormName] = useState("");
  const [error, setError] = useState("");

// Initialize form name when modal opens or currentName changes
  React.useEffect(() => {
    if (isOpen) {
      setFormName(currentName || "");
      setError("");
    }
  }, [isOpen, currentName]);

const handleSave = async () => {
    const trimmedName = formName.trim();
    if (!trimmedName) {
      setError("Form name is required");
      return;
    }
    
    try {
      setError("");
      await onSave(trimmedName);
      onClose();
    } catch (err) {
      console.error("Save form error in modal:", err);
      // Display specific error message from the service layer
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to save form. Please try again.";
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setFormName(currentName);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-900">
            Save Form
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="Form Name"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              setError("");
            }}
            placeholder="Enter form name..."
            error={error}
            autoFocus
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
            >
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SaveFormModal;