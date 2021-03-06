const JSAsset = require('./JSAsset');
const config = require('../utils/config');
const localRequire = require('../utils/localRequire');

class TypeScriptAsset extends JSAsset {
  async transform() {
    this.ast = await this.parse(this.contents);
    this.isAstDirty = true;
  }

  async parse(code) {
    // require typescript, installed locally in the app
    let typescript = localRequire('typescript', this.name);

    let transpilerOptions = {
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
        jsx: true,
        noEmit: false
      },
      fileName: this.basename
    }

    let tsconfig = await config.load(this.name, ['tsconfig.json']);
    // Overwrite default if config is found
    if (tsconfig) transpilerOptions.compilerOptions = tsconfig.compilerOptions;
    transpilerOptions.compilerOptions.noEmit = false;

    // Transpile Module using TypeScript and parse result as ast format through babylon
    return await super.parse(typescript.transpileModule(code, transpilerOptions).outputText);
  }
}

module.exports = TypeScriptAsset;