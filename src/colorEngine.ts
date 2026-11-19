export type Shade = 50|100|200|300|400|500|600|700|800|900|950;
export const shades: Shade[] = [50,100,200,300,400,500,600,700,800,900,950];
const clamp=(n:number,min=0,max=1)=>Math.min(max,Math.max(min,n));
export function hexToRgb(hex:string){const h=hex.replace('#',''); const v=h.length===3?h.split('').map(x=>x+x).join(''):h; return {r:parseInt(v.slice(0,2),16),g:parseInt(v.slice(2,4),16),b:parseInt(v.slice(4,6),16)};}
export function rgbToHex(r:number,g:number,b:number){return '#'+[r,g,b].map(v=>Math.round(clamp(v/255)*255).toString(16).padStart(2,'0')).join('');}
function srgb(v:number){v/=255; return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)}
export function luminance(hex:string){const {r,g,b}=hexToRgb(hex); return .2126*srgb(r)+.7152*srgb(g)+.0722*srgb(b)}
export function contrast(a:string,b:string){const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
export function generateScale(hex:string):Record<Shade,string>{const {r,g,b}=hexToRgb(hex); const out={} as Record<Shade,string>; shades.forEach(s=>{const t=s<=500?(1-s/500)*.92:(s-500)/450*.78; out[s]=s<=500?rgbToHex(r+(255-r)*t,g+(255-g)*t,b+(255-b)*t):rgbToHex(r*(1-t),g*(1-t),b*(1-t))}); return out}
export const defaultColors={brand:'#7757F6',accent:'#25B7A6',neutral:'#64748B',success:'#18A875',warning:'#E6A23C',error:'#E15C6C',info:'#4C8DFF'};
export function exportTokens(colors:typeof defaultColors){const primitive=Object.fromEntries(Object.entries(colors).map(([k,v])=>[k,generateScale(v)])); return JSON.stringify({primitive,semantic:{light:{background:'#F8FAFC',surface:'#FFFFFF',text:'#172033',border:'#E2E8F0',action:colors.brand},dark:{background:'#10131C',surface:'#171C28',text:'#F4F7FB',border:'#2B3447',action:colors.brand}},component:{button:{radius:'10px',height:'40px'},card:{radius:'16px',shadow:'0 12px 32px rgba(23,32,51,.08)'}}},null,2)}
