# MB Garagem Automotiva

Website for **MB Garagem Automotiva**, a car care and repair shop in Garça/SP (Brazil), for cars and motorcycles, by appointment.

**Live:** [autocare-smoky-rho.vercel.app](https://autocare-smoky-rho.vercel.app)

## Features

- **Services menu:** polishing, headlight restoration, interior cleaning, seat washing, power windows, mirrors, bumpers and more.
- **Interactive car map:** the visitor picks a part of the vehicle and sees the related services.
- **Before and after slider** and a gallery of finished work.
- **Reviews** from customers.
- **Quote in 3 taps:** a short form that sends the request ready-made to WhatsApp.
- Mobile-first layout with a fixed action bar.

## Stack

Pure **HTML, CSS and JavaScript**, with no build step. Styles are split by section (`css/`) and use shared design tokens (`css/tokens.css`). Each interactive feature has its own script in `js/`.

```
index.html
css/   tokens, base, header, hero, services, gallery, before-after, reviews, quote, contact...
js/    main, car-map, before-after, quote, intro, hero-polish
```

## Running locally

```bash
npx serve .
```

Or open `index.html` directly in the browser. Deployed on Vercel.

## Author

Developed by [Leonardo de Oliveira](https://github.com/leozxinho).
