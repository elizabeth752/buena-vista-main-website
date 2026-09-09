# Image masters

The full-resolution PNGs the site was designed against. They are kept for
re-cropping and re-export, and they are deliberately NOT in `public/`, because
anything in `public/` is copied into the deploy whether a page uses it or not —
that was 238 MB of files no visitor ever requested.

What ships is the WebP next to each referenced image under `public/Asset/`.

To re-export after adding or replacing a master:

    node scripts/optimize-images.mjs

That reads every raster path referenced from `src/`, writes a WebP beside the
original capped at 1600px wide, and prints the size change.
