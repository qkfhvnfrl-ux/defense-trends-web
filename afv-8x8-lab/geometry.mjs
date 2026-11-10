/** Geometry is computed in original image pixels, never display coordinates. */
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export const vector=(a,b,w,h)=>({x:(b.x-a.x)*w,y:(b.y-a.y)*h});
export const magnitude=v=>Math.hypot(v.x,v.y);
export function lineAngle(points,baseline,w,h){
  if(!points||points.length<2)return null;
  const a=vector(points[0],points[1],w,h);
  const b=baseline&&baseline.length===2?vector(baseline[0],baseline[1],w,h):{x:1,y:0};
  if(magnitude(a)<1||magnitude(b)<1)return null;
  return Math.acos(clamp(Math.abs(a.x*b.x+a.y*b.y)/(magnitude(a)*magnitude(b)),0,1))*180/Math.PI;
}
export function threeAngle(points,w,h){
  if(!points||points.length<3)return null;
  const a=vector(points[1],points[0],w,h),b=vector(points[1],points[2],w,h);
  if(magnitude(a)<1||magnitude(b)<1)return null;
  return Math.acos(clamp((a.x*b.x+a.y*b.y)/(magnitude(a)*magnitude(b)),-1,1))*180/Math.PI;
}
export function segmentDistance(p,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;
 const t=l?clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/l,0,1):0;
 return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
}
export function csvCell(value){
 let s=String(value??'');
 if(/^[\s]*[=+\-@]/.test(s)||/^[\t\r]/.test(s))s="'"+s;
 return '"'+s.replaceAll('"','""')+'"';
}
