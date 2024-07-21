import axios from 'axios';

export const getUniqueUsername = async (username: string) => {
    try {
        const response = await axios.get(`/api/check-username-unique?usernames=${username}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch message data');
    }
};
