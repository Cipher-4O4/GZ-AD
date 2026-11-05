// Lightweight Local Mock API Server for GZCTF UI/UX development
// Runs on port 8080 to satisfy Vite's reverse proxy (/api -> http://localhost:8080)

const port = 8080

const FINALIST_TEAMS_DATA = [
  {
    id: 1,
    name: 'United Shell-SCC',
    school: 'SMK NEGERI 7 SEMARANG',
    score: 59087.1,
    rank: 1,
    logo: '/logos/smkn7-semarang.png',
    status: 'Operational',
    members: [
      { id: '101', userName: 'captain_shell', captain: true },
      { id: '102', userName: 'member_shell_1', captain: false },
      { id: '103', userName: 'member_shell_2', captain: false },
    ],
  },
  {
    id: 2,
    name: 'rootsanctum',
    school: 'SMK NEGERI 7 SEMARANG',
    score: 56274.3,
    rank: 2,
    logo: '/logos/smkn7-semarang.png',
    status: 'Operational',
    members: [
      { id: '201', userName: 'root_lead', captain: true },
      { id: '202', userName: 'sanctum_pwn', captain: false },
      { id: '203', userName: 'sanctum_rev', captain: false },
    ],
  },
  {
    id: 3,
    name: 'WilSec - Apa aja',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 52228.6,
    rank: 3,
    logo: '/logos/smkn1-jakarta.png',
    status: 'Operational',
    members: [
      { id: '301', userName: 'wilsec_lead', captain: true },
      { id: '302', userName: 'wilsec_web', captain: false },
      { id: '303', userName: 'wilsec_crypto', captain: false },
    ],
  },
  {
    id: 4,
    name: 'Maaf TKA Pilih CTF',
    school: 'MA NEGERI 3 JEMBER',
    score: 48517.1,
    rank: 4,
    logo: '/logos/man3-jember.png',
    status: 'Operational',
    members: [
      { id: '401', userName: 'man3_captain', captain: true },
      { id: '402', userName: 'man3_sec1', captain: false },
      { id: '403', userName: 'man3_sec2', captain: false },
    ],
  },
  {
    id: 5,
    name: 'WilSec - BOEDOET 47',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 48381.4,
    rank: 5,
    logo: '/logos/smkn1-jakarta.png',
    status: 'Operational',
    members: [
      { id: '501', userName: 'boedoet_lead', captain: true },
      { id: '502', userName: 'boedoet_47_1', captain: false },
      { id: '503', userName: 'boedoet_47_2', captain: false },
    ],
  },
  {
    id: 6,
    name: 'kata magfi "bebas"',
    school: 'SMK NEGERI 21 JAKARTA',
    score: 47410.0,
    rank: 6,
    logo: '/logos/smkn21-jakarta.png',
    status: 'Operational',
    members: [
      { id: '601', userName: 'magfi_lead', captain: true },
      { id: '602', userName: 'smkn21_mem1', captain: false },
      { id: '603', userName: 'smkn21_mem2', captain: false },
    ],
  },
  {
    id: 7,
    name: 'Z3RODAY',
    school: 'SMK NEGERI 1 BOYOLANGU',
    score: 47177.1,
    rank: 7,
    logo: '/logos/smkn1-boyolangu.png',
    status: 'Operational',
    members: [
      { id: '701', userName: 'rootkids', captain: true },
      { id: '702', userName: 'boyolangu_pwn', captain: false },
      { id: '703', userName: 'boyolangu_web', captain: false },
    ],
  },
  {
    id: 8,
    name: 'Gangantua',
    school: 'SMK NEGERI 3 TUBAN',
    score: 47150.0,
    rank: 8,
    logo: '/logos/smkn3-tuban.png',
    status: 'Mumble',
    members: [
      { id: '801', userName: 'gangantua_lead', captain: true },
      { id: '802', userName: 'tuban_3_mem1', captain: false },
      { id: '803', userName: 'tuban_3_mem2', captain: false },
    ],
  },
  {
    id: 9,
    name: 'WilSec - Panitia',
    school: 'SMK NEGERI 1 JAKARTA',
    score: 44544.3,
    rank: 9,
    logo: '/logos/smkn1-jakarta.png',
    status: 'Operational',
    members: [
      { id: '901', userName: 'wilsec_panitia_lead', captain: true },
      { id: '902', userName: 'wilsec_panitia_1', captain: false },
      { id: '903', userName: 'wilsec_panitia_2', captain: false },
    ],
  },
  {
    id: 10,
    name: 'Duo Perncari Flag',
    school: 'SMKS MASKUMAMBANG 1 DUKUN',
    score: 44145.7,
    rank: 10,
    logo: '/logos/smk-maskumambang-dukun.png',
    status: 'Operational',
    members: [
      { id: '1001', userName: 'duo_pencari_lead', captain: true },
      { id: '1002', userName: 'dukun_gresik_mem', captain: false },
    ],
  },
]

