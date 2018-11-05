const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
function createAssets(filename) {
  const content = fs.readFileSync(filename, "utf-8");

  const ast = babylon.parse(content, { sourceType: "module" });

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      console.log(node);
    }
  });
}
createAssets("./example/message.js");
