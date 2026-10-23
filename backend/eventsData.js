// Default events and departments seed data for EventHive

export const departments = [
  {
    name: "Computer Engineering",
    code: "COMP",
    icon: "💻",
    description: "Software, systems and programming events."
  },
  {
    name: "Information Technology",
    code: "IT",
    icon: "🌐",
    description: "Networking, databases and IT management."
  },
  {
    name: "Artificial Intelligence & Data Science",
    code: "AI & DS",
    icon: "🤖",
    description: "AI, ML, data analytics and research events."
  },
  {
    name: "Civil Engineering",
    code: "CIVIL",
    icon: "🏗️",
    description: "Infrastructure, design and smart city projects."
  },
  {
    name: "Mechanical Engineering",
    code: "MECH",
    icon: "⚙️",
    description: "Machinery, CAD and manufacturing events."
  },
  {
    name: "Electronics & Telecommunication",
    code: "ENTC",
    icon: "📡",
    description: "Circuits, robotics and communication systems."
  }
];

export const events = [
  {
    name: "AI Hackathon",
    department: "AI & DS",
    category: "Technical",
    date: "15 October 2026",
    time: "10:00 AM – 4:00 PM",
    venue: "Innovation Lab",
    capacity: 80,
    registrationDeadline: "12 October 2026",
    coordinator: "Prof. Meera Shah",
    description: "A full-day technical hackathon where teams of 2–4 students build innovative AI-based solutions to real-world problems. Prizes worth ₹25,000 up for grabs!",
    eligibility: "Open to all students with basic Python knowledge.",
    image: "/images/hackathon.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Web Development Workshop",
    department: "COMP",
    category: "Workshop",
    date: "20 October 2026",
    time: "11:00 AM – 2:00 PM",
    venue: "Computer Lab",
    capacity: 50,
    registrationDeadline: "18 October 2026",
    coordinator: "Prof. Rajesh Kumar",
    description: "Learn modern web development concepts: HTML5, CSS3, and JavaScript. Build a responsive website from scratch during this hands-on workshop.",
    eligibility: "Open to FY and SY students.",
    image: "/images/workshop.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Annual Sports Day",
    department: "ALL",
    category: "Sports",
    date: "25 October 2026",
    time: "9:00 AM – 5:00 PM",
    venue: "College Sports Ground",
    capacity: 300,
    registrationDeadline: "22 October 2026",
    coordinator: "Mr. Suresh Patil",
    description: "An exciting sports event featuring cricket, football, badminton, athletics, and indoor games. Represent your department and compete for the Sports Trophy!",
    eligibility: "Open to all students.",
    image: "/images/sports.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Coding Competition",
    department: "COMP",
    category: "Technical",
    date: "28 October 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "Computer Lab 2",
    capacity: 60,
    registrationDeadline: "25 October 2026",
    coordinator: "Prof. Anita Desai",
    description: "Test your programming and problem-solving skills through challenging coding problems across multiple rounds. Languages: C, C++, Java, Python.",
    eligibility: "Open to all years. Individual participation.",
    image: "/images/hackathon.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Tech Talk on Generative AI",
    department: "AI & DS",
    category: "Seminar",
    date: "2 November 2026",
    time: "11:00 AM – 1:00 PM",
    venue: "Auditorium",
    capacity: 200,
    registrationDeadline: "31 October 2026",
    coordinator: "Prof. Neha Joshi",
    description: "An interactive expert session on Generative AI, covering LLMs, prompt engineering, and its applications in industry. Guest speaker from a leading tech company.",
    eligibility: "Open to all students and faculty.",
    image: "/images/workshop.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Robotics Workshop",
    department: "ENTC",
    category: "Workshop",
    date: "5 November 2026",
    time: "10:00 AM – 3:00 PM",
    venue: "Electronics Lab",
    capacity: 40,
    registrationDeadline: "2 November 2026",
    coordinator: "Prof. Vikram Nair",
    description: "Hands-on workshop covering Arduino programming, sensor integration, and building a basic line-following robot. All components provided.",
    eligibility: "Open to ENTC and COMP students.",
    image: "/images/workshop.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "CAD Design Competition",
    department: "MECH",
    category: "Competition",
    date: "8 November 2026",
    time: "10:00 AM – 2:00 PM",
    venue: "Mechanical Lab",
    capacity: 35,
    registrationDeadline: "5 November 2026",
    coordinator: "Prof. Amit Kulkarni",
    description: "Showcase your creativity and technical skills through computer-aided design using SolidWorks. Design a mechanical component based on a given problem statement.",
    eligibility: "Open to Mechanical Engineering students.",
    image: "/images/hackathon.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Smart City Project Exhibition",
    department: "CIVIL",
    category: "Exhibition",
    date: "12 November 2026",
    time: "10:00 AM – 4:00 PM",
    venue: "Main Exhibition Hall",
    capacity: 150,
    registrationDeadline: "9 November 2026",
    coordinator: "Prof. Priya Sharma",
    description: "Students present innovative ideas and working models for future smart cities — covering infrastructure, water management, traffic control, and green energy.",
    eligibility: "Team of 2–3 Civil Engineering students.",
    image: "/images/college.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Cultural Fest",
    department: "ALL",
    category: "Cultural",
    date: "18 November 2026",
    time: "5:00 PM – 9:00 PM",
    venue: "College Auditorium",
    capacity: 500,
    registrationDeadline: "14 November 2026",
    coordinator: "Cultural Committee",
    description: "A grand celebration of music, dance, drama, and art by students across all departments. Performances, competitions, and cultural displays make this the biggest event of the year!",
    eligibility: "Open to all students.",
    image: "/images/cultural.jpeg",
    status: "PUBLISHED"
  },
  {
    name: "Career Guidance Seminar",
    department: "ALL",
    category: "Seminar",
    date: "22 November 2026",
    time: "11:00 AM – 1:00 PM",
    venue: "Seminar Hall",
    capacity: 200,
    registrationDeadline: "20 November 2026",
    coordinator: "Training & Placement Cell",
    description: "A career guidance session covering placements, higher studies, GRE/GATE preparation, and industry opportunities. Panel of alumni and industry experts.",
    eligibility: "Open to TY and Final Year students.",
    image: "/images/college.jpeg",
    status: "PUBLISHED"
  }
];
