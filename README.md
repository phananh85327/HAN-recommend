# HAN-recommend

A React front end for the recommendation API of HAN-improve (`recommend_api.py`). It shows the
product recommendations of HAN and metapath2vec, each trained on an automatic (LMSPS), a manual and a
random meta-path set, and of GAT, side by side: for a customer, or as the neighbours of a product.

The data is the rebuilt Amazon co-purchasing metadata (SNAP), split seed 1: 48,883 products and
53,569 customers. The app holds no data of its own; everything comes from the API.

## What you need

- **Node.js 20.19+ or 22.12+** (a current 22 or 24 LTS release is fine). Check with `node -v`.
- **The HAN-improve API, running.** In the HAN-improve folder, start `recommend_api.bat` (port 8000).
  It needs the trained results in `output\AMAZON\v3`, the rebuilt `data\AMAZON` and the filtered
  CSVs; HAN-improve's README, section "Recommendation API", has the steps.

## Run it

```bat
npm install
npm run dev
```

Then open http://localhost:5173. `npm install` is needed once (and after the dependencies change).
The header says "13 models served" when the API answers; if it does not, a red banner says how to
start it.

During development the app's requests to `/api` are forwarded to the API, so the browser talks to
one address. If the API runs on another port, copy `.env.example` to `.env.local` and set
`HAN_API_URL`, e.g. `HAN_API_URL=http://127.0.0.1:8001`.

## The pages

| Page | What it shows |
|---|---|
| Start (`/`) | Six customers and five products chosen so the lists are easy to judge |
| Customers (`/users`) | Look up a customer ID or user index, or draw a random sample by number of reviewed products |
| Customer (`/users/<customer id>`) | What the customer reviewed, then each model's list side by side |
| Products (`/products`) | Search by title or ASIN (every word must appear) |
| Product (`/products/<ASIN>`) | The product, then each model's most similar products |
| Models (`/models`) | The served results, with test Hit@10, NDCG@10 and validation BPR |

On the customer and product pages:
- **Models:** the 6-path sets plus GAT (the default), the 4-path sets plus GAT, every served model,
  or a choice of your own.
- **List length:** top 5, 10 or 20.
- **Include products they already reviewed** (customer page): by default every product the customer
  reviewed is left out, held-out test purchases included, so the lists show what each model would
  recommend next. Ticked, the customer's own products are marked "reviewed": a model that knows the
  customer ranks several of them near the top.
- **"in N lists"** marks a product that N of the lists on the page contain.
- **Each product** shows its group, ASIN, Amazon's average rating and how many customers in the
  data reviewed it; the product page adds its Amazon sales rank (lower sells better). Rating and
  sales rank come from the 2006 data. They need the API of HAN-improve commit `49d41e7` or later;
  with an older API they are left out.

The settings are part of the address, so a view can be bookmarked or shared, e.g.
`/users/A3FF936V6MPPDI?size=4&k=20`.

How the lists are ranked: a customer's by the dot product of the customer's and the product's
vectors, the score the models were trained on; similar products by cosine similarity. To compare HAN
with metapath2vec, use the automatic and manual columns, which hold the same path set for both; the
random columns are different draws, each model's median by its own validation BPR (HAN-improve,
`review/example_recommendations.md`).

## Build and test

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:5173, reloading on every change |
| `npm test` | Unit tests (Vitest and Testing Library, against a mocked API) |
| `npm run build` | A static site in `dist/` |
| `npm run preview` | Serves `dist/` on http://localhost:4173, with the same forwarding to the API |

To serve `dist/` from anywhere else, build it with the API's address in `VITE_API_BASE` (in
`.env.local`); the API accepts calls from any origin.

## Layout

```
src/
  api.js            the API client: one function per endpoint, error messages
  models.js         grouping and labels for the served models
  config.js         the demo customers and products, list lengths
  selection.js      the model choice and list length, kept in the address
  served.jsx        health and the model list, loaded once for every page
  hooks.js          useAsync: load data when its inputs change
  components/       layout, product card, side-by-side lists, controls
  pages/            one file per page
  test/             test setup and the mocked API
```
