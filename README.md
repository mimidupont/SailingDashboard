# Tamarin — Carnet de Maintenance
### Trisbald 36 · Voile n° FRA 7284

## 🚀 Déploiement Vercel

Lors de l'import sur Vercel, ajouter ces variables d'environnement :

| Variable | Valeur |
|---|---|
| `REACT_APP_SUPABASE_URL` | `https://apmudbuhtlwaletmtuez.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbXVkYnVodGx3YWxldG10dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMDIxMTUsImV4cCI6MjA4OTc3ODExNX0.q5e35LFYbpx0Pf7RerKB7U7mLomVKSVndwfWG3SBfps` |

## 🗄️ Base de données Supabase

Avant le premier déploiement, exécuter le fichier `supabase-schema.sql`
dans **Supabase → SQL Editor → Run**.

## 💻 Développement local

```bash
npm install
npm start
```
