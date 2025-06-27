export interface Socials {
  github?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface Skill {
  name: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  start: string; // e.g. "2023-01-01"
  end?: string;  // e.g. "2023-06-01" or undefined for current
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
  details: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  url?: string;
}

// ---- REMOVE EXAMPLES BELOW IF YOU ARE REPLACING WITH REAL DATA ELSEWHERE ----

// Example socials (replace with real ones if you haven't already)
export const socials: Socials = {
  github: 'https://github.com/exampleuser',
  linkedin: 'https://linkedin.com/in/exampleuser',
  email: 'exampleuser@gmail.com',
  phone: '+00-0000000000',
  location: 'Sample City, Country',
};

// Example skills (remove if your Skills section is hardcoded or imported from elsewhere)
export const skills: Skill[] = [
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Python' },
  { name: 'HTML5' },
  { name: 'CSS3' },
  { name: 'TailwindCSS' },
  { name: 'Framer Motion' },
  { name: 'Node.js' },
  { name: 'Git' },
];

// Example experiences (remove if you have a real experiences array)
export const experiences: Experience[] = [
  {
    id: 'exp1',
    title: 'Frontend Developer Intern',
    company: 'Fictional Tech Corp',
    start: '2024-01-01',
    end: '2024-04-30',
    responsibilities: [
      'Built UI components using React and TailwindCSS',
      'Worked closely with backend engineers',
      'Improved website performance by 20%',
    ],
  },
  {
    id: 'exp2',
    title: 'Open Source Contributor',
    company: 'Open Collective',
    start: '2023-06-15',
    responsibilities: [
      'Fixed bugs in JavaScript projects',
      'Reviewed community pull requests',
    ],
  },
];

// Example education (remove if you have a real education array)
export const education: Education[] = [
  {
    id: 'edu1',
    degree: 'Higher Secondary Education',
    school: 'Springfield High School',
    start: '2022-06-01',
    end: '2023-05-01',
    details: 'Science stream, member of coding club.',
  },
  {
    id: 'edu2',
    degree: 'Secondary Education',
    school: 'Springfield High School',
    start: '2020-06-01',
    end: '2021-05-01',
    details: 'Graduated with distinction.',
  },
];

// Example certifications (remove if you have real certifications)
export const certifications: Certification[] = [
  {
    id: 'cert1',
    name: 'Frontend Developer Certification',
    issuer: 'Example Online Academy',
    date: '2023-03-15',
    url: 'https://example.com/cert/frontend-developer',
  },
  {
    id: 'cert2',
    name: 'Responsive Web Design',
    issuer: 'Example Online Academy',
    date: '2023-02-10',
    url: 'https://example.com/cert/web-design',
  },
];

// Example projects (remove if you have a real projects array)
export const projects: Project[] = [
  {
    id: 'proj1',
    title: 'Sample Portfolio',
    description: 'A simple, responsive portfolio site template.',
    techStack: ['React', 'TypeScript', 'TailwindCSS'],
    url: 'https://github.com/exampleuser/sample-portfolio',
  },
  {
    id: 'proj2',
    title: 'Weather App',
    description: 'A weather dashboard using public APIs.',
    techStack: ['React', 'CSS', 'API'],
    url: 'https://github.com/exampleuser/weather-app',
  },
  {
    id: 'proj3',
    title: 'Blog Platform',
    description: 'A static blog generator for markdown posts.',
    techStack: ['Node.js', 'Express', 'React'],
    url: 'https://github.com/exampleuser/blog-platform',
  },
  {
    id: 'proj4',
    title: 'Task Manager',
    description: 'A task manager app with CRUD and local storage.',
    techStack: ['JavaScript', 'HTML', 'CSS'],
    url: 'https://github.com/exampleuser/task-manager',
  },
  {
    id: 'proj5',
    title: 'Starter Template',
    description: 'A starter template for modern web projects.',
    techStack: ['React', 'TypeScript', 'Vite'],
    url: 'https://github.com/exampleuser/starter-template',
  },
];
