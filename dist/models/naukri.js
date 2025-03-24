"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaukriJobListing = exports.AmbitionBoxData = exports.Placeholder = void 0;
class Placeholder {
    constructor(type, label) {
        this.type = type;
        this.label = label;
    }
}
exports.Placeholder = Placeholder;
class AmbitionBoxData {
    constructor(Url, ReviewsCount, AggregateRating, Title) {
        this.Url = Url;
        this.ReviewsCount = ReviewsCount;
        this.AggregateRating = AggregateRating;
        this.Title = Title;
    }
}
exports.AmbitionBoxData = AmbitionBoxData;
class NaukriJobListing {
    constructor(title, logoPath, logoPathV3, jobId, currency, footerPlaceholderLabel, footerPlaceholderColor, companyName, isSaved, tagsAndSkills, placeholders, companyId, jdURL, staticUrl, ambitionBoxData, jobDescription, showMultipleApply, groupId, isTopGroup, createdDate, mode, clientLogo, board, vacancy) {
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
exports.NaukriJobListing = NaukriJobListing;
//# sourceMappingURL=naukri.js.map