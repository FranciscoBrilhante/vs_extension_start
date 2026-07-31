# Start Script Button

Adds a **Run NPM Script** button to the Visual Studio Code terminal toolbar. With a single click, the extension automatically finds the main script defined in your workspace's `package.json` and runs it in the active terminal. Other scripts will also appear under a dropdown.

The source code is open and available, go check it out (it's only 1 .ts file!).

## Features

- 🚀 Adds a convenient button to the terminal toolbar.
- 📦 Automatically loads scripts from your workspace's `package.json`.
- ▶️ Runs the script in the active terminal with one click.
- 🛠️ No configuration required.

## Requirements

- A workspace containing a `package.json` file with scripts entry.

Example:

```json
{
    "scripts": {
        "start": "vite"
    }
}
```

Click the toolbar button, and the extension will execute:

```sh
npm run <your_command>
```

## Configuration

You can change the default script to run under the extension setting `@ext:francisco-fernandes.npm-script-button`. Just type `start`, `dev`, `build`, etc.
