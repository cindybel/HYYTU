const path=require('node:path');
const base='C:/Users/VJs DMTeam/AppData/Local/Temp/vj-simulator-qa/node_modules';
require(base+'/esbuild').buildSync({stdin:{contents:"import * as THREE from 'three'; import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'; window.THREE={...THREE,GLTFLoader};",resolveDir:base},bundle:true,minify:true,format:'iife',outfile:path.resolve('assets/vendor/three-v150.js')});
