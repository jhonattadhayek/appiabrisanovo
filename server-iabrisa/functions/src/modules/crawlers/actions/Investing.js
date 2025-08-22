const puppeteer = require("puppeteer");

const FirebaseService = require("../../../config/firebase");

const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class Investing {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.adminSdk = new FirebaseService();
  }

  async init() {
    try {
      const URL = "https://br.cointelegraph.com/tags/markets";

      const USER_AGENT =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63";

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--window-size=1600,1000",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process"
        ],
        defaultViewport: {
          width: 1600,
          height: 1000
        }
      });

      const page = await browser.newPage();

      await page.setUserAgent(USER_AGENT);
      await page.goto(URL, { waitUntil: "networkidle2" });

      await sleep(1000);

      async function autoScroll(page) {
        await page.evaluate(async () => {
          await new Promise(resolve => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });
      }

      await autoScroll(page);

      const news = await page.evaluate(() => {
        const newsItems = [];
        const articles = document.querySelectorAll(
          '[data-testid="posts-listing__item"]'
        );
        const limit = 10;

        for (let i = 0; i < Math.min(articles.length, limit); i++) {
          const article = articles[i];

          const title =
            article
              .querySelector(".post-card-inline__title")
              ?.innerText.trim() || "";
          const image = article.querySelector("img.lazy-image__img")?.src || "";
          const description =
            article
              .querySelector(".post-card-inline__text")
              ?.innerText.trim() || "";
          const time =
            article
              .querySelector("time.post-card-inline__date")
              ?.innerText.trim() || "";
          const linkBase =
            article.querySelector(".post-card-inline__title-link")?.href || "";
          const link = linkBase.startsWith("/")
            ? `https://cointelegraph.com${linkBase}`
            : linkBase;

          newsItems.push({
            title,
            image,
            description,
            time,
            link
          });
        }

        return newsItems;
      });

      browser.close();

      return this.response.status(ResponseCodesEnum.OK).send(news || []);
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  handleValidationErrors(fail) {
    sendErrors(this.response, {
      status: ResponseCodesEnum.BAD_REQUEST,
      messageKey: "invalid_constraints",
      additionalData: { errors: fail?.errors }
    });
  }

  handleInternalError(error) {
    console.error("Internal Error:", error);
    sendErrors(this.response, {
      status: ResponseCodesEnum.INTERNAL_SERVER_ERROR,
      messageKey: error.message || "unknown_error"
    });
  }
}

module.exports = (request, response) => {
  const investingInstance = new Investing(request, response);
  investingInstance.init();
};
