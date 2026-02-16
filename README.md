# Tesla Tracking Frontend

Frontend de la aplicación Tesla Tracking Platform - Consulta el estado de tus pedidos Tesla.

## 🚀 Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## 📦 Instalación

```bash
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

## 🚀 Deploy en Railway

### Instalar Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Deploy

```bash
# Inicializar proyecto
railway init

# Deploy
railway up
```

## ⚙️ Variables de Entorno

Crear archivo `.env`:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app
```

## 📁 Estructura

```
src/
├── app/              # Rutas de Next.js
├── components/       # Componentes React
│   └── ui/          # Componentes shadcn/ui
└── lib/             # Utilidades y traducciones
```