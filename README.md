# The Spirit Nerds Trivia Quiz

An interactive trivia quiz application focused on spirits, cocktails, and beverage knowledge.

## Features

- Multiple-choice quiz format with timed questions
- Beautiful animated UI with glass-morphism design
- Detailed explanations for each answer
- Score tracking and results summary
- Mobile-responsive design
- Leaderboard functionality

## Tech Stack

- React.js for UI components
- Styled Components for styling
- Framer Motion for animations
- Local Storage for saving progress
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/spirits-trivia-quiz.git
   cd spirits-trivia-quiz
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

We've made deployment easy with multiple options:

### Quick Deploy

Use our deployment script to deploy to your platform of choice:

```bash
# Make the script executable first
chmod +x scripts/deploy.sh

# Deploy to GitHub Pages
./scripts/deploy.sh --github

# Deploy to Netlify
./scripts/deploy.sh --netlify

# Deploy to Vercel
./scripts/deploy.sh --vercel

# Get help
./scripts/deploy.sh --help
```

### Manual Deployment

For detailed deployment instructions, see our [Deployment Guide](./DEPLOYMENT.md).

## Development

### Project Structure

```
spirits-trivia-quiz/
├── public/              # Static files
├── src/                 # Source files
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── data/            # Quiz questions and data
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.js           # Main App component
│   └── index.js         # Entry point
├── scripts/             # Utility scripts including deployment
└── package.json         # Dependencies and scripts
```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All contributors and maintainers
- The spirits and cocktail community for inspiration
- Open source libraries and tools used in this project

---

© The Spirit Nerds
