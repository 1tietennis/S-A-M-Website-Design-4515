// Utility to test Netlify form presence and functionality
export const testNetlifyForm = () => {
  console.log('🧪 Testing Netlify Form Setup...');

  // Check for hidden form
  const hiddenForm = document.querySelector('form[name="contact"][netlify][hidden]');
  if (!hiddenForm) {
    console.error('❌ Hidden Netlify form not found in index.html');
    return false;
  }

  // Check for required fields in hidden form
  const requiredFields = ['name', 'email', 'role[]', 'message'];
  const missingFields = requiredFields.filter(field => !hiddenForm.querySelector(`[name="${field}"]`));
  
  if (missingFields.length > 0) {
    console.error('❌ Missing fields in hidden form:', missingFields);
    return false;
  }

  console.log('✅ Hidden Netlify form configured correctly');
  return true;
};

// Test form submission
export const testFormSubmission = async (formData = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'Test message'
}) => {
  console.log('🧪 Testing form submission...');

  try {
    const netlifyFormData = new FormData();
    netlifyFormData.append('form-name', 'contact');
    Object.entries(formData).forEach(([key, value]) => {
      netlifyFormData.append(key, value);
    });

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(netlifyFormData).toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Test submission successful');
    return true;
  } catch (error) {
    console.error('❌ Test submission failed:', error);
    return false;
  }
};