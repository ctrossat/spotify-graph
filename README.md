# Spotify-Graph

Small web-app that shows graphical information about your spotify account. Using Next-Auth and Tremor.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- [ ] Displays most listened song over different timespans.
- [ ] Securely connect with Spotify API with [NextAuth](https://next-auth.js.org) and Oath2 protocol
- [ ] Resfresh Token implementation for optimal user experience
- [ ] Dynamic client data fectching using [SWR](https://swr.vercel.app)
- [ ] Data displayed with the use of [Tremor](https://tremor.so) components

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version >= 14.x.x recommended)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) or [npm](https://www.npmjs.com/get-npm)
- A **Spotify app**, see the 'Create an app' section of [this documentation](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)
  
### Clone the repository

```bash
git clone https://github.com/ctrossat/spotify-graph.git
cd spotify-graph
```

### Install Dependencies

Using Yarn:

```bash
yarn install
```

Or using npm:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add your variables as shown below:

```plaintext
NEXTAUTH_SECRET=your_nextauth_secret (see https://next-auth.js.org/configuration/options#nextauth_secret)
NEXTAUTH_URL=http://localhost:3000/

SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET= your_spotify_secret

SPOTIFY_API_URL=https://api.spotify.com/v1
```

## Usage

### Running the Development Server

```bash
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

### Building for Production

```bash
yarn build
# or
npm run build
```

To serve the production build locally:

```bash
yarn start
# or
npm run start
```

## Project Structure

```
├── /app            # Page components and API routes (Next.js app routing)
├── /components     # Reusable components
  ├── /tremor       # Components from Tremor library
├── /lib            # Code snippets
└── README.md
```

## License

This project is licensed under the [MIT License](LICENSE).
