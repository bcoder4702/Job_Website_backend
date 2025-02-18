import { Timestamp } from "firebase/firestore"; // Importing Firestore Timestamp

export enum Category {
  DEVELOPMENT = "Development",
  TESTING = "Testing",
  DESIGN = "Design",
  MARKETING = "Marketing",
  SUPPORT = "Support",
  ENGINEERING = "Engineering",
  SALES = "Sales",
}

export enum Position {
    // Software Development
    ASE = "Associate Software Engineer",
    ASD = "Associate Software Developer",
    SDE = "Software Development Engineer",
    SD = "Software Developer",
    SE = "Software Engineer",
    SSE = "Senior Software Engineer",
    TL = "Tech Lead",
    ATL = "Associate Tech Lead",
    PL = "Project Lead",
    PM = "Project Manager",
    EM = "Engineering Manager",
    SDE1 = "Software Development Engineer 1",
    SDE2 = "Software Development Engineer 2",
    SDE3 = "Software Development Engineer 3",
    ARCHITECT = "Software Architect",
    PRINCIPAL_ENGINEER = "Principal Engineer",
    CTO = "Chief Technology Officer",
    INTERN = "Software Engineering Intern",
    TRAINEE = "Software Trainee",
  
    // Full-Stack, Frontend, Backend
    FULL_STACK_DEV = "Full Stack Developer",
    FRONTEND_DEV = "Frontend Developer",
    BACKEND_DEV = "Backend Developer",
    MOBILE_DEV = "Mobile Developer",
  
    // DevOps & Cloud
    DEVOPS_ENGINEER = "DevOps Engineer",
    CLOUD_ENGINEER = "Cloud Engineer",
    SITE_RELIABILITY_ENGINEER = "Site Reliability Engineer",
    SYSTEM_ADMIN = "System Administrator",
    PLATFORM_ENGINEER = "Platform Engineer",
    INFRASTRUCTURE_ENGINEER = "Infrastructure Engineer",
  
    // Data Science, AI/ML, and Big Data
    DATA_SCIENTIST = "Data Scientist",
    ML_ENGINEER = "Machine Learning Engineer",
    AI_ENGINEER = "AI Engineer",
    DATA_ENGINEER = "Data Engineer",
    DATABASE_ADMIN = "Database Administrator",
    BIG_DATA_ENGINEER = "Big Data Engineer",
    BUSINESS_INTELLIGENCE_ANALYST = "Business Intelligence Analyst",
    STATISTICIAN = "Statistician",
  
    // Cybersecurity
    SECURITY_ENGINEER = "Security Engineer",
    ETHICAL_HACKER = "Ethical Hacker",
    CYBERSECURITY_ANALYST = "Cybersecurity Analyst",
    PENETRATION_TESTER = "Penetration Tester",
    NETWORK_SECURITY_ENGINEER = "Network Security Engineer",
  
    // Networking & Systems
    NETWORK_ENGINEER = "Network Engineer",
    SYSTEMS_ENGINEER = "Systems Engineer",
    IT_ADMIN = "IT Administrator",
  
    // Testing & Quality Assurance
    QA_ENGINEER = "QA Engineer",
    TEST_ENGINEER = "Test Engineer",
    AUTOMATION_TEST_ENGINEER = "Automation Test Engineer",
    MANUAL_TEST_ENGINEER = "Manual Test Engineer",
    PERFORMANCE_TEST_ENGINEER = "Performance Test Engineer",
    SECURITY_TEST_ENGINEER = "Security Test Engineer",
  
    // UI/UX & Design
    UI_UX_DESIGNER = "UI/UX Designer",
    GRAPHIC_DESIGNER = "Graphic Designer",
    PRODUCT_DESIGNER = "Product Designer",
  
    // Game Development & Emerging Tech
    GAME_DEVELOPER = "Game Developer",
    BLOCKCHAIN_DEVELOPER = "Blockchain Developer",
    EMBEDDED_ENGINEER = "Embedded Systems Engineer",
    ROBOTICS_ENGINEER = "Robotics Engineer",
    AR_VR_ENGINEER = "AR/VR Engineer",
    IOT_ENGINEER = "IoT Engineer",
  
    // Technical Support & Consulting
    TECHNICAL_SUPPORT_ENGINEER = "Technical Support Engineer",
    IT_SUPPORT_SPECIALIST = "IT Support Specialist",
    SOFTWARE_CONSULTANT = "Software Consultant",
    PRODUCT_MANAGER = "Product Manager",
    TECHNICAL_WRITER = "Technical Writer",
}
  

export enum JobType {
  FULL_TIME = "full",
  PART_TIME = "part",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
}

export enum ModeOfWork {
  REMOTE = "Remote",
  HYBRID = "Hybrid",
  ONSITE = "Onsite",
}

export enum Source {
  NAUKRI = "Naukri",
  LINKEDIN = "LinkedIn",
  INDEED = "Indeed",
  MONSTER = "Monster",
  GLASSDOOR = "Glassdoor",
}

export class JobPosting {
  constructor(
    public jobId: string,
    public company: {
      name: string;
      description?: string;
      logoPath?: string;
      rating?: number;
      reviewsCount?: number;
      applyLink: string;
      postedAt: Timestamp;
    },
    public category: Category,
    public position: Position,
    public jobType: JobType,
    public experienceMin: number,
    public experienceMax: number,
    public salaryRangeStart: number,
    public salaryRangeEnd: number,
    public jobDescription: string,
    public createdAt: Timestamp,
    public source: Source,
    public locations: string[], // Array of locations
    public modesOfWork: ModeOfWork,
    public tags?: string[]
  ) {}

  // Method to convert JobPosting instance to a plain object
  toPlainObject(): Record<string, any> {
    return {
      jobId: this.jobId,
      company: this.company,
      category: this.category,
      position: this.position,
      jobType: this.jobType,
      experienceMin: this.experienceMin,
      experienceMax: this.experienceMax,
      salaryRangeStart: this.salaryRangeStart,
      salaryRangeEnd: this.salaryRangeEnd,
      jobDescription: this.jobDescription,
      createdAt: this.createdAt,
      source: this.source,
      locations: this.locations,
      modesOfWork: this.modesOfWork,
      tags: this.tags,
    };
  }
}
