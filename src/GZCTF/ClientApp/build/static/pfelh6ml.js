/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-10T03:31:05.287Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{_ as e,i as t,y as n}from"./lz9snzk0.js";import{ft as r}from"./n1rbp2ru.js";import{T as i}from"./iwgsuxgg.js";import{t as a}from"./nbkeqdf1.js";var o=n(),s=n=>{let{disabled:s,participation:c,setParticipation:l,size:u,...d}=n,f=i(),p=f.get(c.status),m=e(),{t:h}=r();return(0,o.jsx)(t,{wrap:`nowrap`,justify:`center`,mx:`xs`,miw:`calc(${m.spacing.xl} * 2)`,...d,children:p.transformTo.map(e=>{let t=f.get(e);return(0,o.jsx)(a,{size:u,iconPath:t.iconPath,color:t.color,message:h(`admin.content.games.review.participation.update`,{status:t.title}),disabled:s,onClick:()=>l(c.id,{status:e,divisionId:c.divisionId})},`${c.id}@${e}`)})})},c={root:`e_`,item:`f_`,label:`g_`,control:`h_`};export{s as n,c as t};