/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T07:57:57.682Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{G as e,R as t,U as n,a as r,h as i,m as a,s as o,y as s}from"./lz9snzk0.js";import{t as c}from"./f3ii2mm3.js";var l=s(),u={timeout:1e3};function d(e){let{children:t,timeout:n,value:r,...a}=i(`CopyButton`,u,e),o=c({timeout:n});return(0,l.jsx)(l.Fragment,{children:t({copy:()=>o.copy(r),copied:o.copied,...a})})}d.displayName=`@mantine/core/CopyButton`;var f={root:`m_7341320d`},p=t((t,{size:r,radius:i,variant:a,gradient:o,color:s,autoContrast:c})=>{let l=t.variantColorResolver({color:s||t.primaryColor,theme:t,gradient:o,variant:a||`filled`,autoContrast:c});return{root:{"--ti-size":e(r,`ti-size`),"--ti-radius":i===void 0?void 0:n(i),"--ti-bg":s||a?l.background:void 0,"--ti-color":s||a?l.color:void 0,"--ti-bd":s||a?l.border:void 0}}}),m=o(e=>{let t=i(`ThemeIcon`,null,e),{classNames:n,className:o,style:s,styles:c,unstyled:u,vars:d,autoContrast:m,attributes:h,...g}=t,_=a({name:`ThemeIcon`,classes:f,props:t,className:o,style:s,classNames:n,styles:c,unstyled:u,attributes:h,vars:d,varsResolver:p});return(0,l.jsx)(r,{..._(`root`),...g})});m.classes=f,m.varsResolver=p,m.displayName=`@mantine/core/ThemeIcon`;export{d as n,m as t};