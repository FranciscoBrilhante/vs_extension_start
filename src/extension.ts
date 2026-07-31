import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function getPackageJsonPath(): string | undefined {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
        return undefined;
    }

    return path.join(folder.uri.fsPath, 'package.json');
}

function getScripts(): Record<string, string> {
    const pkg = getPackageJsonPath();

    if (!pkg || !fs.existsSync(pkg)) {
        return {};
    }

    try {
        const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        return json.scripts ?? {};
    } catch {
        return {};
    }
}

function getTerminal(): vscode.Terminal {
    return vscode.window.activeTerminal ?? vscode.window.createTerminal('NPM');
}

function runScript(name: string) {
    const terminal = getTerminal();

    terminal.show(true);
    terminal.sendText(`npm run ${name}`);
}

function getConfiguredScript(): string {
    return vscode.workspace.getConfiguration('nmScriptRunner').get<string>('defaultScript', 'auto');
}

function getDefaultScript(): string | undefined {
    const scripts = getScripts();
    const configured = getConfiguredScript();

    if (configured !== 'auto') {
        return configured in scripts ? configured : undefined;
    }

    const priority = ['start', 'dev', 'serve', 'build'];

    return priority.find((script) => script in scripts);
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('npmRunner.start', () => {
            const script = getDefaultScript();

            if (!script) {
                vscode.window.showInformationMessage('No configured npm script found.');
                return;
            }

            runScript(script);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('npmRunner.pickScript', async () => {
            const scripts = getScripts();

            const names = Object.keys(scripts);

            if (!names.length) {
                vscode.window.showInformationMessage('No scripts found.');
                return;
            }

            const selected = await vscode.window.showQuickPick(
                names.map((name) => ({
                    label: name,
                    description: scripts[name],
                })),
                {
                    placeHolder: 'Select an npm script',
                }
            );

            if (!selected) {
                return;
            }

            runScript(selected.label);
        })
    );

    const pkg = getPackageJsonPath();

    if (pkg) {
        const watcher = vscode.workspace.createFileSystemWatcher(pkg);

        watcher.onDidChange(() => {
            vscode.commands.executeCommand('setContext', 'npmRunner.changed', true);
        });

        context.subscriptions.push(watcher);
    }
}

export function deactivate() {}
