import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text, type = 'text') => {
  try {
    // Try modern Clipboard API first
    await navigator.clipboard.writeText(text);
    toast.success(`✅ ${type} copied to clipboard!`, {
      className: "!bg-gradient-to-r !from-emerald-50 !to-green-50 !text-gray-900 !border !border-emerald-200",
      progressClassName: "!bg-gradient-to-r !from-emerald-500 !to-green-500"
    });
    return true;
  } catch (err) {
    // Fallback for older browsers or restricted environments
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success(`✅ ${type} copied to clipboard!`, {
          className: "!bg-gradient-to-r !from-emerald-50 !to-green-50 !text-gray-900 !border !border-emerald-200",
          progressClassName: "!bg-gradient-to-r !from-emerald-500 !to-green-500"
        });
        return true;
      } else {
        throw new Error('Fallback copy failed');
      }
    } catch (fallbackErr) {
      console.error('Copy to clipboard failed:', fallbackErr);
      toast.error(`❌ Failed to copy ${type}. Please copy manually.`, {
        className: "!bg-gradient-to-r !from-red-50 !to-pink-50 !text-gray-900 !border !border-red-200",
        progressClassName: "!bg-gradient-to-r !from-red-500 !to-pink-500"
      });
      return false;
    }
  }
};