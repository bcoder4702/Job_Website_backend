"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkHealth = (req, res) => {
    res
        .status(200)
        .json({ message: 'OK - Service', uptime: process.uptime() });
};
// async function getDirectApplyLink(naukriJobUrl: string): Promise<string> {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--start-maximized"],
//   });
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1366, height: 768 });
//   try {
//     console.log(`🔹 Opening Naukri login page...`);
//     await page.goto("https://www.naukri.com/nlogin/login", { waitUntil: "networkidle2" });
//     // **Login to Naukri**
//     await page.type("#usernameField", "bitthalinv@gmail.com", { delay: 100 });
//     await page.type("#passwordField", "bits0090@", { delay: 100 });
//     await page.click('button[type="submit"]');
//     await page.waitForNavigation({ waitUntil: "networkidle2" });
//     console.log("✅ Logged in successfully!");
//     // **Go to job page**
//     console.log(`🔹 Navigating to job page: ${naukriJobUrl}`);
//     await page.goto(naukriJobUrl, { waitUntil: "networkidle2" });
//     console.log("✅ Navigated to job page");
//     // **Wait for the "Apply on company site" button**
//     await page.waitForSelector("#company-site-button", { timeout: 8000 });
//     // **Open a new tab listener**
//     const newTabPromise = new Promise<string>((resolve) => {
//       browser.once("targetcreated", async (target) => {
//         const newPage = await target.page();
//         if (newPage) {
//           await newPage.waitForNavigation({ waitUntil: "networkidle2" });
//           resolve(newPage.url());
//         }
//       });
//     });
//     // **Click the "Apply on company site" button**
//     console.log("🖱 Clicking 'Apply on company site' button...");
//     await page.click("#company-site-button");
//     // **Wait for the new tab to open and get its URL**
//     const externalApplyLink = await newTabPromise;
//     console.log("🎯 Extracted External Apply Link:", externalApplyLink);
//     await browser.close();
//     return externalApplyLink || "No external apply link found.";
//   } catch (error) {
//     console.error("❌ Error fetching apply link:", error);
//     await browser.close();
//     return "Error fetching apply link";
//   }
// }
// // **Test the function**
// const naukriJobUrl: string =
//   "https://www.naukri.com/job-listings-software-developer-5-oracle-india-pvt-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-8-years-030125504696";
// getDirectApplyLink(naukriJobUrl).then((link) =>
//   console.log("✅ Oracle Career Link:", link)
// );
exports.default = { checkHealth };
//# sourceMappingURL=health.js.map