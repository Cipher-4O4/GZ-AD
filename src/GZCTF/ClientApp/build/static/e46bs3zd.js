/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{Y as e,_ as t,a as n,i as r,it as i,y as a}from"./dn2mmff4.js";import{f as o}from"./ib6bb96z.js";import{E as s}from"./m7zvbwz0.js";import{n as c}from"./fjrix21s.js";var l=i(e(),1),u={default:`ce`,inner:`de`,label:`ee`,icon:`fe`,hidable:`ge`,panes:`he`},d=a(),f=e=>{let{color:t,label:r,active:i,icon:a,tabKey:o,disabled:s,...c}=e;return(0,d.jsx)(n,{...c,component:`button`,type:`button`,role:`tab`,disabled:s,__vars:{"--tab-active-color":t},"data-active":i||void 0,className:u.default,children:(0,d.jsxs)(`div`,{className:u.inner,children:[a&&(0,d.jsx)(`div`,{className:u.icon,children:a}),r&&(0,d.jsx)(`div`,{className:u.label,children:r})]})},o)},p=e=>{let{active:n,onTabChange:i,tabs:a,withIcon:p,aside:m,disabled:h,...g}=e,[_,v]=(0,l.useState)(n??0),y=t(),{colorScheme:b}=s(),x=e=>e?y.colors[y.primaryColor][b===`dark`?4:6]:void 0,S=o(_,0,a.length-1);(0,l.useEffect)(()=>{v(n??0)},[n]);let C=a.map((e,t)=>(0,d.jsx)(f,{...e,disabled:h,color:x(e.color),active:S===t,onClick:()=>{v(t),i&&i(t,e.tabKey)}},e.tabKey));return(0,d.jsxs)(r,{gap:0,justify:`space-between`,w:`100%`,wrap:`nowrap`,children:[m,p&&(0,d.jsx)(c,{className:u.hidable}),(0,d.jsx)(r,{className:u.panes,...g,children:C})]})};export{p as t};