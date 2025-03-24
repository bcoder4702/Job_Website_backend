"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseExperience = (exp) => {
    console.log("Raw Experience Query Param:", exp);
    let minExp = 0, maxExp = 50;
    if (exp.includes("-")) {
        const [min, max] = exp.split("-").map((num) => parseInt(num.trim()));
        console.log("Parsed exp Range:", { min, max });
        return { min, max };
    }
    else if (exp.includes("+")) {
        const extractedExp = parseInt(exp.split("+")[0].trim());
        console.log("Parsed exp Range:", { extractedExp, maxExp });
        return { min: extractedExp, max: 50 };
    }
    return null;
};
exports.default = parseExperience;
//# sourceMappingURL=parseExperience.js.map