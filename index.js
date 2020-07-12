const fs = require("fs");
var pjson = require("./package.json");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { execFile } = require("child_process");

class App {
    constructor(manifests) {
        this.app = null;
        this.manifests = manifests;
    }

    start() {
        this.app = this.createApi();
        return new Promise((resolve) => {
            this.app.listen(10101, "localhost", resolve);
        });
    }

    createApi() {
        const app = express();

        const router = express.Router();

        router.use(bodyParser.json());

        router.post("/info", (req, res) => {
            const manifest = this.findManifestByToken(req.body.token);
            if (!manifest) {
                res.status(404).json({ error: "Not a valid token" }).end();
                return;
            }
            res.send(manifest);
        });

        router.post("/start", async (req, res) => {
            const manifest = this.findManifestByToken(req.body.token);
            if (!manifest) {
                res.status(404).json({ error: "Not a valid token" }).end();
                return;
            }
            this.runScript(manifest, "startScript", res);
        });

        router.post("/status", async (req, res) => {
            const manifest = this.findManifestByToken(req.body.token);
            if (!manifest) {
                res.status(404).json({ error: "Not a valid token" }).end();
                return;
            }
            execFile(manifest.statusScript, (error, stdout, stderr) => {
                if (error) {
                    res.json({ appId: manifest.id, msg: stdout, errmsg: stderr, error: error });
                    return;
                }
                res.json({ appId: manifest.id, status: stdout });
            });
        });

        router.post("/stop", async (req, res) => {
            const manifest = this.findManifestByToken(req.body.token);
            if (!manifest) {
                res.status(404).json({ error: "Not a valid token" }).end();
                return;
            }
            this.runScript(manifest, "stopScript", res);
        });
        router.post("/update", async (req, res) => {
            const manifest = this.findManifestByToken(req.body.token);
            if (!manifest) {
                res.status(404).json({ error: "Not a valid token" }).end();
                return;
            }
            this.runScript(manifest, "updateScript", res);
        });

        app.use("/api/v1", router);

        app.use("/*", express.static(path.resolve(__dirname, "public")));

        return app;
    }

    findManifestByToken(token) {
        return this.manifests.find((manifest) => manifest.accessToken === token);
    }

    runScript(manifest, script, res) {
        execFile(manifest[script], (error, stdout, stderr) => {
            if (error) {
                res.json({ appId: manifest.id, msg: stdout, errmsg: stderr, error: error });
                return;
            }
            res.json({ appId: manifest.id, msg: stdout, errmsg: stderr });
        });
    }
}

(() => {
    console.log("-- Starting DEPLOYR --");
    console.log("Version: ", pjson.version);
    console.log("Reading manifest.json");
    const manifests = JSON.parse(fs.readFileSync("manifest.json"));

    console.log(" - found " + manifests.length + " entries: " + manifests.map((m) => m.id));
    const app = new App(manifests);
    app.start().then(() => {
        console.log("Server ready for e-business.");
    });
})();
