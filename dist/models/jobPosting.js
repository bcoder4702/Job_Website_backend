"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPosting = exports.Source = exports.ModeOfWork = exports.JobType = exports.Position = exports.Category = void 0;
var Category;
(function (Category) {
    Category["DEVELOPMENT"] = "Development";
    Category["TESTING"] = "Testing";
    Category["DESIGN"] = "Design";
    Category["MARKETING"] = "Marketing";
    Category["SUPPORT"] = "Support";
    Category["ENGINEERING"] = "Engineering";
    Category["SALES"] = "Sales";
    Category["OTHER"] = "Other";
})(Category || (exports.Category = Category = {}));
var Position;
(function (Position) {
    // Software Development
    Position["ASE"] = "Associate Software Engineer";
    Position["ASD"] = "Associate Software Developer";
    Position["SDE"] = "Software Development Engineer";
    Position["SD"] = "Software Developer";
    Position["SE"] = "Software Engineer";
    Position["SSE"] = "Senior Software Engineer";
    Position["TL"] = "Tech Lead";
    Position["ATL"] = "Associate Tech Lead";
    Position["PL"] = "Project Lead";
    Position["PM"] = "Project Manager";
    Position["EM"] = "Engineering Manager";
    Position["SDE1"] = "Software Development Engineer 1";
    Position["SDE2"] = "Software Development Engineer 2";
    Position["SDE3"] = "Software Development Engineer 3";
    Position["ARCHITECT"] = "Software Architect";
    Position["PRINCIPAL_ENGINEER"] = "Principal Engineer";
    Position["CTO"] = "Chief Technology Officer";
    Position["INTERN"] = "Software Engineering Intern";
    Position["TRAINEE"] = "Software Trainee";
    // Full-Stack, Frontend, Backend
    Position["FULL_STACK_DEV"] = "Full Stack Developer";
    Position["FRONTEND_DEV"] = "Frontend Developer";
    Position["BACKEND_DEV"] = "Backend Developer";
    Position["MOBILE_DEV"] = "Mobile Developer";
    // DevOps & Cloud
    Position["DEVOPS_ENGINEER"] = "DevOps Engineer";
    Position["CLOUD_ENGINEER"] = "Cloud Engineer";
    Position["SITE_RELIABILITY_ENGINEER"] = "Site Reliability Engineer";
    Position["SYSTEM_ADMIN"] = "System Administrator";
    Position["PLATFORM_ENGINEER"] = "Platform Engineer";
    Position["INFRASTRUCTURE_ENGINEER"] = "Infrastructure Engineer";
    // Data Science, AI/ML, and Big Data
    Position["DATA_SCIENTIST"] = "Data Scientist";
    Position["ML_ENGINEER"] = "Machine Learning Engineer";
    Position["AI_ENGINEER"] = "AI Engineer";
    Position["DATA_ENGINEER"] = "Data Engineer";
    Position["DATABASE_ADMIN"] = "Database Administrator";
    Position["BIG_DATA_ENGINEER"] = "Big Data Engineer";
    Position["BUSINESS_INTELLIGENCE_ANALYST"] = "Business Intelligence Analyst";
    Position["STATISTICIAN"] = "Statistician";
    // Cybersecurity
    Position["SECURITY_ENGINEER"] = "Security Engineer";
    Position["ETHICAL_HACKER"] = "Ethical Hacker";
    Position["CYBERSECURITY_ANALYST"] = "Cybersecurity Analyst";
    Position["PENETRATION_TESTER"] = "Penetration Tester";
    Position["NETWORK_SECURITY_ENGINEER"] = "Network Security Engineer";
    // Networking & Systems
    Position["NETWORK_ENGINEER"] = "Network Engineer";
    Position["SYSTEMS_ENGINEER"] = "Systems Engineer";
    Position["IT_ADMIN"] = "IT Administrator";
    // Testing & Quality Assurance
    Position["QA_ENGINEER"] = "QA Engineer";
    Position["TEST_ENGINEER"] = "Test Engineer";
    Position["AUTOMATION_TEST_ENGINEER"] = "Automation Test Engineer";
    Position["MANUAL_TEST_ENGINEER"] = "Manual Test Engineer";
    Position["PERFORMANCE_TEST_ENGINEER"] = "Performance Test Engineer";
    Position["SECURITY_TEST_ENGINEER"] = "Security Test Engineer";
    // UI/UX & Design
    Position["UI_UX_DESIGNER"] = "UI/UX Designer";
    Position["GRAPHIC_DESIGNER"] = "Graphic Designer";
    Position["PRODUCT_DESIGNER"] = "Product Designer";
    // Game Development & Emerging Tech
    Position["GAME_DEVELOPER"] = "Game Developer";
    Position["BLOCKCHAIN_DEVELOPER"] = "Blockchain Developer";
    Position["EMBEDDED_ENGINEER"] = "Embedded Systems Engineer";
    Position["ROBOTICS_ENGINEER"] = "Robotics Engineer";
    Position["AR_VR_ENGINEER"] = "AR/VR Engineer";
    Position["IOT_ENGINEER"] = "IoT Engineer";
    // Technical Support & Consulting
    Position["TECHNICAL_SUPPORT_ENGINEER"] = "Technical Support Engineer";
    Position["IT_SUPPORT_SPECIALIST"] = "IT Support Specialist";
    Position["SOFTWARE_CONSULTANT"] = "Software Consultant";
    Position["PRODUCT_MANAGER"] = "Product Manager";
    Position["TECHNICAL_WRITER"] = "Technical Writer";
    Position["OTHER"] = "Other";
})(Position || (exports.Position = Position = {}));
var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "full";
    JobType["PART_TIME"] = "part";
    JobType["CONTRACT"] = "contract";
    JobType["INTERNSHIP"] = "internship";
})(JobType || (exports.JobType = JobType = {}));
var ModeOfWork;
(function (ModeOfWork) {
    ModeOfWork["REMOTE"] = "Remote";
    ModeOfWork["HYBRID"] = "Hybrid";
    ModeOfWork["ONSITE"] = "Onsite";
})(ModeOfWork || (exports.ModeOfWork = ModeOfWork = {}));
var Source;
(function (Source) {
    Source["NAUKRI"] = "Naukri";
    Source["LINKEDIN"] = "LinkedIn";
    Source["INDEED"] = "Indeed";
    Source["MONSTER"] = "Monster";
    Source["GLASSDOOR"] = "Glassdoor";
})(Source || (exports.Source = Source = {}));
/*export class JobPosting {
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
*/
class JobPosting {
    constructor(jobId, company, category, position, jobType, experienceMin, experienceMax, salaryRangeStart, salaryRangeEnd, jobDescription, createdAt, source, locations, modesOfWork, tags) {
        this.jobId = jobId;
        this.company = company;
        this.category = category;
        this.position = position;
        this.jobType = jobType;
        this.experienceMin = experienceMin;
        this.experienceMax = experienceMax;
        this.salaryRangeStart = salaryRangeStart;
        this.salaryRangeEnd = salaryRangeEnd;
        this.jobDescription = jobDescription;
        this.createdAt = createdAt;
        this.source = source;
        this.locations = locations;
        this.modesOfWork = modesOfWork;
        this.tags = tags;
    }
}
exports.JobPosting = JobPosting;
//# sourceMappingURL=jobPosting.js.map