/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:00:08.241Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{nt as e,q as t}from"./lz9snzk0.js";import{S as n,t as r}from"./n1rbp2ru.js";var i=e(t(),1),a=(e,t)=>{let{data:i,error:a,mutate:o}=n.edit.useEditGetGameChallenge(e,t,r);return{challenge:i,error:a,mutate:o}},o=e=>{let{data:t,error:a,mutate:o}=n.edit.useEditGetGameChallenges(e,r);return{challenges:(0,i.useMemo)(()=>t?.toSorted((e,t)=>(e.category??``)>(t.category??``)?-1:1)??null,[t]),error:a,mutate:o}};export{o as n,a as t};