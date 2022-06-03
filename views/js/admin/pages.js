const fs = require("fs");
const path = require("path");
const cfgPath = path.resolve("./config.json");
const config = require(cfgPath);
const glob = require("tiny-glob");
const showdown = require("showdown");
const converter = new showdown.Converter(showdownConverter());

module.exports = function (fastify, opts, next) {
    // Removing cache control for each request except main page
    fastify.addHook("onRequest", async (req, res) => {
        if (!req.url) return;
        res.headers({
            "Cache-Control": "no-store, max-age=0, must-revalidate",
            Expires: "0",
            Pragma: "no-cache",
            "Surrogate-Control": "no-store",
        });
    });

    // Modify the file
    fastify
        .get("/modify", async (req, res) => {
            let page = decodeURI(req.query.path);
            if (page === "/") page = "home";
            let filePath = `./pages/${page}.md`;
            if (!page || !fs.existsSync(filePath))
                return res.code(404).send({ statusCode: 404 }); // Soon
            let content = fs.readFileSync(filePath, "utf-8");
            content = await fastify.view("./content/admin/pages/editor.html", {
                content: fs.readFileSync(filePath, "utf-8"),
                page: page,
            });

            res.code(200).view(`./themes/${config.Theme}/main.html`, {
                content: content,
                header: headerJSON(),
                sidebar: sidebarJSON(),
                footer: converter.makeHtml(config.Content.Footer),
            });
        })
        .post("/modify", (req, res) => {
            let text = req.body.text;
            let name = req.query.path;
            if (!text || !name) return res.send({ statusCode: 404 });
            fs.writeFileSync(`pages/${name}.md`, text);
            convertPages(fastify);
            res.code(301).redirect(config["Admin Dashboard Prefix"] + "/pages");
        });

    fastify.post("/previewText", async (req, res) => {
        let text = JSON.parse(req.body).text;
        if (!text) return res.code(400).send({ statusCode: 400, reason: "Missing text" });

        res.code(200).send({ content: render(text).content });
    });

    fastify.post("/preview", (req, res) => {
        let text = req.body.text;
        if (!text) return res.send({ statusCode: 404 });
        res.code(200).view(`./themes/${config.Theme}/main.html`, render(text));
    });

    fastify
        .get("/create", (req, res) => {
            res.code(200).view("./content/admin/html/main.html", {
                url: "create-page",
            });
        })
        .post("/create", (req, res) => {
            let name = req.body["page-name"];
            if (!name) return res.send({ statusCode: 404 });
            // Prettifying
            name = name.toLowerCase();
            fs.mkdirSync(`pages/${path.dirname(name)}`, {
                recursive: true,
                force: true,
            });
            fs.writeFileSync(`pages/${name}.md`, "");
            res.code(301).redirect(`modify?path=${name}`);
        });

    // Page delete link
    fastify.get("/delete", (req, res) => {
        let page = decodeURI(req.query.path);
        console.log(page);
        if (page == "home" || !page || !fs.existsSync(`./pages/${page}.md`))
            return res.code(404).send({ statusCode: 404 }); // Soon
        fs.rmSync(`./pages/${page}.md`, { recursive: true });
        convertPages(fastify);
        res.code(301).redirect(`${config["Admin Dashboard Prefix"]}/pages`);
    });

    // Main pages web page
    fastify.get("", async (req, res) => {
        var content = `
        <div class="box">
            <button onclick="window.location.href='pages/create'">New Page</button>
            <button onclick="window.location.href='settings/pages'">Settings</button>
        </div>`;
        const files = await glob("./pages/**/*.md");
        files.forEach((filePath) => {
            let purePath = filePath.slice(5, -3).replace(/\\/g, "/");
            let del = ` - <a href="pages/delete?path=${purePath}" class="red-a">delete</a>`;
            if (purePath === "/home") {
                purePath = "/";
                del = "";
            }
            let timestamp = fs.statSync(filePath).mtime;
            let name = path.basename(filePath).slice(0, -3);
            content += `
            <div class="box">
                <label>${beautify(name)}<span> ${purePath}</span></label>
                <span><a href="pages/modify?path=${purePath}">modify</a>${del} - ${getFormatTime(
                timestamp
            )}</span>
            </div>`;
        });
        await res.code(200).view("./content/admin/html/main.html", {
            url: "pages",
            content: content,
        });
    });
    next();
};
