import React from 'react';
import { FiBookOpen } from "react-icons/fi";
import ShinyText from "../Components/gradient";
import ScrollStack, { ScrollStackItem } from '../Components/ScrollStack';

interface EducationEntry {
  school: string;
  location: string;
  period: string;
  details: string[];
  grade: string;
  icon: React.ReactNode;
}

const educationData: EducationEntry[] = [
  {
    school: "St. Joseph’s Matriculation Higher Secondary School",
    location: "Hosur, Tamil Nadu, India",
    period: "2013 – 2017",
    details: ["Completed early foundational education.", "Developed a strong interest in mathematics and computers."],
    grade: "Grade 1 to 4",
    icon: <FiBookOpen className="text-2xl text-indigo-300" />,
  },
  {
    school: "Sri Balaji Gurukulam Matriculation Higher Secondary School",
    location: "Srimushnam, Tamil Nadu, India",
    period: "2017 – 2023",
    details: ["Completed Middle and High School (Tamil Nadu State Board).", "Actively participated in science fairs and inter-school competitions."],
    grade: "Grade 5 to 10",
    icon: <FiBookOpen className="text-2xl text-teal-300" />,
  },
  {
    school: "FIITJEE, Chennai",
    location: "Chennai, Tamil Nadu, India",
    period: "2023 – Present",
    details: [
      "Enrolled in the prestigious IIT-JEE preparation program",
      "Focus on Physics, Chemistry, Mathematics, and Computer Science",
    ],
    grade: "Grade 11 to Present",
    icon: <FiBookOpen className="text-2xl text-blue-300" />,
  },
];

// A render function for a single education item card
const renderEducationItem = (item: typeof educationData[0]) => (
  <div
    className={`
      relative rounded-2xl bg-white/40 dark:bg-neutral-900/40 shadow-xl shadow-gray-700/10
      px-6 py-5 md:py-7 transition-all duration-300 backdrop-blur-xl text-left cursor-pointer border-2
      border-white/10
    `}
    style={{
      backdropFilter: "blur(18px) saturate(1.2)",
      WebkitBackdropFilter: "blur(18px) saturate(1.2)",
    }}
  >
    <div className="flex items-center gap-4 mb-2">
      {/* Icon container without the background circles */}
      <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">{item.icon}</div>
      <ShinyText className="text-lg font-semibold" speed={6}>
        {item.school}
      </ShinyText>
    </div>
    <div className="pl-12">
      <div className="text-md font-medium text-gray-600 dark:text-gray-300 mb-0.5">
        {item.grade}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.location}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">{item.period}</div>
      <ul className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside mt-1">
        {item.details.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  </div>
);

const Education: React.FC = () => {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <ScrollStack 
        useWindowScroll={true} 
        itemDistance={-80} 
        itemScale={0.05} 
        baseScale={0.8} 
        blurAmount={1.5}
        rotationAmount={1.5}
      >
        {educationData.map((item) => (
          <ScrollStackItem key={item.school}>
            {renderEducationItem(item)}
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  );
};

export default Education;
