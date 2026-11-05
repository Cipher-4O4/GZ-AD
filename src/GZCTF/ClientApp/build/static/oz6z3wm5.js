/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{R as e,W as t,Y as n,a as r,h as i,it as a,m as o,o as s,y as c}from"./dn2mmff4.js";var l={root:`m_9e117634`},u=a(n(),1),d=c(),f=e((e,{radius:n,fit:r})=>({root:{"--image-radius":n===void 0?void 0:t(n),"--image-object-fit":r}})),p=s(e=>{let t=i(`Image`,null,e),{classNames:n,className:a,style:s,styles:c,unstyled:p,vars:m,onError:h,src:g,radius:_,fit:v,fallbackSrc:y,mod:b,attributes:x,...S}=t,[C,w]=(0,u.useState)(!g);(0,u.useEffect)(()=>w(!g),[g]);let T=o({name:`Image`,classes:l,props:t,className:a,style:s,classNames:n,styles:c,unstyled:p,attributes:x,vars:m,varsResolver:f});return C&&y?(0,d.jsx)(r,{component:`img`,src:y,...T(`root`),onError:h,mod:[`fallback`,b],...S}):(0,d.jsx)(r,{component:`img`,...T(`root`),src:g,onError:e=>{h?.(e),w(!0)},mod:b,...S})});p.classes=l,p.varsResolver=f,p.displayName=`@mantine/core/Image`;export{p as t};