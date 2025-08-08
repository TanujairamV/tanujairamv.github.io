import React from "react";
import { School } from "lucide-react";
import ShinyText from "../Components/gradient";
import AnimatedList from "../Components/AnimatedList";

// Your education data
const educationData = [
  {
    school: "St. Joseph’s Matriculation Higher Secondary School",
    location: "Hosur, Tamil Nadu, India",
    period: "2013 – 2017",
    details: [
      "Early foundational education",
      "Developed interest in mathematics and computers at a young age",
    ],
    grade: "Grade 1 to 4",
    icon: <School className="text-2xl text-indigo-300" />,
  },
  {
    school: "Sri Balaji Gurukulam Matriculation Higher Secondary School",
    location: "Srimushnam, Tamil Nadu, India",
    period: "2017 – 2023",
    details: [
      "Completed Middle and High School education under Tamil Nadu State Board",
      "Actively participated in science fairs and inter-school competitions",
    ],
    grade: "Grade 5 to 10",
    icon: <School className="text-2xl text-teal-300" />,
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
    icon: <School className="text-2xl text-blue-300" />,
  },
];

// A render function for a single education item card
const renderEducationItem = (item: typeof educationData[0], isSelected: boolean) => (
  <div
    className={`
      relative rounded-2xl bg-white/40 dark:bg-neutral-900/40 shadow-xl shadow-gray-700/10
      px-6 py-5 md:py-7 transition-all duration-300 backdrop-blur-xl text-left cursor-pointer border-2
      ${isSelected ? 'border-blue-300/70 bg-white/70 dark:bg-neutral-900/60 scale-[1.02]' : 'border-white/10'}
    `}
    style={{
      backdropFilter: "blur(18px) saturate(1.2)",
      WebkitBackdropFilter: "blur(18px) saturate(1.2)",
    }}
  >
    <div className="flex items-center gap-4 mb-2">
      <span className="relative flex h-8 w-8 items-center justify-center flex-shrink-0">
        <span
          className={`
            ${isSelected ? 'animate-pulse' : ''}
            absolute inline-flex h-full w-full rounded-full bg-gradient-to-br from-indigo-200 via-blue-100 to-gray-100 opacity-60
            transition-transform duration-300 group-hover:scale-110 group-hover:opacity-80
          `}
        ></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-br from-white via-indigo-400 to-blue-300 shadow"></span>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {item.icon}
        </span>
      </span>
      <ShinyText className="text-lg font-semibold" speed={6} disabled={!isSelected}>
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
    <div className="relative flex flex-col items-center w-full">
      <div className="relative w-full max-w-2xl mx-auto">
        <AnimatedList
          items={educationData}
          renderItem={renderEducationItem}
          getKey={(item) => item.school}
        />
      </div>
    </div>
  );
};

export default Education;
