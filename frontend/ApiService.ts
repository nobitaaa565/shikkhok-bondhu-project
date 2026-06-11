
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = `${BASE_URL}/api`;
const MEDIA_BASE_URL = `${BASE_URL}/local-repository`;

class ApiService {
    static resolveMediaUrl(path: string | null | undefined) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Handle Django absolute paths or relative paths
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        if (cleanPath.startsWith('/local-repository/')) {
            return `${BASE_URL}${cleanPath}`;
        }
        return `${MEDIA_BASE_URL}${cleanPath}`;
    }
    private static getAuthHeader() {
        const token = localStorage.getItem('accessToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    private static async request(url: string, options: RequestInit = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            this.logout();
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: 'An unexpected error occurred' };
            }
            throw new Error(errorData.detail || errorData.message || JSON.stringify(errorData) || 'Request failed');
        }

        if (response.status === 204) return true;
        return await response.json();
    }

    static async login(username: string, password: string) {
        const data = await this.request(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        return data;
    }

    static async register(userData: any) {
        return await this.request(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    static async getStrategies(category?: string) {
        let url = `${API_BASE_URL}/strategies/`;
        if (category) {
            url += `?category=${category}`;
        }
        return await this.request(url);
    }

    static async saveStrategy(strategyData: any) {
        // IDs starting with these prefixes are temporary/frontend-only and should use POST
        const isTempId = strategyData.id && (
            strategyData.id.toString().startsWith('s-') ||
            strategyData.id.toString().startsWith('item-') ||
            strategyData.id.toString().startsWith('struc-')
        );
        const method = strategyData.id && !isTempId ? 'PUT' : 'POST';
        const url = method === 'PUT'
            ? `${API_BASE_URL}/strategies/${strategyData.id}/`
            : `${API_BASE_URL}/strategies/`;

        return await this.request(url, {
            method,
            body: JSON.stringify(strategyData),
        });
    }

    static async deleteStrategy(id: string | number) {
        return await this.request(`${API_BASE_URL}/strategies/${id}/`, {
            method: 'DELETE',
        });
    }

    static async uploadFile(file: File, category: string, isPublic: boolean, metadata: any = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('is_public', String(isPublic));

        // Append additional metadata if provided
        if (metadata.title) formData.append('title', metadata.title);
        if (metadata.description) formData.append('description', metadata.description);
        if (metadata.grade) formData.append('grade', metadata.grade);
        if (metadata.subject) formData.append('subject', metadata.subject);
        if (metadata.file_type) formData.append('file_type', metadata.file_type);

        const response = await fetch(`${API_BASE_URL}/files/upload/`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeader(),
            },
            body: formData,
        });

        if (response.status === 401) {
            this.logout();
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Upload failed');
        }

        return await response.json();
    }

    static async listFiles(category?: string) {
        let url = `${API_BASE_URL}/files/`;
        if (category) {
            url += `?category=${category}`;
        }
        return await this.request(url);
    }

    static async deleteFile(id: number) {
        return await this.request(`${API_BASE_URL}/files/${id}/`, {
            method: 'DELETE',
        });
    }

    static async getCourses() {
        return await this.request(`${API_BASE_URL}/training/courses/`);
    }

    static async getCourse(id: string | number) {
        return await this.request(`${API_BASE_URL}/training/courses/${id}/`);
    }

    static async saveCourse(courseData: any) {
        const isTempId = courseData.id && (
            courseData.id.toString().startsWith('c-') ||
            courseData.id.toString().startsWith('c1') ||
            courseData.id.toString().startsWith('c2')
        );
        const method = courseData.id && !isTempId ? 'PUT' : 'POST';
        const url = method === 'PUT'
            ? `${API_BASE_URL}/training/courses/${courseData.id}/`
            : `${API_BASE_URL}/training/courses/`;

        return await this.request(url, {
            method,
            body: JSON.stringify(courseData),
        });
    }

    static async deleteCourse(id: string | number) {
        return await this.request(`${API_BASE_URL}/training/courses/${id}/`, {
            method: 'DELETE',
        });
    }

    static async getExclusiveMaterials(grade?: string, subject?: string) {
        let url = `${API_BASE_URL}/exclusive/materials/`;
        const params = new URLSearchParams();
        if (grade) params.append('grade', grade);
        if (subject) params.append('subject', subject);
        if (params.toString()) url += `?${params.toString()}`;

        return await this.request(url);
    }

    static async saveExclusiveMaterial(materialData: any) {
        const isTempId = materialData.id && (
            materialData.id.toString().startsWith('item-') ||
            materialData.id.toString().startsWith('m1') ||
            materialData.id.toString().startsWith('m2') ||
            materialData.id.toString().startsWith('struc-')
        );
        const method = materialData.id && !isTempId ? 'PUT' : 'POST';
        const url = method === 'PUT'
            ? `${API_BASE_URL}/exclusive/materials/${materialData.id}/`
            : `${API_BASE_URL}/exclusive/materials/`;

        return await this.request(url, {
            method,
            body: JSON.stringify(materialData),
        });
    }

    static async deleteExclusiveMaterial(id: string | number) {
        return await this.request(`${API_BASE_URL}/exclusive/materials/${id}/`, {
            method: 'DELETE',
        });
    }

    static logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('educore_user_avatar');
    }
}

export default ApiService;
