# Pauze® — Website

A monochrome cinematic personal site for **Pauze**, using the supplied Reel as a visual/motion reference while keeping the branding and implementation original.

## Experience

- Click-to-start cinematic entry screen
- Oversized editorial typography
- Monochrome floating product/can constellation
- Metallic light sweep and depth effects
- Cursor-following hero lighting and parallax
- Scroll progress indicator
- Scroll-driven hero exit
- Consistent reveal animations across sections
- Staggered card/link reveals
- Interactive question grid
- Hover-to-expand project previews
- Animated journey/timeline scene
- Rotating music disc
- Amazon Music playlists
- GitHub profile and Instagram links
- Live Discord presence via Lanyard REST/WebSocket
- Responsive mobile, tablet and desktop layouts
- Reduced-motion accessibility handling

## Links

The live links are configured in `script.js`:

- GitHub: https://github.com/PauzeDevs
- Instagram: https://www.instagram.com/highonthehighwayy/
- Punjab Da Pind: Amazon Music playlist
- Essentials — English Songs: Amazon Music playlist

## Run locally

Open `index.html` directly, or serve the repository with any static web server.

No build step is required.

## Structure

```
index.html      # Page structure and content
styles.css      # Base layout and visual system
motion.css      # Cinematic motion, hover and reveal layer
script.js       # Links, cursor, loader, scroll choreography and Lanyard presence
case-studies.js # Selected-work scene logic and case-study interactions
case-studies.css# Selected-work cinematic styling
```

## Security

Do not commit API keys, deployment credentials, database credentials, or other secrets.

## Maintainer

Maintained by [PauzeDevs](https://github.com/PauzeDevs).


## Lanyard setup

The live system panel uses Lanyard for Discord presence. The website subscribes to the configured Discord user ID over Lanyard's public WebSocket and uses the REST endpoint as the initial fallback. The Discord account must be monitored by Lanyard (for example, by joining the Lanyard Discord server) before presence data can be returned.

No Discord token or API key is stored in the website.
