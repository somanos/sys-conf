#!/usr/bin/env node
const { exit } = process;
const { basename } = require("path");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { argv } = yargs(hideBin(process.argv))
const { 
  data:dataDir, 
  templates:tplDir, 
  output:outputDir, 
  $0: script, 
  conflictPolicy 
} = argv;
const { walkDir, absolutePath, parse, write} = require("./lib");
function usage() {
  console.log(`Usage: ${script} --data --templates --output`);
  exit(1);
}

if (!dataDir || !tplDir || !outputDir) {
  usage();
}

let dataPath = absolutePath(dataDir);
let confPath = absolutePath(tplDir);
let outputPath = absolutePath(outputDir);

walkDir(dataPath).then((files) => {
  console.log("Data files to be collected", files);
  let data = {};
  for (let file of files) {
    parse(file, data, conflictPolicy);
  }
  console.log("Data collected ", data)
  walkDir(confPath).then((files) => {
    console.log("Selected template files", files);
    for (let tpl of files) {
      let [name, ext] = basename(tpl).split(/\.+/);
      let out = tpl.replace(new RegExp('^' + confPath), outputPath);
      if (/^map:.+$/.test(name)) {
        let key1 = name.replace(/(map:)|(\..+$)/g, '');
        let key2 = key1.replace(/-/g, '_');
        let val = (data[key1] ||  data[key2]);
        out=out.replace(new RegExp(`${name}`), val);
      }
      data.date = new Date();
      write(data, { tpl, out})
    }
  })
})