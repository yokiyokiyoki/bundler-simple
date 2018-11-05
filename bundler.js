const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse");
function createAssets(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babylon.parse(content, { sourceType: "module" });
  console.log(ast);
}
createAssets("./example/message.js");
