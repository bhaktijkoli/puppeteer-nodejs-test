const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");
const path = require('path');
const dir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const file = fs.createWriteStream(path.join(dir, "test.webm"));
async function record() {
    const browser = await launch({
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    });

    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/watch?v=_kUrW9SEaJc");
    const stream = await getStream(page, { audio: true, video: true });
    console.log("recording");

    stream.pipe(file);
    setTimeout(async () => {
        await stream.destroy();
        file.close();
        console.log("finished");
    }, 1000 * 10);
}

record();