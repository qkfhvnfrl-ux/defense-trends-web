const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json"
};

const server = http.createServer((request, response) => {
    let route = decodeURI((request.url || "/").split("?")[0]);
    if (route === "/" || route === "") route = "/index.html";

    const filePath = path.resolve(root, `.${route}`);
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        fs.readFile(path.join(root, "index.html"), (fallbackError, fallbackData) => {
          if (fallbackError) {
            response.writeHead(404);
            response.end("not found");
            return;
          }
          response.writeHead(200, { "Content-Type": types[".html"] });
          response.end(fallbackData);
        });
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
      });
      response.end(data);
    });
  });

if (require.main === module) {
  server.listen(port, "127.0.0.1", () => {
    console.log(`Serving dist at http://127.0.0.1:${port}`);
  });
}

module.exports = { server, port };
