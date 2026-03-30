# Configurar Google OAuth para Nido

## Paso 1 — Google Cloud Console

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo (o selecciona uno existente)
3. En el menú lateral: **APIs & Services** → **Credentials**
4. Haz clic en **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Nombre: `Nido`
7. **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://[tu-dominio-vercel].vercel.app`
8. **Authorized redirect URIs**:
   - `https://xrwzwmiamoescydeeatb.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
9. Haz clic en **CREATE**
10. Copia el **Client ID** y el **Client Secret**

## Paso 2 — Supabase

1. Ve a https://supabase.com → tu proyecto `xrwzwmiamoescydeeatb`
2. En el menú lateral: **Authentication** → **Providers**
3. Encuentra **Google** y haz clic en el toggle para activarlo
4. Pega el **Client ID** y **Client Secret** de Google
5. Haz clic en **Save**

## Paso 3 — Verificar

1. Corre `npm run dev` localmente
2. Ve a http://localhost:3000/login
3. Haz clic en "Continuar con Google"
4. Debería abrirse el flujo de OAuth de Google

## Apple OAuth (opcional)

Requiere cuenta **Apple Developer** ($99/año).

1. Ve a https://developer.apple.com → Certificates, Identifiers & Profiles
2. Crea un **Services ID** y configura **Sign In with Apple**
3. En Supabase → Authentication → Providers → Apple
4. Pega el **Services ID**, **Team ID**, **Key ID** y **Private Key**

## URLs de callback para producción

Después del deploy en Vercel, agrega también la URL de producción en Google Console:
- `https://[tu-app].vercel.app/auth/callback`

Y actualiza el **Site URL** en Supabase → Authentication → URL Configuration:
- `https://[tu-app].vercel.app`
