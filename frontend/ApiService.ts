import { INITIAL_TRAINING, INITIAL_EXCLUSIVE, INITIAL_STRATEGIES, INITIAL_FILES } from './data';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = `${BASE_URL}/api`;
const MEDIA_BASE_URL = `${BASE_URL}/local-repository`;

// Set this to true to bypass backend calls and run entirely inside the frontend (localStorage/demo mode)
const BYPASS_BACKEND = true;

class ApiService {
    static resolveMediaUrl(path: string | null | undefined) {
        if (!path) return '';
        if (BYPASS_BACKEND) {
            if (path.startsWith('http')) return path;
            return path.startsWith('/') ? path : `/${path}`;
        }
        if (path.startsWith('http')) return path;
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
        if (BYPASS_BACKEND) {
            // Treat username containing 'admin' as admin role, others as educator
            const role = (username === 'admin' || username.includes('admin')) ? 'admin' : 'educator';
            localStorage.setItem('accessToken', 'mock-access-token');
            localStorage.setItem('refreshToken', 'mock-refresh-token');
            localStorage.setItem('userRole', role);
            return { access: 'mock-access-token', refresh: 'mock-refresh-token' };
        }

        const data = await this.request(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        return data;
    }

    static async register(userData: any) {
        if (BYPASS_BACKEND) {
            return { message: "Mock registration successful" };
        }
        return await this.request(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    static async getStrategies(category?: string) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_strategies') || '[]');
            // Merge missing INITIAL_STRATEGIES items to ensure updates are propagated
            let changed = false;
            for (const s of INITIAL_STRATEGIES) {
                if (!data.some((m: any) => m.id.toString() === s.id.toString())) {
                    data.push(s);
                    changed = true;
                }
            }
            if (changed || data.length === 0) {
                if (data.length === 0) data = INITIAL_STRATEGIES;
                localStorage.setItem('educore_strategies', JSON.stringify(data));
            }
            if (category) {
                data = data.filter((s: any) => s.category === category);
            }
            return data;
        }

        let url = `${API_BASE_URL}/strategies/`;
        if (category) {
            url += `?category=${category}`;
        }
        return await this.request(url);
    }

    static async saveStrategy(strategyData: any) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_strategies') || '[]');
            if (data.length === 0) data = INITIAL_STRATEGIES;
            
            // Check if it's a new strategy or an edit
            const isTempId = strategyData.id && (
                strategyData.id.toString().startsWith('s-') ||
                strategyData.id.toString().startsWith('item-') ||
                strategyData.id.toString().startsWith('struc-')
            );
            
            if (!strategyData.id || isTempId) {
                strategyData.id = strategyData.id && !isTempId ? strategyData.id : `s-${Date.now()}`;
                data = [strategyData, ...data];
            } else {
                data = data.map((s: any) => s.id.toString() === strategyData.id.toString() ? strategyData : s);
            }
            localStorage.setItem('educore_strategies', JSON.stringify(data));
            return strategyData;
        }

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
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_strategies') || '[]');
            data = data.filter((s: any) => s.id.toString() !== id.toString());
            localStorage.setItem('educore_strategies', JSON.stringify(data));
            return true;
        }

        return await this.request(`${API_BASE_URL}/strategies/${id}/`, {
            method: 'DELETE',
        });
    }

    static async uploadFile(file: File, category: string, isPublic: boolean, metadata: any = {}) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_files') || '[]');
            const newFile = {
                id: Date.now(),
                file: `/uploads/${file.name}`,
                category,
                is_public: isPublic,
                title: metadata.title || file.name,
                description: metadata.description || '',
                grade: metadata.grade || '',
                subject: metadata.subject || '',
                file_type: metadata.file_type || file.type,
                uploaded_at: new Date().toISOString()
            };
            data = [newFile, ...data];
            localStorage.setItem('educore_files', JSON.stringify(data));
            return newFile;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('is_public', String(isPublic));

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
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_files') || '[]');
            let changed = false;
            const initialFiles = typeof INITIAL_FILES !== 'undefined' ? INITIAL_FILES : [];
            for (const f of initialFiles) {
                if (!data.some((m: any) => m.id.toString() === f.id.toString() || m.file === f.file)) {
                    data.push(f);
                    changed = true;
                }
            }
            if (changed || data.length === 0) {
                if (data.length === 0) data = initialFiles;
                localStorage.setItem('educore_files', JSON.stringify(data));
            }
            if (category) {
                data = data.filter((f: any) => f.category === category);
            }
            return data;
        }

        let url = `${API_BASE_URL}/files/`;
        if (category) {
            url += `?category=${category}`;
        }
        return await this.request(url);
    }

    static async deleteFile(id: number) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_files') || '[]');
            data = data.filter((f: any) => f.id !== id);
            localStorage.setItem('educore_files', JSON.stringify(data));
            return true;
        }

        return await this.request(`${API_BASE_URL}/files/${id}/`, {
            method: 'DELETE',
        });
    }

    static async getCourses() {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_training') || '[]');
            if (data.length === 0) {
                data = INITIAL_TRAINING;
                localStorage.setItem('educore_training', JSON.stringify(data));
            }
            return data;
        }

        return await this.request(`${API_BASE_URL}/training/courses/`);
    }

    static async getCourse(id: string | number) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_training') || '[]');
            if (data.length === 0) data = INITIAL_TRAINING;
            return data.find((c: any) => c.id.toString() === id.toString()) || null;
        }

        return await this.request(`${API_BASE_URL}/training/courses/${id}/`);
    }

    static async saveCourse(courseData: any) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_training') || '[]');
            if (data.length === 0) data = INITIAL_TRAINING;
            
            const isTempId = courseData.id && (
                courseData.id.toString().startsWith('c-') ||
                courseData.id.toString().startsWith('c1') ||
                courseData.id.toString().startsWith('c2')
            );
            
            if (!courseData.id || isTempId) {
                courseData.id = courseData.id && !isTempId ? courseData.id : `c-${Date.now()}`;
                data = [courseData, ...data];
            } else {
                data = data.map((c: any) => c.id.toString() === courseData.id.toString() ? courseData : c);
            }
            localStorage.setItem('educore_training', JSON.stringify(data));
            return courseData;
        }

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
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_training') || '[]');
            data = data.filter((c: any) => c.id.toString() !== id.toString());
            localStorage.setItem('educore_training', JSON.stringify(data));
            return true;
        }

        return await this.request(`${API_BASE_URL}/training/courses/${id}/`, {
            method: 'DELETE',
        });
    }

    static async getExclusiveMaterials(grade?: string, subject?: string) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_exclusive') || '[]');
            // Merge missing INITIAL_EXCLUSIVE items to ensure updates are propagated
            let changed = false;
            for (const m of INITIAL_EXCLUSIVE) {
                if (!data.some((x: any) => x.id.toString() === m.id.toString())) {
                    data.push(m);
                    changed = true;
                }
            }
            if (changed || data.length === 0) {
                if (data.length === 0) data = INITIAL_EXCLUSIVE;
                localStorage.setItem('educore_exclusive', JSON.stringify(data));
            }
            if (grade) {
                data = data.filter((m: any) => m.grade === grade);
            }
            if (subject) {
                data = data.filter((m: any) => m.subject === subject);
            }
            return data;
        }

        let url = `${API_BASE_URL}/exclusive/materials/`;
        const params = new URLSearchParams();
        if (grade) params.append('grade', grade);
        if (subject) params.append('subject', subject);
        if (params.toString()) url += `?${params.toString()}`;

        return await this.request(url);
    }

    static async saveExclusiveMaterial(materialData: any) {
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_exclusive') || '[]');
            if (data.length === 0) data = INITIAL_EXCLUSIVE;
            
            const isTempId = materialData.id && (
                materialData.id.toString().startsWith('item-') ||
                materialData.id.toString().startsWith('m1') ||
                materialData.id.toString().startsWith('m2') ||
                materialData.id.toString().startsWith('struc-')
            );
            
            if (!materialData.id || isTempId) {
                materialData.id = materialData.id && !isTempId ? materialData.id : `item-${Date.now()}`;
                data = [materialData, ...data];
            } else {
                data = data.map((m: any) => m.id.toString() === materialData.id.toString() ? materialData : m);
            }
            localStorage.setItem('educore_exclusive', JSON.stringify(data));
            return materialData;
        }

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
        if (BYPASS_BACKEND) {
            let data = JSON.parse(localStorage.getItem('educore_exclusive') || '[]');
            data = data.filter((m: any) => m.id.toString() !== id.toString());
            localStorage.setItem('educore_exclusive', JSON.stringify(data));
            return true;
        }

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
