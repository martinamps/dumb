# World's Dumbest Website: Project Plan

## Project Overview

Creating an intentionally terrible website for worldsdumbestdomain.com as part of the "World's Dumbest Hackathon". The site aims to provide a hilariously frustrating user experience through intentionally poor design choices and useless features.

## Core Site Layout

- **Main Pane**: Features the horoscope selector and horoscope-based CAPTCHA challenge
- **Right Side Panel**: Contains three widgets:
  - Dumb Haiku (implemented)
  - Dramatically Overreacted Weather (implemented)
  - Stock Market Emoji Translator (coming soon)

## Feature Progress

### Implemented Features:

- [x] Basic site structure and layout
- [x] Cloudflare Workers AI integration
- [x] Dumb Haiku generator in right panel
- [x] Useless "Generate New Haiku" button (shows confirm dialog with "nah" and "nvm" options that do nothing)
- [x] Dramatically Overreacted Weather widget
  - [x] Dumb browser-based city selection algorithm (picks city based on browser type and user-agent length)
  - [x] Absurdly calculated temperature (based on time of day and nonsensical factors)
  - [x] Hyperbolic forecasts and alerts that dramatically overreact to normal conditions
  - [x] Randomly refreshes to appear unstable (every 20-40 seconds)
  - [x] Emergency-styled warnings and advice regardless of actual weather
- [x] Placeholder for stock widget

### Planned Features:

#### Horoscope Selector (Main Pane):

- [ ] Implement one of these intentionally terrible selector mechanisms:
  - [ ] Constellation Connect-the-Dots: Users must correctly connect stars with a shaky cursor
  - [ ] Zodiac Wheel of Misfortune: A spinning wheel that never stops on the desired sign
  - [ ] Astrological Slider: A circular slider with all 12 signs crammed into a tiny arc
  - [ ] Star Sign Memory Match: Users find matching pairs while cards randomly shuffle
  - [ ] Birth Month Calculator: Uses completely wrong system to calculate sign
  - [ ] Drag & Drop Chaos: Target box moves away when approached

#### Horoscope-Based CAPTCHA:

- [ ] Generate absurd CAPTCHAs based on the selected horoscope
- [ ] Create tailored challenges that match horoscope keywords
- [ ] Add intentionally frustrating verification steps

#### Pessimized Horoscope Delivery:

- [ ] Transform real horoscopes into hilariously pessimistic versions
- [ ] Add random "glitches" that reveal even worse predictions
- [ ] Include oddly specific yet universally applicable details
- [ ] Create a "share your misfortune" button that copies a censored version

#### Weather Widget:

- [ ] Fetch actual location weather data
- [ ] Dramatically overreact to normal weather conditions
- [ ] Use hyperbolic descriptions and unnecessary warnings
- [ ] Display contradictory forecasts

#### Stock Market Widget:

- [ ] Create incomprehensible financial data visualization
- [ ] Translate stock movements into random emoji sequences
- [ ] Generate nonsensical financial advice

## Technical Notes

- Built with Remix on Cloudflare Workers
- Using Cloudflare AI for generating haikus and potentially other content
- TailwindCSS for styling

## Development Phases

1. **Phase 1 (Completed)**:
   - Basic site structure
   - Right panel with haiku generator

2. **Phase 2 (Current)**:
   - Implement horoscope selector
   - Build CAPTCHA challenge

3. **Phase 3 (Upcoming)**:
   - Weather and stock widgets
   - Finishing touches and polish