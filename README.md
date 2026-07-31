# Start Script Button

Adds a **Run Start Script** button to the Visual Studio Code terminal toolbar. With a single click, the extension automatically finds the `start` script defined in your workspace's `package.json` and runs it in the active terminal. Other scripts will also appear under a dropdown.

## Features

- 🚀 Adds a convenient button to the terminal toolbar.
- 📦 Automatically detects the `start` script in your workspace's `package.json`.
- ▶️ Runs the script in the active terminal with one click.
- 🛠️ No configuration required.

## Requirements

- A workspace containing a `package.json` file.
- A `start` script defined in the `scripts` section.

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
npm run start
```

(or the appropriate package manager command, if supported by the extension).
