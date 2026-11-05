/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{_ as e,i as t,y as n}from"./dn2mmff4.js";import{T as r}from"./m7zvbwz0.js";import{ft as i}from"./nycdw5fb.js";import{t as a}from"./kw2rpyfh.js";var o=n(),s=n=>{let{disabled:s,participation:c,setParticipation:l,size:u,...d}=n,f=r(),p=f.get(c.status),m=e(),{t:h}=i();return(0,o.jsx)(t,{wrap:`nowrap`,justify:`center`,mx:`xs`,miw:`calc(${m.spacing.xl} * 2)`,...d,children:p.transformTo.map(e=>{let t=f.get(e);return(0,o.jsx)(a,{size:u,iconPath:t.iconPath,color:t.color,message:h(`admin.content.games.review.participation.update`,{status:t.title}),disabled:s,onClick:()=>l(c.id,{status:e,divisionId:c.divisionId})},`${c.id}@${e}`)})})},c={root:`E_`,item:`F_`,label:`G_`,control:`H_`};export{s as n,c as t};