/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T08:44:38.598Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{R as e,U as t,a as n,h as r,m as i,nt as a,o,q as s,y as c}from"./lz9snzk0.js";var l={root:`m_9e117634`},u=a(s(),1),d=c(),f=e((e,{radius:n,fit:r})=>({root:{"--image-radius":n===void 0?void 0:t(n),"--image-object-fit":r}})),p=o(e=>{let t=r(`Image`,null,e),{classNames:a,className:o,style:s,styles:c,unstyled:p,vars:m,onError:h,src:g,radius:_,fit:v,fallbackSrc:y,mod:b,attributes:x,...S}=t,[C,w]=(0,u.useState)(!g);(0,u.useEffect)(()=>w(!g),[g]);let T=i({name:`Image`,classes:l,props:t,className:o,style:s,classNames:a,styles:c,unstyled:p,attributes:x,vars:m,varsResolver:f});return C&&y?(0,d.jsx)(n,{component:`img`,src:y,...T(`root`),onError:h,mod:[`fallback`,b],...S}):(0,d.jsx)(n,{component:`img`,...T(`root`),src:g,onError:e=>{h?.(e),w(!0)},mod:b,...S})});p.classes=l,p.varsResolver=f,p.displayName=`@mantine/core/Image`;export{p as t};