/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-07T06:38:10.695Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{L as e,a as t,nt as n,q as r,r as i,y as a}from"./lz9snzk0.js";import{t as o}from"./m1xuo1xr.js";var s=n(r(),1),c={container:`Gc`,text:`Hc`,textWrapper:`Ic`,clone:`Jc`,scroll:`Kc`},l=a(),u=({text:n,onClick:r,size:a,speedCharPerSec:u=3.2,...d})=>{let f=(0,s.useRef)(null),p=(0,s.useRef)(null),[m,h]=(0,s.useState)(!1),[g,_]=(0,s.useState)(!1),[v,y]=(0,s.useState)(4);o([n],()=>{_(!1),h(!1)});let b=(0,s.useCallback)(()=>{if(g)return;let e=f.current,t=p.current;if(!e||!t)return;let n=parseFloat(getComputedStyle(t).fontSize||`14`)||14,r=t.scrollWidth;if(r-e.clientWidth>0){let e=r/(u*n);y(Math.max(3,e)),h(!0)}_(!0)},[g,u]);return(0,l.jsx)(t,{ref:f,className:c.container,onClick:r,onMouseEnter:b,"data-scroll":m||void 0,__vars:{"--scroll-time":`${v}s`},...d,children:(0,l.jsxs)(`div`,{className:c.textWrapper,children:[(0,l.jsx)(i,{ref:p,className:c.text,title:n,fz:a,children:n}),m&&(0,l.jsx)(i,{className:e(c.text,c.clone),fz:a,"aria-hidden":!0,children:n})]})})};export{u as t};