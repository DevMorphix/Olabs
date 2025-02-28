import axios from 'axios';

export const createchapter = async (data: any) => {
    try {
        const response = await axios.post(
            `https://olabs-hackathon-backend.onrender.com/api/chapter/create-chapter`,
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
            `https://olabs-hackathon-backend.onrender.com/api/chapter`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching businesses:', error);
        throw error;
    }
};
