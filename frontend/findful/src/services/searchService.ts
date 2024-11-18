import axios from 'axios';
import { getEnvironment } from '../utils/fetchEnvironment';
import { SearchRequest } from '../models/SearchRequest';

const environment = getEnvironment();
const apiUrl = environment.backend;

export const sendSearchRequest = async (searchText: string, apartmentType: string) => {
    const payload: SearchRequest = {
        query: searchText,
        apartmentType: apartmentType,
    };

    try {
        const response = await axios.post(`${apiUrl}/search`, payload);
        return response.data;
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
};
