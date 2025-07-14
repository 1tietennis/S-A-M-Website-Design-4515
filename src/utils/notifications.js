// Notifications utility for contact form submissions

/**
 * Send a notification when a contact form is submitted
 * @param {Object} contactData - The form data that was submitted
 * @param {string} type - The type of notification (success, error, etc)
 */
export const sendNotification = (contactData, type = 'success') => {
  console.log('📣 Sending notification for form submission');
  
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notifications");
    return false;
  }

  // Create notification content based on contact data
  const title = type === 'success' 
    ? `New Lead: ${contactData.name}`
    : 'Form Submission Error';
  
  const options = {
    body: type === 'success'
      ? `Service: ${contactData.service}\nBudget: ${contactData.budget}\nUrgency: ${contactData.urgency}`
      : 'There was an error processing the form submission',
    icon: '/favicon.ico',
    tag: 'contact-form',
    requireInteraction: true
  };

  // Request permission and show notification
  if (Notification.permission === "granted") {
    // Create and show the notification
    const notification = new Notification(title, options);
    return true;
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        const notification = new Notification(title, options);
        return true;
      }
    });
  }
  
  return false;
};

/**
 * Request notification permissions proactively
 */
export const requestNotificationPermission = () => {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notifications");
    return;
  }
  
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
};

/**
 * Create a toast notification within the app (fallback for browser notifications)
 * @param {Object} options - Notification options
 */
export const createToast = ({ message, type = 'success', duration = 5000 }) => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
  } text-white`;
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
};