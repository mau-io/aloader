const { readdirSync, statSync } = require('fs');
const { join, basename, extname } = require('path');

const ANSI = {
  reset: '\033[0m',
  red:   '\033[31m',
  green: '\033[32m',
  blue:  '\033[34m',
}

const _getElements = (path) => { 
  return readdirSync(path)
    .map(
      (name) => ({
        name,
        isFile: statSync(join(path, name)).isFile()
      })
    );
}

module.exports = ({ path, verbose = false }) => {

  const modules = new Map();
  const elements = _getElements(path);

  const _log = (mesage, color = 'green', pad = 0) => {
    if(verbose) {
      console.log(`${ANSI[color]} ${'>'.padStart(pad, '-')} ${mesage} ${ANSI.reset}`);
    }
  }
  
  const _loader = (path, name, key = '') => {
    const files = readdirSync(join(path, name, key));
  
    let object = {};
  
    files.forEach(file => {
      const completePath = join(path, name, key, file);
      
      if(statSync(completePath).isFile()) {
    
        if(extname(file) === '.js') {
          _log(`LOAD FILE: ${name}/${key}/${file}`, 'blue', 4);
          const prop = basename(completePath, '.js');
          object[prop] = require(completePath);
        }
        
      } 
      else {
       object[file] = _loader(path, name, file);
      }
      
    });
  
    return object;
  }
 
  for(const element of elements) {
 
    if(element.isFile) {
      _log(`LOAD FILE: /${element.name}`, 'blue', 4);
      const completePath = join(path, element.name);
      const prop = basename(completePath, '.js');
      const object = require(completePath);
     modules.set(prop, object);
    }
    else {
      _log(`LOAD SUBMODULE: ${element.name}`);
      const object = _loader(path, element.name);
     modules.set(element.name, object);
    }    
  }
  return modules;

}
