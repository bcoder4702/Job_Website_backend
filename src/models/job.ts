// export class Job {
//     company: string;
//     positionName: string;
//     location: string;
//     jobType: string[];
//     experienceRequired: string;
//     salaryRange: string;
//     jobDescription: string;
//     description: string;
//     externalApplyLink: string;
//     jobId: string;
//     postedAt: string;
//     scrapedAt: string;
//     source: string;
//     url: string;
//     logoPath: string;
//     tags: string[];
//     isExpired: boolean;
//     isSaved: boolean;
//     vacancy: number;
//     modeOfWork: string;
//     rating: number;
//     reviewsCount: number;
//     hiringCompany: string;
  
//     constructor(
//       company: string,
//       positionName: string,
//       location: string,
//       jobType: string[],
//       experienceRequired: string,
//       salaryRange: string,
//       jobDescription: string,
//       description: string,
//       externalApplyLink: string,
//       jobId: string,
//       postedAt: string,
//       scrapedAt: string,
//       source: string,
//       url: string,
//       logoPath: string,
//       tags: string[],
//       isExpired: boolean,
//       isSaved: boolean,
//       vacancy: number,
//       modeOfWork: string,
//       rating: number,
//       reviewsCount: number,
//       hiringCompany: string
//     ) {
//       this.company = company;
//       this.positionName = positionName;
//       this.location = location;
//       this.jobType = jobType;
//       this.experienceRequired = experienceRequired;
//       this.salaryRange = salaryRange;
//       this.jobDescription = jobDescription;
//       this.description = description;
//       this.externalApplyLink = externalApplyLink;
//       this.jobId = jobId;
//       this.postedAt = postedAt;
//       this.scrapedAt = scrapedAt;
//       this.source = source;
//       this.url = url;
//       this.logoPath = logoPath;
//       this.tags = tags;
//       this.isExpired = isExpired;
//       this.isSaved = isSaved;
//       this.vacancy = vacancy;
//       this.modeOfWork = modeOfWork;
//       this.rating = rating;
//       this.reviewsCount = reviewsCount;
//       this.hiringCompany = hiringCompany;
//     }
//   }
  

// export class Job {
//   companyName: string;
//   position: string;
//   location: string;
//   jobType: "full" | "part";
//   experienceRequired: number;
//   salaryRangeStart: number;
//   salaryRangeEnd: number;
//   jobDescription: string;
//   description: string;
//   externalApplyLink: string;
//   jobId: string;
//   postedAt: Date;
//   source: number;
//   logoPath: string;
//   tags: string[];
//   modeOfWork: string;
//   rating: number;
//   reviewsCount: number;

//   constructor(
//     companyName: string,
//     position: string,
//     location: string,
//     jobType: "full" | "part",
//     experienceRequired: number,
//     salaryRangeStart: number,
//     salaryRangeEnd: number,
//     jobDescription: string,
//     description: string,
//     externalApplyLink: string,
//     jobId: string,
//     postedAt: Date,
//     source: number,
//     logoPath: string,
//     tags: string[],
//     modeOfWork: string,
//     rating: number,
//     reviewsCount: number
//   ) {
//     this.companyName = companyName;
//     this.position = position;
//     this.location = location;
//     this.jobType = jobType;
//     this.experienceRequired = experienceRequired;
//     this.salaryRangeStart = salaryRangeStart;
//     this.salaryRangeEnd = salaryRangeEnd;
//     this.jobDescription = jobDescription;
//     this.description = description;
//     this.externalApplyLink = externalApplyLink;
//     this.jobId = jobId;
//     this.postedAt = postedAt;
//     this.source = source;
//     this.logoPath = logoPath;
//     this.tags = tags;
//     this.modeOfWork = modeOfWork;
//     this.rating = rating;
//     this.reviewsCount = reviewsCount;
//   }

//   private getRandomRating(): number {
//     return parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)); // Generates rating between 3.0 - 5.0
//   }

//   private getRandomReviewsCount(): number {
//     return Math.floor(Math.random() * 500) + 1; // Generates reviews count between 1 - 500
//   }
// }


export class Job {
  constructor(
    public companyName: string,
    public jobTitle: string,
    public location: string,
    public jobType: "full" | "part",
    public experienceRequired: number,
    public salaryRangeStart: number,
    public salaryRangeEnd: number,
    public jobDescription: string,
    public companyDescription: string,
    public applyLink: string,
    public jobId: string,
    public postedDate: Date,
    public vacancies: number,
    public clientLogo: string,
    public tags: string[],
    public workMode: string,
    public rating: number,
    public reviewsCount: number
  ) {}

  // Method to convert Job instance to a plain object
  toPlainObject(): Record<string, any> {
    return {
      companyName: this.companyName,
      jobTitle: this.jobTitle,
      location: this.location,
      jobType: this.jobType,
      experienceRequired: this.experienceRequired,
      salaryRangeStart: this.salaryRangeStart,
      salaryRangeEnd: this.salaryRangeEnd,
      jobDescription: this.jobDescription,
      companyDescription: this.companyDescription,
      applyLink: this.applyLink,
      jobId: this.jobId,
      postedDate: this.postedDate,
      vacancies: this.vacancies,
      clientLogo: this.clientLogo,
      tags: this.tags,
      workMode: this.workMode,
      rating: this.rating,
      reviewsCount: this.reviewsCount,
    };
  }
}