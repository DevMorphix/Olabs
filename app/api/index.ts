import axios from 'axios';
const BASE_URL = 'https://olabs-hackathon-backend.onrender.com/';

export const createchapter = async (data: any) => {
    try {
        const response = await axios.post(
            `${BASE_URL}api/chapter/create-chapter`,
            {
                data
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching businesses:', error);
        throw error;
    }
};

export const getchapter = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}api/chapter`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching businesses:', error);
        throw error;
    }
};

// student registration
export const studentRegister = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}auth/student/register`, data);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

// faculty or instructor registration
export const instructorRegister = async (data: any) => {
    try{
        const response = await axios.post(`${BASE_URL}auth/teacher/register`, data);
        return response.data;
    }catch(error: any){
        return error.response.data;
    }
}

export const Getsubject = async () => {
    try{
        const response = await axios.get(`${BASE_URL}api/subject/`);
        return response.data;
    }catch(error: any){
        return error.response.data;
    }
}

// Create subject
export const createSubject = async (data: any) => {
    try {
        const response = await axios.post(
            `${BASE_URL}api/subject/create-subject`,
            data
        );
        return response.data;
    } catch (error: any) {
        console.error('Error creating subject:', error);
        return error.response ? error.response.data : { error: 'An error occurred' };
    }
};

