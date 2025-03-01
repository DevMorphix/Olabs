import axios from 'axios';
const BASE_URL = 'https://olabs-hackathon-backend.onrender.com/';

// Debug wrapper for createchapter function
export const createchapter = async (chapterData: any) => {
  console.log("Creating chapter with data:", {
    title: chapterData.title,
    content: chapterData.content ? `${chapterData.content.substring(0, 50)}...` : null,
    yt_links: chapterData.yt_links?.map((link: any) => ({
      title: link.title,
      url: link.url,
      description: link.description ? `${link.description.substring(0, 50)}...` : null
    })),
    class_id: chapterData.class_id,
    subject_id: chapterData.subject_id
  });

  try {
    // Make sure class_id and subject_id are strings
    const payload = {
      ...chapterData,
      class_id: String(chapterData.class_id),
      subject_id: String(chapterData.subject_id)
    };

    // Try using axios directly instead
    const response = await axios.post(
      `${BASE_URL}api/chapter/create-chapter`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating chapter:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data || "No response data"
    });
    
    // Return error details for better debugging
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: true
    };
  }
};

export const getchapter = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}api/chapter`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
};

export const getchapterbysubject = async (id:string) => {
    try {
        const response = await axios.get(
            `${BASE_URL}api/subject/get-subject/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching subject data:', error);
        throw error;
    }
};

// Function to get all chapters
export const GetAllChapters = async () => {
  try {
    console.log("Fetching all chapters");
    const response = await axios.get(
      `${BASE_URL}api/chapter`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error getting all chapters:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return {
      error: true,
      message: error.response?.data?.message || error.message
    };
  }
};

// Function to get a single chapter by ID
export const GetChapter = async (id: string) => {
  try {
    console.log(`Fetching chapter with ID: ${id}`);
    const response = await axios.get(
      `${BASE_URL}api/chapter/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error getting chapter ${id}:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return {
      error: true,
      message: error.response?.data?.message || error.message
    };
  }
};

// student registration
export const studentRegister = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}auth/student/register`, data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { error: true, message: error.message };
    }
}

// faculty or instructor registration
export const instructorRegister = async (data: any) => {
    try{
        const response = await axios.post(`${BASE_URL}auth/teacher/register`, data);
        return response.data;
    }catch(error: any){
        return error.response?.data || { error: true, message: error.message };
    }
}

export const Getsubject = async () => {
    try{
        const response = await axios.get(`${BASE_URL}api/subject/`);
        return response.data;
    }catch(error: any){
        return error.response?.data || { error: true, message: error.message };
    }
}

export const GetClass = async () => {
    try{
        const response = await axios.get(`${BASE_URL}api/class/`);
        return response.data;
    }catch(error: any){
        return error.response?.data || { error: true, message: error.message };
    }
}

// student login
export const studentLogin = async (data: any) => {
    try{
        const response = await axios.post(`${BASE_URL}auth/student/login`, data);
        return response.data;
    }catch(error: any){
        return error.response?.data || { error: true, message: error.message };
    }
}

// Create subject with improved error handling
export const createSubject = async (data: any) => {
    try {
        // Validate required fields
        if (!data.title) {
            console.error('Subject title is required');
            return {
                error: true,
                message: 'Subject title is required',
                status: 400
            };
        }

        console.log('Creating subject with data:', data);

        // Create the payload with correct field names
        const payload = {
            title: data.title,
            description: data.description || "",
            class_id: data.class_id || null
        };

        // Ensure proper headers are set
        const response = await axios.post(
            `${BASE_URL}api/subject/create-subject`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 15000
            }
        );

        console.log('Subject creation response:', response.data);
        return response.data;
    } catch (error: any) {
        // Enhanced error logging
        if (error.response) {
            console.error('Error creating subject - Server responded with error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            
            // Handle validation errors specifically
            if (error.response.status === 500 && error.response.data?.message?.errors) {
                const validationErrors = error.response.data.message.errors;
                let errorMessage = 'Validation error: ';
                
                // Extract specific validation error messages
                if (validationErrors.title) {
                    errorMessage += validationErrors.title.message;
                } else {
                    errorMessage += 'Please check all required fields.';
                }
                
                return {
                    error: true,
                    message: errorMessage,
                    status: 400, // More appropriate for validation errors
                    details: validationErrors
                };
            }
            
            return {
                error: true,
                message: error.response.data?.message || error.response.data?.error || 'Server error occurred',
                status: error.response.status,
                details: error.response.data
            };
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error creating subject - No response received:', error.request);
            return {
                error: true,
                message: 'No response from server. Please check your connection.',
                status: 0
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error creating subject - Request setup error:', error.message);
            return {
                error: true,
                message: 'Failed to send request: ' + error.message,
                status: 0
            };
        }
    }
};

// Create class with improved error handling
export const createClass = async (data: any) => {
    try {
        // Validate required field
        if (!data.title) {
            console.error('Class title is required');
            return {
                error: true,
                message: 'Class title is required',
                status: 400
            };
        }

        console.log('Creating class with data:', data);

        // Create payload with correct field names
        const payload = {
            title: data.title,
            description: data.description || ""
        };
        
        const response = await axios.post(
            `${BASE_URL}api/class/create-class`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );
        
        console.log('Class creation response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating class:', error.response?.data || error.message);
        
        if (error.response) {
            return {
                error: true,
                message: error.response.data?.message || error.response.data?.error || 'Failed to create class',
                status: error.response.status,
                details: error.response.data
            };
        }
        
        return { 
            error: true, 
            message: 'An error occurred while creating the class',
            details: error.message 
        };
    }
};

// faculty or instructor login
export const instructorLogin = async (data: any) => {
    try{
        const response = await axios.post(`${BASE_URL}auth/teacher/login`, data);
        return response.data;
    }catch(error: any){
        return error.response?.data || { error: true, message: error.message };
    }
};