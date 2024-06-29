"use strict";function p(a,e){if(typeof a!="number")throw new Error(e)}function C(a,e){if(typeof a!="string")throw new Error(e)}function D(a){if(!(a instanceof CanvasRenderingContext2D))throw new Error("Invalid ctx")}function x(a,e,d){if(!a.includes(e))throw new Error(d)}function H(a,e,d,S,t,o){const c=a.split(" ");let s=[],i="";for(const h of c){let l=i+h+" ",n=e.measureText(l).width;(t==="firstLine"&&s.length===0||t==="hanging"&&s.length!==0)&&(n+=o),n+=d,n>S&&i.length>0?(s.push(i.trim()),i=h+" "):i=l}return s.push(i.trim()),s}function V(a,e,d,S,t,o){const c=e.measureText(a.text),s=a.align;let i=d,h=a.y,l=a.x;if(h+o<=S){if(s==="left")i+=l;else if(s==="center"){const n=(t-i-c.width)/2;l>n?i+=l:i+=n}else if(s==="right"){const n=t-c.width;n>i+l?i=n:i+=l}else if(s==="justify"){const n=a.text.split(" "),B=(t-i-l-c.width+e.measureText(" ").width*(n.length-1))/(n.length-1);let v=i+l;n.forEach((y,r)=>{e.fillText(y,v,h+o),r<n.length-1&&(v+=e.measureText(y).width+B)});return}e.fillText(a.text,i,h+o)}}function X(a,e,d={}){C(a,"Invalid text"),D(e);const t={...{height:"auto",width:"auto",baseLine:"top",xStart:0,yStart:0,align:"left",verticalAlign:"top",spaceBeforeParagraph:0,spaceAfterParagraph:0,lineSpacing:"auto",indent:{type:"none",by:0}},...d},o=["top","hanging","middle","alphabetic","ideographic","bottom"],c=["left","center","right","justify"],s=["none","firstLine","hanging"],i=["top","middle","bottom"];x(o,t.baseLine,"Invalid Baseline"),x(c,t.align,"Invalid Align"),x(s,t.indent.type,"Invalid indent.type"),x(i,t.verticalAlign,"Invalid verticalAlign"),p(t.spaceBeforeParagraph,"Invalid spaceBeforeParagraph"),p(t.spaceAfterParagraph,"Invalid spaceAfterParagraph"),p(t.xStart,"Invalid xStart"),p(t.yStart,"Invalid yStart");try{p(t.width,"Invalid width")}catch{if(t.width!=="auto")throw new Error("Invalid width")}try{p(t.height,"Invalid height")}catch{if(t.height!=="auto")throw new Error("Invalid height")}p(t.indent.by,"Invalid indent.by");try{p(t.lineSpacing,"Invalid lineSpacing")}catch{if(t.lineSpacing!=="auto")throw new Error("Invalid lineSpacing")}let h=e.canvas.width,l=e.canvas.height;t.width!=="auto"&&(h=t.width),t.height!=="auto"&&(l=t.height);const n=a.split(`
`);e.textBaseline=t.baseLine;const v=e.measureText("aAgG");let y=v.actualBoundingBoxAscent+v.actualBoundingBoxDescent+1;t.lineSpacing!=="auto"&&(y*=t.lineSpacing);const r={paragraphs:[],xStart:t.xStart,yStart:t.yStart,width:h,height:l,vAlign:t.verticalAlign};let f=r.yStart??0,u=0;switch(t.indent.type){case"hanging":u=e.measureText(" ".repeat(t.indent.by)).width;break;case"firstLine":u=e.measureText(" ".repeat(t.indent.by)).width;break;case"none":default:u=0;break}for(let g=0;g<n.length;g++){const P=n[g].trim(),m={lines:[],yStart:0,yEnd:0};f+=t.spaceBeforeParagraph,m.yStart=f;const A=H(P,e,r.xStart,r.width,t.indent.type,u);for(let w=0;w<A.length;w++){const k=A[w];let T=0;(w>0&&t.indent.type==="hanging"||w===0&&t.indent.type==="firstLine")&&(T+=u);let b=t.align;w===A.length-1&&b==="justify"&&(b="left"),m.lines.push({text:k,x:T,y:f,align:b}),f+=y}f+=t.spaceAfterParagraph,m.yEnd=f,r.paragraphs.push(m)}let E=r.paragraphs[r.paragraphs.length-1].yEnd,I=0;t.verticalAlign==="middle"?I=(r.height-E)/2:t.verticalAlign==="bottom"&&(I=r.height-E);for(const g of r.paragraphs)for(const L of g.lines)V(L,e,r.xStart,r.height,r.width,I)}/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2024 Sukron Ch<sukron@sch39.dev>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */module.exports=X;
//# sourceMappingURL=index.cjs.js.map
