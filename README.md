# KWASU Association Platform

Front-end for the Association Management Platform described in *KWASU_Association_Platform_Proposal.docx*, built with React + Vite.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

The homepage offers three views: University, Association Executive and Member. Each opens the full app with the pages that user works with.

## Structure

```
src/
  data/        roles & permissions, navigation, seed data
  context/     app state and all actions
  components/  layout and shared UI
  pages/       one file per screen
```
