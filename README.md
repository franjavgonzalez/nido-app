# 🏠 Nido — Gestión financiera familiar

Dashboard financiero familiar con transacciones, presupuesto, metas y reportes PDF.

## Stack

| Tecnología | Versión |
|---|---|
| Next.js | 16.x (App Router) |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Supabase | 2.x |
| Framer Motion | 12.x |
| Recharts | 2.x |
| Zustand | 5.x |
| React Hook Form | 7.x |
| Zod | 3.x |
| jsPDF | 2.x |

## Instalación local

```bash
git clone https://github.com/franjavgonzalez/nido-app
cd nido-app
npm install
cp .env.example .env.local
# Rellena .env.local con tus valores de Supabase
npm run dev
```

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nido
```

## Configurar Supabase

1. Crea un proyecto en https://supabase.com
2. Copia las credenciales a `.env.local`
3. Aplica las migraciones:

```bash
supabase login
supabase link --project-ref [PROJECT_ID]
supabase db push
```

## Configurar OAuth Google

Ver [SETUP_OAUTH.md](./SETUP_OAUTH.md) para instrucciones detalladas.

## Deploy en Vercel

```bash
vercel login
vercel --yes
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel --prod --yes
```

## Estructura

```
src/
├── app/
│   ├── (auth)/login/        # Página de login
│   ├── (auth)/callback/     # Callback OAuth
│   ├── (dashboard)/         # Módulos principales
│   │   ├── dashboard/       # KPIs + charts
│   │   ├── transactions/    # Registro de movimientos
│   │   ├── budget/          # Presupuesto mensual
│   │   ├── goals/           # Metas de ahorro
│   │   └── reports/         # Reportes PDF
│   └── onboarding/          # Setup inicial
├── components/
│   ├── ui/                  # Button, Card, Input, Modal...
│   ├── layout/              # Sidebar, Topbar
│   ├── dashboard/           # KPICard, Charts
│   ├── transactions/        # Table, Modal
│   ├── budget/              # CategoryCard, ConfigModal
│   ├── goals/               # GoalCard, Modals, Projection
│   └── reports/             # ReportPreview
├── lib/
│   ├── supabase/            # client.ts + server.ts
│   ├── utils.ts             # Helpers
│   ├── currencies.ts        # 9 divisas
│   └── pdf.ts               # Generador PDF
├── stores/
│   └── appStore.ts          # Zustand global store
└── types/
    └── index.ts             # TypeScript types
```

## Licencia

MIT
