# elek.io

[![Maintainability](https://api.codeclimate.com/v1/badges/01462e6a23d258bea092/maintainability)](https://codeclimate.com/github/elek-io/elek.io/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/01462e6a23d258bea092/test_coverage)](https://codeclimate.com/github/elek-io/elek.io/test_coverage)

This is a monorepo for all public elek.io code, including an [UI library and design system](packages/ui/), a [Core library](packages/core/) that handles logic of the CMS, a [Next.js Client Frontend](apps/client-frontend/) that represents the Clients GUI and [the Client itself](apps/client/), which uses all of it and combines it into one electron application.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a package manager. It includes the following packages/apps:

```
|-- elek.io monorepo
|   |-- apps
|   |   |-- client
|   |   |   An Electron desktop application that uses
|   |   |   client-frontend to render the GUI and connect
|   |   |   it to Core library's CMS functionality
|   |   |-- client-frontend
|   |   |   A Next.js and Tailwind CSS GUI for the Client that
|   |   |   uses the UI library to build the CMS interface
|   |-- packages
|   |   |-- config
|   |   |   Shared config files for typescript and tailwind
|   |   |   used by all other apps and packages
|   |   |-- core
|   |   |   Typescript library that handles logic of the CMS
|   |   |   like file IO, version control, parsing and building.
|   |   |   It's used by the Client's Electron main process
|   |   |-- ui
|   |   |   UI library (React) and design system (Storybook)
|   |   |   used inside client-frontend to render the GUI
```

### Contribute / Development

Everybody is welcome to help with this project. From documentation, writing issues, UI/UX suggestions to submitting code.

elek.io gives official team members the ability to run their development environment on [GitHub Codespaces](https://docs.github.com/en/codespaces).

To develop all apps and packages, run the following command:

```
pnpm run dev
```

This will run all apps and packages in development mode.
But most of the time you'll probably want to only develop one part at the time, like the UI library. For this run:

```
pnpm run dev --filter=ui
```

to only run certain apps and packages. Read more about this at the [Turborepo documentation pages](https://turbo.build/repo/docs/reference/command-line-reference#--filter).

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

The filter argument is available like above to only build certain parts.

### CI/CD

CI/CD is handled by GitHub Actions. You can find it's configuration files inside `.github/workflows`. CI is mainly run on pull requests to validate the submitted code by testing and building the application. CD is only run on releases / whenever code is pushed to the `main` branch and release drafts are automatically opened.
