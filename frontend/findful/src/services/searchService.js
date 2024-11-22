import axios from 'axios';
import { getEnvironment } from '../utils/fetchEnvironment';

const environment = getEnvironment();
const apiUrl = environment.backend;

export const sendSearchRequest = async (searchText, apartmentType) => {
    const payload = {
        query: searchText,
        apartmentType: apartmentType,
    };

    // TODO: Edit to fetch data from our data base (via backend API)
    try {
        const response = await axios.post(`${apiUrl}/search`, payload);
        return response.data;
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
};