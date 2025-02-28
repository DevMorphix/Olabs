import axios from 'axios';

const BASE_URL = 'https://olabs-hackathon-backend.onrender.com/';

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