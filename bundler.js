const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;

const path = require("path");

let ID = 0;

function createAssets(filename) {
  const content = fs.readFileSync(filename, "utf-8");

  const ast = babylon.parse(content, { sourceType: "module" });

  const dependencies = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      //所有import进来文件入一个依赖数组
      dependencies.push(node.source.value);
    }
  });
  const id = ID++;

  return {
    id,
    filename,
    dependencies
  };
}
function createGraph(entry) {
  const mainAsset = createAssets(entry);
  const queue = [mainAsset];

  for (let asset of queue) {
    asset.mapping = {};
    asset.dependencies.forEach(relativePath => {
      const dirname = path.dirname(asset.filename);

      const absolutePath = path.join(dirname, relativePath);

      const child = createAssets(absolutePath);

      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }
  return queue;
}

const graph = createGraph("./example/entry.js");

console.log(graph);
