import { environment as prodEnvironment } from '../environment';
import { environment as devEnvironment } from '../environment.dev';

export const getEnvironment = () => {
    return import.meta.env.MODE === 'development' ? devEnvironment : prodEnvironment;
};