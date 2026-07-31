"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getPackageJsonPath() {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
        return undefined;
    }
    return path.join(folder.uri.fsPath, 'package.json');
}
function getScripts() {
    const pkg = getPackageJsonPath();
    if (!pkg || !fs.existsSync(pkg)) {
        return {};
    }
    try {
        const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        return json.scripts ?? {};
    }
    catch {
        return {};
    }
}
function getTerminal() {
    return vscode.window.activeTerminal ?? vscode.window.createTerminal('NPM');
}
function runScript(name) {
    const terminal = getTerminal();
    terminal.show(true);
    terminal.sendText(`npm run ${name}`);
}
function getConfiguredScript() {
    return vscode.workspace.getConfiguration('nmScriptRunner').get('defaultScript', 'auto');
}
function getDefaultScript() {
    const scripts = getScripts();
    const configured = getConfiguredScript();
    if (configured !== 'auto') {
        return configured in scripts ? configured : undefined;
    }
    const priority = ['start', 'dev', 'serve', 'build'];
    return priority.find((script) => script in scripts);
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('npmRunner.start', () => {
        const script = getDefaultScript();
        if (!script) {
            vscode.window.showInformationMessage('No configured npm script found.');
            return;
        }
        runScript(script);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('npmRunner.pickScript', async () => {
        const scripts = getScripts();
        const names = Object.keys(scripts);
        if (!names.length) {
            vscode.window.showInformationMessage('No scripts found.');
            return;
        }
        const selected = await vscode.window.showQuickPick(names.map((name) => ({
            label: name,
            description: scripts[name],
        })), {
            placeHolder: 'Select an npm script',
        });
        if (!selected) {
            return;
        }
        runScript(selected.label);
    }));
    const pkg = getPackageJsonPath();
    if (pkg) {
        const watcher = vscode.workspace.createFileSystemWatcher(pkg);
        watcher.onDidChange(() => {
            vscode.commands.executeCommand('setContext', 'npmRunner.changed', true);
        });
        context.subscriptions.push(watcher);
    }
}
function deactivate() { }
