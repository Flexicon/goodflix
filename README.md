# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## TODO

Some work that currently needs doing:

- [x] ~~extract server side auth guard~~
- [ ] refactor search results page to be single column with card contents laid out horizontally
- [ ] handle search page post actions
  - add to individual watch lists
  - option to remove movies from lists immediately after adding them
- [ ] display latest movies from both lists on homepage
- [ ] add page to display specific lists
- [ ] handle removing movies from lists

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Running the production server

```bash
node build
```

