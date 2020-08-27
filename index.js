const { readdirSync, statSync } = require('fs');
const { join , basename } = require('path');

module.exports = class Loader {
  constructor() {
    this._modules = new Map();
  }
  
  init(path) {

    let folderList = this._getFolders(path);

    folderList.forEach(folder => {
      console.log(`LOAD MODULE FOR: ${folder}`);
      let object = this._loader(path, folder); 
      this._modules.set(folder, object);
    });

    if(!folderList.length) {
      return this._loader(path, '');
    }
    return this._modules;
  }

  _loader(path, name, key = '') {
    const files = readdirSync(join(path, name, key));

    let object = {};

    files.forEach(file => {
      const completePath = join(path, name, key, file);
      
      if(statSync(completePath).isFile()) {
        
        const key = basename(completePath, '.js');
        object[key] = require(completePath);

      }else {
       object[file] = this._loader(path, name, file);
      }
      
    });
    return object;
  }
  
  get(name) {
    return this._modules.get(name);
  }

  _getFolders(path) { 
    return readdirSync(path).filter(f => statSync(join(path, f)).isDirectory());
  }
}