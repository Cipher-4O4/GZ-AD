/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{Y as e,it as t}from"./dn2mmff4.js";import{S as n,t as r}from"./nycdw5fb.js";var i=t(e(),1),a=(e,t)=>{let{data:i,error:a,mutate:o}=n.edit.useEditGetGameChallenge(e,t,r);return{challenge:i,error:a,mutate:o}},o=e=>{let{data:t,error:a,mutate:o}=n.edit.useEditGetGameChallenges(e,r);return{challenges:(0,i.useMemo)(()=>t?.toSorted((e,t)=>(e.category??``)>(t.category??``)?-1:1)??null,[t]),error:a,mutate:o}};export{o as n,a as t};