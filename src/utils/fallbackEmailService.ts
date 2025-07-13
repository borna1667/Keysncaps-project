// fallbackEmailService.ts - A fallback service if EmailJS fails
// We're using direct fetch instead of apiRequest since this doesn't need authentication

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Fallback method that attempts to send an email through your backend API
export const sendContactEmailFallback = async (formData: EmailData): Promise<{success: boolean; response?: any; error?: Error}> => {
  try {
    // Attempting to send email using fallback server API method
    
    // Check if we're in a development environment
    const isDev = import.meta.env.MODE === 'development';
    
    if (isDev && !import.meta.env.VITE_API_URL) {
      // FALLBACK: Development mode detected without API URL. Simulating successful email send.
      return { 
        success: true, 
        response: { status: 200, text: 'DEV MODE: Email would have been sent in production' } 
      };
    }
    
    // Try to send the email through the server API
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      return { success: true, response: responseData };
    } else {
      throw new Error(responseData.message || 'Server rejected email submission');
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error in fallback email service') 
    };
  }
};

export default { sendContactEmailFallback };
