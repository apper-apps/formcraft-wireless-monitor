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
      className: "!bg-gradient-to-r !from-cyber-500/10 !to-cyber-600/10 !text-surface-900 !border !border-cyber-500/30",
      progressClassName: "!bg-gradient-to-r !from-cyber-500 !to-cyber-600"
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
        className: "!bg-gradient-to-r !from-error/10 !to-neural-500/10 !text-surface-900 !border !border-error/30",
        progressClassName: "!bg-gradient-to-r !from-error !to-neural-500"
      });
      return false;
    }
  }
};