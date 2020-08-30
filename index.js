const { readdirSync, statSync } = require('fs');
const { join, basename, extname } = require('path');

const ANSI = {
  reset: '\033[0m',
  red:   '\033[31m',
  green: '\033[32m',
  blue:  '\033[34m',
}

module.exports = class Loader {

  constructor({verbose = false } = {}) {
    this._verbose = verbose;
    this._modules;
  }
  
  path(path) {
    this._modules = new Map();
    const elements = this._getElements(path);

    for(const element of elements) {
   
      if(element.isFile) {
        this._log(`LOAD FILE: /${element.name}`, 'blue', 4);
        const completePath = join(path, element.name);
        const prop = basename(completePath, '.js');
        const object = require(completePath);
        this._modules.set(prop, object);
      }
      else {
        this._log(`LOAD SUBMODULE: ${element.name}`);
        const object = this._loader(path, element.name);
        this._modules.set(element.name, object);
      }    
    }
    return this._modules;
  }

  get(name) {
    return this._modules.get(name);
  }

  _loader(path, name, key = '') {
    const files = readdirSync(join(path, name, key));

    let object = {};

    files.forEach(file => {
      const completePath = join(path, name, key, file);
      
      if(statSync(completePath).isFile()) {
    
        if(extname(file) === '.js') {
          this._log(`LOAD FILE: ${name}/${key}/${file}`, 'blue', 4);
          const prop = basename(completePath, '.js');
          object[prop] = require(completePath);
        }
        
      } 
      else {
       object[file] = this._loader(path, name, file);
      }
      
    });

    return object;
  }
  
  _getElements(path) { 
    return readdirSync(path)
      .map(
        (name) => ({
          name,
          isFile: statSync(join(path, name)).isFile()
        })
      );
  }

  _log(mesage, color = 'green', pad = 0) {
    if(this._verbose) {
      console.log(`${ANSI[color]} ${'>'.padStart(pad, '-')} ${mesage} ${ANSI.reset}`);
    }
  }

}