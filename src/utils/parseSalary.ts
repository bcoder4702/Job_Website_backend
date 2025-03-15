const parseSalary = (salary: string) => {
    console.log("Raw Salary Query Param:", salary);
    let minSalary = 0, maxSalary = Infinity;
  
    if (salary.includes("-")) {
      const [min, max] = salary.split("-").map((num) => parseInt(num.trim()));
      console.log("Parsed Salary Range:", { min, max });
      return { min, max };
    } else if (salary.includes("+")) {
      const extractedSalary = parseInt(salary.split("+")[0].trim());
      console.log("Parsed Salary Range:", { extractedSalary, maxSalary });
      return { min: extractedSalary, max: Infinity };
    }
  
    return null;
  }

  export default parseSalary;