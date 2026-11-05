// Lightweight Local Mock API Server for GZCTF UI/UX development
// Runs on port 8080 to satisfy Vite's reverse proxy (/api -> http://localhost:8080)

const port = 8080

const db = {
  config: {
    title: 'JCC::CTF',
    description: 'Jatim Cyber Security Competition - Attack & Defense',
    footer: 'JCC::CTF Attack & Defense Platform',
    favicon: '/favicon.webp',
    portMapping: 'Direct',
    enableRegistration: true,
    languages: ['id-ID', 'en-US'],
  },
  user: {
    userId: 'ZeroDay SMKN 1 Boyolangu',
    userName: 'ZeroDay',
    email: 'zeroday@student.smk.id',
    role: 'User', // Regular participant, NOT Admin
    avatar: null,
    bio: 'Cyber Security Team SMKN 1 Boyolangu',
    token: 'ad_KqcDuW9H-_HfhXtkdCI5TXLx9AQVfqIM7zUf-w8mjRE',
  },
  posts: [
    {
      id: '1',
      title: 'Selamat Datang di Babak Final JCC CTF Attack & Defense',
      summary: 'Perhatikan jadwal tick, konfigurasi VPN, dan submission token sebelum Round 1 dimulai.',
      content: '# Panduan Pelaksanaan A&D\n\n1. Pastikan WireGuard VPN terhubung.\n2. Lakukan patch layanan sebelum first attack mendarat.\n3. Jangan menghapus flag historis untuk menjaga poin SLA (Availability).\n\nSelamat bertanding!',
      isPinned: true,
      time: Date.now() - 3600000,
      authorName: 'JCC Committee',
      authorAvatar: null,
      tags: ['A&D', 'Official'],
    },
    {
      id: '2',
      title: 'Pemberitahuan: Layanan ledger-forge telah dirilis',
      summary: 'Layanan baru simple-pwn ledger-forge telah aktif dan siap diserang/dipertahankan.',
      content: 'Layanan ledger-forge dapat diakses melalui IP container masing-masing tim.',
      isPinned: false,
      time: Date.now() - 7200000,
      authorName: 'JCC Committee',
      authorAvatar: null,
      tags: ['Challenge', 'Pwn'],
    },
  ],
  teams: [
    {
      id: 10,
      name: 'ZeroDay SMKN 1 Boyolangu',
      bio: 'Cyber Security Team SMKN 1 Boyolangu',
      locked: false,
      members: [
        { id: '1', userName: 'rootkids', captain: true },
        { id: '2', userName: 'member_1', captain: false },
        { id: '3', userName: 'member_2', captain: false },
      ],
    },
  ],
  recentGames: [
    {
      id: 5,
      title: 'Warm Up Final',
      summary: 'Attack & Defense Warmup Stage',
      poster: null,
      limit: 0,
      start: Date.now() - 3600000,
      end: Date.now() + 6 * 3600000 + 39 * 60000,
    },
  ],
  game: {
    id: 5,
    title: 'Warm Up Final',
    summary: 'Attack & Defense Warmup Stage',
    content: 'Warmup final round for JCC Attack & Defense',
    start: Date.now() - 3600000,
    end: Date.now() + 6 * 3600000 + 39 * 60000,
    status: 'Accepted',
    practiceMode: true,
    adEnabled: true,
    challengesCount: 3,
    divisions: [],
  },
  teamInfo: {
    teamToken: 'ad_KqcDuW9H-_HfhXtkdCI5TXLx9AQVfqIM7zUf-w8mjRE',
    rank: {
      rank: 10,
      name: 'ZeroDay SMKN 1 Boyolangu',
      score: 9575.2,
      solvedCount: 0,
      divisionId: null,
      solvedChallenges: [],
      avatar: '',
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
      values: ['Challenge baru [ledger-forge] telah dirilis.'],
      time: new Date(Date.now() - 1800000).toISOString(),
      publishTime: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 2,
      type: 'Normal',
      values: ['Round 1 akan segera dimulai dalam 10 menit.'],
      time: new Date(Date.now() - 3600000).toISOString(),
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

    // Scoreboard
    if (path.includes('/scoreboard')) {
      return Response.json(
        [
          { rank: 1, name: 'pacman -Sybau', score: 22851.2, solved: 14 },
          { rank: 2, name: 'TOP - EsemkitaJayal', score: 22527.6, solved: 13 },
          { rank: 3, name: 'Offset e offside', score: 18434.2, solved: 11 },
          { rank: 4, name: 'lethe cyber 1', score: 18118.4, solved: 10 },
          { rank: 10, name: 'ZeroDay SMKN 1 Boyolangu', score: 9575.2, solved: 0 },
        ],
        { headers }
      )
    }

    // A&D Targets
    if (path.includes('/targets')) {
      return Response.json(
        {
          currentRound: 7,
          challenges: [
            {
              challengeId: 76,
              title: 'simple-pwn',
              tickSeconds: 60,
              teams: [
                { participationId: 2, teamName: 'pacman -Sybau', division: null, ip: '172.0.9.4', port: 80, lastCheckStatus: 'Ok' },
                { participationId: 3, teamName: 'TOP - EsemkitaJayal', division: null, ip: '172.0.9.5', port: 80, lastCheckStatus: 'Ok' },
                { participationId: 4, teamName: 'Offset e offside', division: null, ip: '172.0.9.6', port: 80, lastCheckStatus: 'Mumble' },
              ],
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
          results: [
            { flag: 'flag{captured_from_target}', status: 'accepted', points: 10.0 },
          ],
        },
        { headers }
      )
    }

    // Default Fallback
    return Response.json({}, { headers })
  },
})

console.log(`[Mock API Server] Running on http://localhost:${port}`)
