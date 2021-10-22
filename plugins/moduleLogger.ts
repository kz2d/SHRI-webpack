import { Compiler } from 'webpack';
import * as fs from 'fs';
import path from 'path';

class ModuleLogger {
    src: string;
    arr = new Set<string>();
    constructor(src: string, option?: { exclude?: string[] }) {
        this.src = src;
        option.exclude?.forEach(element => {
            this.arr.add(path.resolve(src, element));
        });
    }

    apply(compiler: Compiler) {
        this.src = path.resolve(compiler.root.context, this.src);
        compiler.hooks.normalModuleFactory.tap('ModuleLogger', normalModuleFactory => {
            normalModuleFactory.hooks.module.tap('ModuleLogger', (_module, _createData, resolveData) => {
                // @ts-ignore
                // console.log(_createData.resource );

                // console.log(resolveData.context);
                this.arr.add(_createData.resource);
                return _module;
            });
        });
        compiler.hooks.done.tap('ModuleLogger', async () => {
            let ans: string[] = [];
            console.log(this.src);

            let readDir = async (DirPath: string) => {
                const files = fs.readdirSync(DirPath, { withFileTypes: true });

                for (let i = 0; i < files.length; i++) {
                    const pathToObject = path.resolve(DirPath, files[i].name);
                    if (files[i].isDirectory()) {
                        await readDir(pathToObject);
                    } else {
                        if (!this.arr.has(pathToObject)) {
                            console.log(pathToObject);
                            ans.push(pathToObject);
                        }
                    }
                }
            };
            await readDir(this.src);
            console.log(ans);

            fs.writeFile(path.resolve(compiler.root.context, 'unused'), JSON.stringify(ans), () => {});
            // console.log(this.arr);
        });
    }
}

export default ModuleLogger;