const db = {
  config: {
    title: 'JCC::CTF',
    description: 'Cybersecurity IONIC 2026 - Attack & Defense',
    footer: 'Cybersecurity IONIC 2026 Platform',
    favicon: '/favicon.webp',
    portMapping: 'Direct',
    enableRegistration: true,
    languages: ['id-ID', 'en-US'],
  },
  user: {
    userId: 'Z3RODAY',
    userName: 'rootkids',
    email: 'z3roday@smkn1boyolangu.sch.id',
    role: 'User',
    avatar: '/logos/smkn1-boyolangu.png',
    bio: 'Cyber Security Team SMK NEGERI 1 BOYOLANGU',
    token: 'ad_KqcDuW9H-_HfhXtkdCI5TXLx9AQVfqIM7zUf-w8mjRE',
  },
  posts: [
    {
      id: '1',
      title: 'Selamat Kepada 10 Finalis Cybersecurity IONIC 2026',
      summary: 'Daftar 10 tim finalis resmi lolos ke babak Attack & Defense IONIC 2026.',
      content: `# Babak Final Attack & Defense Cybersecurity IONIC 2026

Selamat kepada 10 tim terbaik yang telah lolos ke babak Final:
1. **United Shell-SCC** - SMK NEGERI 7 SEMARANG
2. **rootsanctum** - SMK NEGERI 7 SEMARANG
3. **WilSec - Apa aja** - SMK NEGERI 1 JAKARTA
4. **Maaf TKA Pilih CTF** - MA NEGERI 3 JEMBER
5. **WilSec - BOEDOET 47** - SMK NEGERI 1 JAKARTA
6. **kata magfi "bebas"** - SMK NEGERI 21 JAKARTA
7. **Z3RODAY** - SMK NEGERI 1 BOYOLANGU
8. **Gangantua** - SMK NEGERI 3 TUBAN
9. **WilSec - Panitia** - SMK NEGERI 1 JAKARTA
10. **Duo Perncari Flag** - SMKS MASKUMAMBANG 1 DUKUN

Pastikan konfigurasi WireGuard VPN dan Token API sudah siap sebelum Round 1 dimulai!`,
      isPinned: true,
      time: Date.now() - 3600000,
      authorName: 'Panitia IONIC 2026',
      authorAvatar: null,
      tags: ['A&D', 'Finalis', 'IONIC 2026'],
    },
    {
      id: '2',
      title: 'Jadwal Tick dan Ketentuan SLA Availability Layanan',
      summary: 'Setiap ronde berlangsung selama 5 tick (1 tick = 60 detik). Periksa status cek layanan tim Anda.',
      content: 'Layanan yang dipertahankan meliputi `simple-crypto`, `simple-pwn`, dan `simple-web`. Jagalah integritas flag agar poin SLA tetap maksimal.',
      isPinned: false,
      time: Date.now() - 7200000,
      authorName: 'Panitia IONIC 2026',
      authorAvatar: null,
      tags: ['Rules', 'A&D'],
    },
  ],
  teams: FINALIST_TEAMS_DATA.map((t) => ({
    id: t.id,
    name: t.name,
    bio: `${t.school} • Nilai Akhir: ${t.score.toLocaleString('id-ID')} pts`,
    avatar: t.logo,
    locked: false,
    members: t.members,
  })),
  recentGames: [
    {
      id: 5,
      title: 'Final Cybersecurity IONIC 2026',
      summary: 'Babak Final Attack & Defense IONIC 2026',
      poster: null,
      limit: 3,
      start: Date.now() - 3600000,
      end: Date.now() + 6 * 3600000 + 39 * 60000,
    },
  ],
  game: {
    id: 5,
    title: 'Final Cybersecurity IONIC 2026',
    summary: 'Babak Final Attack & Defense IONIC 2026',
    content: '10 Tim Finalis Bertanding dalam Mode Attack & Defense Realtime.',
    start: Date.now() - 3600000,
    end: Date.now() + 6 * 3600000 + 39 * 60000,
    status: 'Accepted',
    practiceMode: true,
    challengesCount: 3,
    divisions: [],
  },
  teamInfo: {
    rank: {
      rank: 7,
      name: 'Z3RODAY',
      score: 47177.1,
      solvedCount: 0,
      avatar: '/logos/smkn1-boyolangu.png',
    },
    challengeCount: 3,
    challenges: {
      Crypto: [
        {
          id: 1,
          title: 'simple-crypto',
          category: 'Crypto',
          score: 1000,
          solved: 12,
        },
      ],
      Pwn: [
        {
          id: 2,
          title: 'simple-pwn',
          category: 'Pwn',
          score: 1000,
          solved: 8,
        },
      ],
      Web: [
        {
          id: 3,
          title: 'simple-web',
          category: 'Web',
          score: 1000,
          solved: 15,
        },
      ],
    },
  },
  notices: [
    {
      id: 1,
      type: 'Normal',
      values: ['Layanan [ledger-forge] telah dirilis dan siap diserang.'],
      publishTime: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 2,
      type: 'Normal',
      values: ['Round 26 sedang berlangsung. Perhatikan status SLA service Anda.'],
      publishTime: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
}

Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname.toLowerCase()

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    // Config
    if (path === '/api/config') {
      return Response.json(db.config, { headers })
    }

    // User Profile
    if (path === '/api/account/profile') {
      return Response.json(db.user, { headers })
    }

    // Posts / Berita
    if (path.includes('/posts') || path.includes('/post')) {
      const parts = path.split('/').filter(Boolean)
      const lastPart = parts[parts.length - 1]
      if (lastPart !== 'posts' && lastPart !== 'latest' && lastPart !== 'latestposts') {
        const post = db.posts.find((p) => p.id === lastPart) || db.posts[0]
        return Response.json(post, { headers })
      }
      return Response.json(db.posts, { headers })
    }

    // Teams
    if (path === '/api/team' || path.startsWith('/api/team/')) {
      return Response.json(db.teams, { headers })
    }

    // Recent games
    if (path.includes('/api/game/recent') || path === '/api/game') {
      return Response.json(db.recentGames, { headers })
    }

    // Game Detail
    if (path.match(/\/api\/game\/\d+$/)) {
      return Response.json(db.game, { headers })
    }

    // Game Team Info & Challenges
    if (path.includes('/team')) {
      return Response.json(db.teamInfo, { headers })
    }

    // Game Notices
    if (path.includes('/notices') || path.includes('/notice')) {
      return Response.json(db.notices, { headers })
    }

    // Scoreboard (10 Finalis)
    if (path.includes('/scoreboard')) {
      return Response.json(
        FINALIST_TEAMS_DATA.map((t) => ({
          rank: t.rank,
          name: t.name,
          score: t.score,
          solved: 14 - t.rank,
          avatar: t.logo,
        })),
        { headers }
      )
    }

    // A&D Targets
    if (path.includes('/targets')) {
      return Response.json(
        {
          currentRound: 26,
          challenges: [
            {
              challengeId: 76,
              title: 'simple-pwn',
              tickSeconds: 60,
              teams: FINALIST_TEAMS_DATA.filter((t) => t.id !== 7).map((t, idx) => ({
                participationId: t.id,
                teamName: t.name,
                division: null,
                ip: `172.0.9.${idx + 2}`,
                port: 80,
                lastCheckStatus: t.status === 'Operational' ? 'Ok' : 'Mumble',
              })),
            },
          ],
        },
        { headers }
      )
    }

    // A&D Submit
    if (path.includes('/submit')) {
      return Response.json(
        {
          acceptedCount: 1,
          totalPoints: 10.0,
          results: [{ flag: 'flag{captured_from_target}', status: 'accepted', points: 10.0 }],
        },
        { headers }
      )
    }

    // Default Fallback
    return Response.json({}, { headers })
  },
})

console.log(`[Mock API Server] Running on http://localhost:${port}`)
