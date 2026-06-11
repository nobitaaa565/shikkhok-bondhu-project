// --- Default Data for Initialization ---
export const INITIAL_TRAINING = [
    {
        id: 'c1',
        title: 'AI in the Classroom',
        instructor: 'Dr. Jane Smith',
        duration: '4h 30m',
        enrolled: 1250,
        likes: 98,
        level: 'Intermediate',
        image: 'https://placehold.co/600x400/2E1065/FFF?text=AI+in+Classroom',
        description: 'Master the art of AI implementation in modern pedagogy.',
        modules: [
            {
                id: 'm1',
                title: 'Module 1: Foundations',
                lessons: [
                    {
                        id: 'l1',
                        title: 'Introduction to AI Ethics',
                        duration: '12:30',
                        description: 'Understanding the ethical implications of using Artificial Intelligence in an educational setting.',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        resources: [{ name: 'Ethics_Checklist.pdf', type: 'pdf' }]
                    },
                    {
                        id: 'l2',
                        title: 'Understanding LLMs',
                        duration: '18:45',
                        description: 'A deep dive into how Large Language Models work, their capabilities, and their limitations.',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        resources: [{ name: 'LLM_Diagram.png', type: 'image' }]
                    }
                ]
            }
        ]
    },
    {
        id: 'c2',
        title: 'Pedagogy Reimagined',
        instructor: 'Prof. Alan Turing',
        duration: '09:56',
        enrolled: 890,
        likes: 95,
        level: 'Beginner',
        image: 'https://placehold.co/600x400/065F46/FFF?text=Pedagogy+Reimagined',
        description: 'Foundational concepts for the modern classroom.',
        modules: [
            {
                id: 'm1-c2',
                title: 'Modern Teaching Methods',
                lessons: [
                    {
                        id: 'l1-c2',
                        title: 'Flipped Classroom 101',
                        duration: '09:56',
                        description: 'Basics of the flipped classroom model demonstrated with an inbuilt player.',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        resources: [{ name: 'Guide.pdf', type: 'pdf' }]
                    },
                ]
            }
        ]
    }
];

export const INITIAL_EXCLUSIVE = [
    {
        id: 'm1',
        title: 'Pronunciation Guide (Visuals)',
        grade: 'g1',
        subject: 'bangla',
        unit: 'Unit 1: The Basics',
        lesson: 'Lesson 1: Vowel Sounds',
        type: 'video',
        size: '15MB',
        description: 'An engaging animated video about correct pronunciation of vowels.',
        directions: 'Play the video during the introductory phase.',
        likes: 250,
        views: 1240,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
        id: 'm2',
        title: 'Worksheet: Letter Tracing',
        grade: 'g1',
        subject: 'bangla',
        unit: 'Unit 1: The Basics',
        lesson: 'Lesson 1: Vowel Sounds',
        type: 'pdf',
        size: '2MB',
        description: 'Printable tracing guides for early writing development.',
        directions: 'Distribute after the pronunciation video.',
        likes: 120,
        views: 500,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        id: 'm3',
        title: 'Classroom Quiz Deck',
        grade: 'g1',
        subject: 'bangla',
        unit: 'Unit 1: The Basics',
        lesson: 'Lesson 2: Consonant Flow',
        type: 'presentation',
        size: '8MB',
        description: 'Interactive slides for classroom group activities.',
        directions: 'Use with smartboards or projectors.',
        likes: 45,
        views: 300
    },
    {
        id: 'm4',
        title: 'Advanced Word Mixing',
        grade: 'g1',
        subject: 'bangla',
        unit: 'Unit 2: Word Building',
        lesson: 'Lesson 1: Compound Letters',
        type: 'image',
        size: '4MB',
        description: 'Visual breakdown of complex compound characters using high-res diagrams.',
        directions: 'Recommended for advanced learners.',
        likes: 310,
        views: 1500,
        url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800'
    }
];

export const INITIAL_STRATEGIES = [
    {
        id: 's-g1-b-1',
        title: 'Bornomala: Tactile Learning',
        grade: 'g1',
        subject: 'bangla',
        unit: 'Unit 1: The Basics',
        lesson: 'Lesson 1: Introduction',
        author: 'Dr. R. Ahmed',
        bookCover: 'bg-rose-900',
        readTime: '6 min read',
        content: `For Grade 1 students, the transition from oral to written language is critical.\n\n**The Sand Tray Method:**\nHave students trace letters in a tray of sand or salt while pronouncing the sound. This engages muscle memory alongside visual memory.`
    },
    {
        id: 's-g3-e-1',
        title: 'The Ant and The Grasshopper',
        grade: 'g3',
        subject: 'english',
        unit: 'Unit 4: Fables & Morals',
        lesson: 'Lesson 1: Hard Work vs Play',
        author: 'Ms. Sarah Jenkins',
        bookCover: 'bg-emerald-900',
        readTime: '8 min read',
        content: `### Objective\nTo teach students the importance of planning and hard work through the classic Aesop fable.\n\n### Introduction\nAsk students what they do during summer and what they do during winter. Introduce the characters: the diligent Ant and the carefree Grasshopper.\n\n### Strategy: Visual Storytelling\nUse interactive media to bridge the gap between text and imagination. Students should encounter the sensory details of the story—the heat of the sun, the cold of the snow, and the sound of the grasshopper's fiddle.`
    }
];
