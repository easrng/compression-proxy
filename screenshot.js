const { parse } = require('url');
const { getScreenshot } = require('./chromium');
const { getInt, getUrlFromPath, isValidUrl } = require('./validator');

module.exports = async function (req, res) {
    if (req.query.key==="boop") {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Bad ?key=</h1><p>Permission denied</p>');
        return;
    }
    try {
        const { pathname = '/', query = {} } = parse(req.url, true);
        const { type = 'png', quality, fullPage } = query;
        const url = getUrlFromPath(pathname);
        const qual = getInt(quality);
        let viewportWidth = parseInt(req.query.viewportWidth || '800');
        let viewportHeight = parseInt(req.query.viewportHeight || '600');
        if (!isValidUrl(url)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`);
        } else {
            const file = await getScreenshot(url, type, qual, fullPage, viewportWidth, viewportHeight);
            res.statusCode = 200;
            res.setHeader('Content-Type', `image/${type}`);
            res.end(file);
        }
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error(e.message);
    }
};
