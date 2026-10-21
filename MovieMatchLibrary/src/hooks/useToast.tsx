import React, { useState } from "react";
import { Toast } from "../components/Toast";

/**
 * Toast state + a ready-to-render <Toast> element bound to it.
 * Call showToast(...), then place `toast` somewhere in the tree:
 * everything sharing one useToast() instance shares one toast.
 */
export const useToast = (duration = 2000) => {
  const [message, setToastMessage] = useState<string | null>(null);
  const clearToast = () => setToastMessage(null);

  return {
    message,
    showToast: setToastMessage,
    clearToast,
    toast: <Toast message={message} onDismiss={clearToast} duration={duration} />,
  };
};
