// Life Abroad 3D — licensed CC0 asset-mode character pipeline.
// Source: Quaternius Ultimate Modular Men & Women, via trebeljahr/quaternius-showcase.
// https://github.com/trebeljahr/quaternius-showcase/blob/main/LICENSES.md
// Remote GLBs are streamed on first use; procedural rigs remain as offline fallback.
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/utils/SkeletonUtils.js';

const ROOT='https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/main/public/glb/';
const VARIANTS=[
 'modular_men/Casual.glb','modular_women/Casual.glb',
 'modular_men/Casual2.glb','modular_women/Worker.glb',
 'modular_men/Worker.glb','modular_women/Formal.glb',
 'modular_men/Suit.glb','modular_women/Suit.glb'
];
const loader=new GLTFLoader();
const cache=new Map();
let active=true;
export function setAssetMode(on){active=Boolean(on)}
export function isAssetMode(){return active}
function load(path){
 if(!cache.has(path))cache.set(path,new Promise((resolve,reject)=>{
  loader.load(ROOT+path,resolve,undefined,reject);
 }));
 return cache.get(path);
}
export function outfitAsset(index=0){return VARIANTS[((index%VARIANTS.length)+VARIANTS.length)%VARIANTS.length]}
export function applyCharacterAsset(THREE,character,opts={},index=0,onReady=()=>{}){
 let cancelled=false,model=null,mixer=null,actions={},baseY=0;
 const originalAnim=character.anim;
 const originalDispose=character.dispose;
 const path=outfitAsset(index);
 load(path).then(gltf=>{
  if(cancelled||!active)return;
  model=cloneSkeleton(gltf.scene);
  const bounds=new THREE.Box3().setFromObject(model);
  const dimensions=new THREE.Vector3();bounds.getSize(dimensions);
  if(dimensions.y<.01)throw new Error('Invalid character asset bounds');
  // Quaternius meshes have their own original dimensions: fit them to current collision footprint.
  const desiredHeight=opts.age==='child'?1.95:opts.age==='teen'?2.38:opts.age==='senior'?2.43:2.65;
  const scale=desiredHeight/dimensions.y;
  model.scale.setScalar(scale);
  model.position.set(-(bounds.min.x+bounds.max.x)*.5*scale,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*.5*scale);
  baseY=model.position.y;
  model.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}});
  character.group.add(model);
  character.rig.visible=false;
  if(gltf.animations.length){
   mixer=new THREE.AnimationMixer(model);
   for(const clip of gltf.animations)actions[clip.name.toLowerCase()]=mixer.clipAction(clip);
  }
  let lastTime=null,lastState='';
  const choose=(words)=>Object.entries(actions).find(([name])=>words.some(x=>name.includes(x)))?.[1];
  const idle=choose(['idle','breath','stand'])||Object.values(actions)[0];
  const walk=choose(['walk','run','locomotion'])||idle;
  const speak=choose(['talk','speak','gesture','wave'])||idle;
  character.anim=(time,speed=0,talking=false)=>{
   const next=talking?speak:speed>.22?walk:idle;
   if(next&&next!==character._assetAction){
    if(character._assetAction)character._assetAction.fadeOut(.18);
    next.reset().fadeIn(.18).play();character._assetAction=next;
   }
   const dt=lastTime===null?0:Math.min(.08,Math.max(0,time-lastTime));
   lastTime=time;
   if(mixer)mixer.update(dt);
   if(!mixer){model.position.y=baseY+(speed>.22?Math.abs(Math.sin(time*8))*.035:0);model.rotation.z=speed>.22?Math.sin(time*8)*.012:0;}
   // Gentle non-skeletal motion for models lacking embedded clips.
  };
  onReady();
 }).catch(err=>{console.warn('Life Abroad asset unavailable; safe procedural fallback:',path,err);});
 character.dispose=()=>{
  cancelled=true;
  if(mixer)mixer.stopAllAction();
  if(model)character.group.remove(model);
  originalDispose();
 };
 return character;
}
