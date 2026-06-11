
export type AdminTab = 'dashboard' | 'training' | 'exclusive' | 'strategies' | 'users';

export interface Resource {
  name: string;
  type: string;
  url?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl?: string;
  resources: Resource[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  enrolled: number;
  likes: number;
  level: string;
  image: string;
  description: string;
  modules: Module[];
}

export interface ManagedItem {
  id: string;
  title: string;
  subtitle?: string;
  grade?: string;
  subject?: string;
  date: string;
  type?: string;
  extraLinks?: string;
  status: string;
  description?: string;
  content?: string;
  directions?: string;
  videoUrl?: string;
  author?: string;
  bookCover?: string;
  unit?: string;
  lesson?: string;
  position?: number;
}
