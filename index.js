const { readdirSync, statSync } = require('fs');
const { join , basename, extname } = require('path');

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
    const folderList = this._getFolders(path);

    folderList.forEach(folder => {
      this._log(`BUILD MODULE: ${folder}`);
      const object = this._loader(path, folder);
      this._modules.set(folder, object);
    });

    if(!folderList.length) {
      const object = this._loader(path, '');
      this._modules.set('madres', object);
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
          this._log(`LOAD: ${name}/${key}/${file}`, 'blue', 3);
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
  
  _getFolders(path) { 
    return readdirSync(path).filter(f => statSync(join(path, f)).isDirectory());
  }

  _log(mesage, color = 'green', pad = 0) {
    if(this._verbose) {
      console.log(`${ANSI[color]} ${'>'.padStart(pad, '-')} ${mesage} ${ANSI.reset}`);
    }
  }

}