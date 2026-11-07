/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-07T05:37:58.319Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{_ as e,a as t,i as n,nt as r,q as i,y as a}from"./lz9snzk0.js";import{M as o}from"./iwgsuxgg.js";import{f as s}from"./ir2889fq.js";import{n as c}from"./d6ylikse.js";var l=r(i(),1),u={default:`fc`,inner:`gc`,label:`hc`,icon:`ic`,hidable:`jc`,panes:`kc`},d=a(),f=e=>{let{color:n,label:r,active:i,icon:a,tabKey:o,disabled:s,...c}=e;return(0,d.jsx)(t,{...c,component:`button`,type:`button`,role:`tab`,disabled:s,__vars:{"--tab-active-color":n},"data-active":i||void 0,className:u.default,children:(0,d.jsxs)(`div`,{className:u.inner,children:[a&&(0,d.jsx)(`div`,{className:u.icon,children:a}),r&&(0,d.jsx)(`div`,{className:u.label,children:r})]})},o)},p=t=>{let{active:r,onTabChange:i,tabs:a,withIcon:p,aside:m,disabled:h,...g}=t,[_,v]=(0,l.useState)(r??0),y=e(),{colorScheme:b}=o(),x=e=>e?y.colors[y.primaryColor][b===`dark`?4:6]:void 0,S=s(_,0,a.length-1);(0,l.useEffect)(()=>{v(r??0)},[r]);let C=a.map((e,t)=>(0,d.jsx)(f,{...e,disabled:h,color:x(e.color),active:S===t,onClick:()=>{v(t),i&&i(t,e.tabKey)}},e.tabKey));return(0,d.jsxs)(n,{gap:0,justify:`space-between`,w:`100%`,wrap:`nowrap`,children:[m,p&&(0,d.jsx)(c,{className:u.hidable}),(0,d.jsx)(n,{className:u.panes,...g,children:C})]})};export{p as t};