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
    toast.success(`${type} copied to clipboard!`);
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
        toast.success(`${type} copied to clipboard!`);
        return true;
      } else {
        throw new Error('Fallback copy failed');
      }
    } catch (fallbackErr) {
      console.error('Copy to clipboard failed:', fallbackErr);
      toast.error(`Failed to copy ${type}. Please copy manually.`);
      return false;
    }
  }
};