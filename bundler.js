const fs = require("fs");
const babylon = require("./node_modules/babylon");
function createAssets(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babylon.parse(content, { sourceType: "module" });
  console.log(ast);
}
createAssets("./example/message.js");
