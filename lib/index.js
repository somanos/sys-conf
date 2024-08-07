const { template: Template } = require("lodash");
const {
  mkdirSync,
  writeSync,
  openSync,
  statSync,
  close,
  readFileSync,
  existsSync
} = require("fs");

const { readdir } = require("fs/promises");

const { dirname, resolve, join, normalize } = require("path");

/**
 * 
 * @param {*} err 
 */
function __error(err) {
  if (err) throw err;
};

/**
 * 
 */
function parse(file, data, conflictPolicy) {
  if (!existsSync(file)) {
    console.error(`Template file ${file} was not found`);
    return null;
  }
  let str = readFileSync(file);
  let lines = String(str).toString().split('\n');
  let res = {}
  for (let line of lines) {
    line = line.trim();
    line = line.replace(/\#.*$/, '');
    let [key, value] = line.split(/={1,}/);
    if (data[key] || data[key]) {
      if (conflictPolicy == 'overwrite') {
        console.log(`Overwrite existing key ${key}`);
        data[key] = value;
        res[key] = value;
      } else {
        console.log(`Skipping existing key ${key}`)
      }
    } else {
      res[key] = value;
      data[key] = value;
    }
  }
  return res;
};

/**
 * 
 */
function render(data, tpl, parse) {
  if (!existsSync(tpl)) {
    console.error(`Template file ${tpl} was not found`);
    return null;
  }
  console.log("Rendering from", tpl)
  let str = readFileSync(tpl);
  try {
    let res = Template(String(str).toString())(data);
    if (parse && typeof res === "string") {
      return JSON.parse(res);
    }
    return res;
  } catch (e) {
    console.error(`Failed to render from template ${tpl}`);
    console.error("------------\n", e);
  }
};

/**
 *
 * @param {*} data
 * @param {*} args
 * @returns
 */
function write(data, args) {
  let { out, tpl } = args;
  if (!out) {
    throw "Undefined output file"
  }
  if (!tpl) {
    throw "Undefined template file"
  }
  let dname = dirname(out);
  mkdirSync(dname, { recursive: true });

  console.log(`Rendering template tpl ${out}`);
  let fd = openSync(out, "w+");
  writeSync(fd, render(data, tpl));
  close(fd, __error);
}
/**
 *
 */
async function walkDir(dirname) {
  let items = [];

  const walk = async (dir) => {
    try {
      const files = await readdir(dir);
      for (const file of files) {
        let realpath = resolve(dir, file);
        let stat = statSync(realpath);
        if (stat.isDirectory()){
          await walk(realpath);
        } else{
          items.push(realpath);
        }
      }
    } catch (err) {
      console.trace();
      console.error(err);
    }
  };
  await walk(dirname);
  return items;
}
/**
 * 
 */
function absolutePath(dir) {
  if (/^\/.+/.test(dir)) {
    return normalize(dir)
  }
  if (/^\~.+/.test(dir)) {
    dir = dir.replace(/^\~/, process.env.HOME);
    return normalize(dir)
  }
  return normalize(join(process.env.PWD, dir))
}


module.exports = {
  write,
  walkDir,
  render,
  parse,
  absolutePath
};
