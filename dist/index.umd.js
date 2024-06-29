(function(s,y){typeof exports=="object"&&typeof module<"u"?module.exports=y():typeof define=="function"&&define.amd?define(y):(s=typeof globalThis<"u"?globalThis:s||self,s["canvas-text-paragraphs"]=y())})(this,function(){"use strict";function s(i,e){if(typeof i!="number")throw new Error(e)}function y(i,e){if(typeof i!="string")throw new Error(e)}function k(i){if(!(i instanceof CanvasRenderingContext2D))throw new Error("Invalid ctx")}function S(i,e,g){if(!i.includes(e))throw new Error(g)}function C(i,e,g,x,t,p){const f=i.split(" ");let h=[],a="";for(const o of f){let l=a+o+" ",n=e.measureText(l).width;(t==="firstLine"&&h.length===0||t==="hanging"&&h.length!==0)&&(n+=p),n+=g,n>x&&a.length>0?(h.push(a.trim()),a=o+" "):a=l}return h.push(a.trim()),h}function D(i,e,g,x,t,p){const f=e.measureText(i.text),h=i.align;let a=g,o=i.y,l=i.x;if(o+p<=x){if(h==="left")a+=l;else if(h==="center"){const n=(t-a-f.width)/2;l>n?a+=l:a+=n}else if(h==="right"){const n=t-f.width;n>a+l?a=n:a+=l}else if(h==="justify"){const n=i.text.split(" "),E=(t-a-l-f.width+e.measureText(" ").width*(n.length-1))/(n.length-1);let v=a+l;n.forEach((m,r)=>{e.fillText(m,v,o+p),r<n.length-1&&(v+=e.measureText(m).width+E)});return}e.fillText(i.text,a,o+p)}}function H(i,e,g={}){y(i,"Invalid text"),k(e);const t={...{height:"auto",width:"auto",baseLine:"top",xStart:0,yStart:0,align:"left",verticalAlign:"top",spaceBeforeParagraph:0,spaceAfterParagraph:0,lineSpacing:"auto",indent:{type:"none",by:0}},...g},p=["top","hanging","middle","alphabetic","ideographic","bottom"],f=["left","center","right","justify"],h=["none","firstLine","hanging"],a=["top","middle","bottom"];S(p,t.baseLine,"Invalid Baseline"),S(f,t.align,"Invalid Align"),S(h,t.indent.type,"Invalid indent.type"),S(a,t.verticalAlign,"Invalid verticalAlign"),s(t.spaceBeforeParagraph,"Invalid spaceBeforeParagraph"),s(t.spaceAfterParagraph,"Invalid spaceAfterParagraph"),s(t.xStart,"Invalid xStart"),s(t.yStart,"Invalid yStart");try{s(t.width,"Invalid width")}catch{if(t.width!=="auto")throw new Error("Invalid width")}try{s(t.height,"Invalid height")}catch{if(t.height!=="auto")throw new Error("Invalid height")}s(t.indent.by,"Invalid indent.by");try{s(t.lineSpacing,"Invalid lineSpacing")}catch{if(t.lineSpacing!=="auto")throw new Error("Invalid lineSpacing")}let o=e.canvas.width,l=e.canvas.height;t.width!=="auto"&&(o=t.width),t.height!=="auto"&&(l=t.height);const n=i.split(`
`);e.textBaseline=t.baseLine;const v=e.measureText("aAgG");let m=v.actualBoundingBoxAscent+v.actualBoundingBoxDescent+1;t.lineSpacing!=="auto"&&(m*=t.lineSpacing);const r={paragraphs:[],xStart:t.xStart,yStart:t.yStart,width:o,height:l,vAlign:t.verticalAlign};let c=r.yStart??0,u=0;switch(t.indent.type){case"hanging":u=e.measureText(" ".repeat(t.indent.by)).width;break;case"firstLine":u=e.measureText(" ".repeat(t.indent.by)).width;break;case"none":default:u=0;break}for(let d=0;d<n.length;d++){const V=n[d].trim(),I={lines:[],yStart:0,yEnd:0};c+=t.spaceBeforeParagraph,I.yStart=c;const T=C(V,e,r.xStart,r.width,t.indent.type,u);for(let w=0;w<T.length;w++){const X=T[w];let b=0;(w>0&&t.indent.type==="hanging"||w===0&&t.indent.type==="firstLine")&&(b+=u);let B=t.align;w===T.length-1&&B==="justify"&&(B="left"),I.lines.push({text:X,x:b,y:c,align:B}),c+=m}c+=t.spaceAfterParagraph,I.yEnd=c,r.paragraphs.push(I)}let L=r.paragraphs[r.paragraphs.length-1].yEnd,A=0;t.verticalAlign==="middle"?A=(r.height-L)/2:t.verticalAlign==="bottom"&&(A=r.height-L);for(const d of r.paragraphs)for(const P of d.lines)D(P,e,r.xStart,r.height,r.width,A)}/**
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
 */return H});
//# sourceMappingURL=index.umd.js.map
