# Studio Orpiment

Interactive multimedia studio — web-based and physical experiences, built in collaboration with artists and performers.

## Stack

- React 18 + TypeScript
- Vite
- react-three-fiber (three.js)
- Vanilla CSS, design tokens

## Develop

    npm install
    npm run dev

## Build

    npm run build
    npm run preview

## Deploy

Vercel auto-detects Vite. Push the repo, import in Vercel, done. `vercel.json` makes it explicit.

## Layout

    src/
      components/
        Logo/        SO mark (Monstera)
        Wordmark/    "Studio Orpiment" + orpiment accent bar (Rotor Overlay)
        Block/       Placeholder rectangle — will become a 3D viewport
        Landing/     Front-page composition
      styles/
        tokens.css   Color + font stacks
        fonts.css    @font-face declarations
        reset.css    Minimal reset
        global.css   Base typography & body
      assets/
        fonts/       Drop Rotor Overlay + Monstera here
