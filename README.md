# 🎵 Soundboard TikTok

Une application web moderne et interactive de soundboard TikTok, développée avec React et Vite. Cliquez sur le gros bouton pour jouer des sons aléatoires drôles et viraux !

![React](https://img.shields.io/badge/React-19.2.5-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales
- **Bouton central interactif** : Interface simple et intuitive avec un gros bouton centré
- **Lecture aléatoire** : Joue un son différent à chaque clic
- **Anti-répétition** : Le même son ne peut pas être joué deux fois de suite
- **Feedback visuel** : Animation et texte "Playing..." pendant la lecture
- **Préchargement** : Tous les sons sont préchargés pour éviter les lags

### 🎮 Fonctionnalités Avancées
- **Compteur de clics** : Suivi du nombre total de clics
- **Mode auto-play** : Lecture automatique toutes les X secondes (configurable)
- **Design moderne** : Interface sombre avec effets visuels et animations
- **Responsive** : Fonctionne parfaitement sur mobile et desktop
- **Gestion audio propre** : Utilisation optimisée des objets Audio HTML5

### 🎵 Bibliothèque de Sons
Actuellement **19 sons** disponibles :
- Sons TikTok viraux et memes
- Effets sonores drôles
- Musiques et ringtones
- Sons de jeux (Fortnite, Among Us, etc.)

## 🚀 Installation

### Prérequis
- Node.js (version 18+)
- npm ou yarn

### Étapes d'installation

1. **Clonez le repository**
   ```bash
   git clone <repository-url>
   cd tiktok_sons
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Ajoutez vos sons**
   Placez vos fichiers audio `.mp3` dans le dossier `public/Sons/`

4. **Mettez à jour la liste des sons**
   Éditez `src/App.jsx` et ajoutez vos nouveaux sons dans le tableau `soundFiles`

## 🎮 Utilisation

### Démarrage en développement
```bash
npm run dev
```
Ouvre [http://localhost:5173](http://localhost:5173) dans votre navigateur

### Build pour la production
```bash
npm run build
```

### Prévisualisation du build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Structure du Projet

```
tiktok_sons/
├── public/
│   └── Sons/                    # Dossier contenant tous les fichiers audio
│       ├── 67_SQlv2Xv.mp3
│       ├── aller-ftg.mp3
│       ├── among-us-role-reveal-sound.mp3
│       └── ... (19 fichiers au total)
├── src/
│   ├── App.jsx                  # Composant principal de l'application
│   ├── main.tsx                 # Point d'entrée React
│   ├── index.css                # Styles globaux
│   └── assets/                  # Ressources statiques
├── package.json                 # Dépendances et scripts
├── vite.config.ts              # Configuration Vite
├── tsconfig.json               # Configuration TypeScript
├── tsconfig.app.json           # Configuration TS pour l'app
├── tsconfig.node.json          # Configuration TS pour Node
├── eslint.config.js            # Configuration ESLint
└── README.md                   # Ce fichier
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 19.2.5** - Bibliothèque UI moderne
- **Vite 8.0.10** - Outil de build ultra-rapide
- **TypeScript 6.0.2** - JavaScript typé
- **ESLint** - Linting et formatage du code

### Audio
- **Web Audio API** - Gestion native des sons HTML5
- **Préchargement automatique** - Optimisation des performances

### Styles
- **CSS-in-JS** - Styles intégrés dans le composant
- **Design System moderne** - Interface sombre avec gradients
- **Animations CSS** - Transitions fluides et effets visuels

## 🎨 Personnalisation

### Ajouter de nouveaux sons
1. Placez votre fichier `.mp3` dans `public/Sons/`
2. Ajoutez le nom du fichier dans le tableau `soundFiles` dans `App.jsx`
3. Le son sera automatiquement disponible

### Modifier l'apparence
- Les styles sont intégrés dans `App.jsx` dans la balise `<style>`
- Variables CSS disponibles pour la personnalisation
- Support des thèmes sombre/clair

### Configuration de l'auto-play
- Intervalle configurable entre 2 et 7 secondes
- Toggle on/off dans l'interface

## 🔧 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build l'application pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Lance ESLint pour vérifier le code |

## 📱 Fonctionnalités Techniques

### Gestion d'État
- `useState` pour l'état local (playing, compteur, auto-play)
- `useRef` pour les références aux objets Audio
- `useCallback` pour l'optimisation des fonctions
- `useEffect` pour les effets secondaires (préchargement, auto-play)

### Optimisations Audio
- Préchargement automatique de tous les sons au montage
- Gestion propre des événements audio (`onended`, `onerror`)
- Volume et contrôles optimisés
- Nettoyage automatique des ressources

### Interface Utilisateur
- Design responsive avec CSS Grid et Flexbox
- Animations CSS natives (transform, transition)
- Feedback visuel immédiat
- Accessibilité basique (boutons, labels)

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Vite](https://vitejs.dev/) pour l'outil de build incroyable
- [React](https://reactjs.org/) pour la bibliothèque UI
- La communauté TikTok pour les sons viraux !

---

**Développé avec ❤️ par [Votre Nom]**js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
