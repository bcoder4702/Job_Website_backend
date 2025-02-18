export class Placeholder {
    type: string;
    label: string;
  
    constructor(type: string, label: string) {
      this.type = type;
      this.label = label;
    }
  }
  
  export class AmbitionBoxData {
    Url: string;
    ReviewsCount: number;
    AggregateRating: string;
    Title: string;
  
    constructor(Url: string, ReviewsCount: number, AggregateRating: string, Title: string) {
      this.Url = Url;
      this.ReviewsCount = ReviewsCount;
      this.AggregateRating = AggregateRating;
      this.Title = Title;
    }
  }
  
  export class NaukriJobListing {
    title: string;
    logoPath: string;
    logoPathV3: string;
    jobId: string;
    currency: string;
    footerPlaceholderLabel: string;
    footerPlaceholderColor: string;
    companyName: string;
    isSaved: boolean;
    tagsAndSkills: string;
    placeholders: Placeholder[];
    companyId: number;
    jdURL: string;
    staticUrl: string;
    ambitionBoxData: AmbitionBoxData;
    jobDescription: string;
    showMultipleApply: boolean;
    groupId: number;
    isTopGroup: number;
    createdDate: number;
    mode: string;
    clientLogo: string;
    board: string;
    vacancy: number;
  
    constructor(
      title: string,
      logoPath: string,
      logoPathV3: string,
      jobId: string,
      currency: string,
      footerPlaceholderLabel: string,
      footerPlaceholderColor: string,
      companyName: string,
      isSaved: boolean,
      tagsAndSkills: string,
      placeholders: Placeholder[],
      companyId: number,
      jdURL: string,
      staticUrl: string,
      ambitionBoxData: AmbitionBoxData,
      jobDescription: string,
      showMultipleApply: boolean,
      groupId: number,
      isTopGroup: number,
      createdDate: number,
      mode: string,
      clientLogo: string,
      board: string,
      vacancy: number
    ) {
      this.title = title;
      this.logoPath = logoPath;
      this.logoPathV3 = logoPathV3;
      this.jobId = jobId;
      this.currency = currency;
      this.footerPlaceholderLabel = footerPlaceholderLabel;
      this.footerPlaceholderColor = footerPlaceholderColor;
      this.companyName = companyName;
      this.isSaved = isSaved;
      this.tagsAndSkills = tagsAndSkills;
      this.placeholders = placeholders;
      this.companyId = companyId;
      this.jdURL = jdURL;
      this.staticUrl = staticUrl;
      this.ambitionBoxData = ambitionBoxData;
      this.jobDescription = jobDescription;
      this.showMultipleApply = showMultipleApply;
      this.groupId = groupId;
      this.isTopGroup = isTopGroup;
      this.createdDate = createdDate;
      this.mode = mode;
      this.clientLogo = clientLogo;
      this.board = board;
      this.vacancy = vacancy;
    }
  }