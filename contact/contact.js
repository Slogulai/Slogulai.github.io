document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Create FormData object
    const formData = new FormData(form);
    
    // Convert FormData to regular object for logging
    const formDataObject = Object.fromEntries(formData.entries());
    
    // Log form data to console
    console.log('Form Submission Data:', formDataObject);
    
    // Continue with normal form submission
    form.submit();
  });
});