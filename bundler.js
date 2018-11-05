const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const babel = require("babel-core");

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
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"]
  });

  return {
    id,
    filename,
    dependencies,
    code
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

function bundle(graph) {
  let modules = "";
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function(require,module,exports){
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ],`;
  });

  const result = `
    (function(modules){
      function require(id){
        const [fn,mapping]=modules[id]

        function localRequire(relativePath){
          return require(mapping[relativePath])
        }
        const module={exports:{}}

        fn(localRequire,module,module.exports)

        return module.exports
        
      }
      require(0)
    })({${modules}})`;
  return result;
}

const graph = createGraph("./example/entry.js");

const result = bundle(graph);

console.log(result);
