[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

<h3 align="center">📦🔖</h3>
<h3 align="center">Build and Tag action</h3>

---

A GitHub Action for publishing JavaScript Actions! It's designed to act on new releases, and updates the tag with a compiled JS file, using [`@vercel/ncc`](https://github.com/vercel/ncc). The process looks like this:

- Reads the `main` property in your `package.json`
- Force pushes `action.yml` and the above file to the release's tag
- Force pushes to the major version tag (ex: `v1.0.0` -> `v1`)

<img width="1005" alt="image" src="https://user-images.githubusercontent.com/10660468/82084147-d894ca00-96b8-11ea-9a14-1640d6963213.png">

This repository even uses it! `@vercel/ncc` supports TypeScript out of the box 😍

## Usage

```yaml
name: Publish

on:
  release:
    types: [published, edited]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          ref: ${{ github.event.release.tag_name }}
      - name: Install deps and build
        run: npm ci && npm run build
      - uses: step-security/build-and-tag-action@v2
        env:
          GITHUB_TOKEN: ${{ github.token }}
```

You can also use this action with other events - you'll just need to specify a `tag_name` (see below).

## Example `package.json` for your project

The two important thing you'll need to set in your action are the `main` field and the `build` script. Here's an example of a minimal `package.json` that will use `@vercel/ncc` to compile your action to `dist/index.js`, update your `action.yml` file to use the `node24` runtime and point `build-and-tag-action` at the compiled file:

```json
{
  "name": "your-action-name",
  "main": "dist/index.js",
  "scripts": {
    "build": "npx @vercel/ncc build && npx convert-action"
  }
}
```

Your `package.json` will probably contain a `dependencies` section, in addition to other fields such as `license`.

## Options

**tag_name**

The tag to update. If the workflow event is `release`, it will use the `tag_name` from the event payload. This option can be useful when using this action in a workflow with other actions that generate a release:

```yaml
- uses: fictional/releaser@v1 # Not a real action!
  id: releaser
- uses: step-security/build-and-tag-action@v2
  with:
    tag_name: ${{ steps.releaser.outputs.tag_name }}
```
