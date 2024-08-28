const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const { exec } = require('child_process');
const startUrl = 'http://localhost:3000';
const express = require('express');
const expressApp = express();
const server = require('http').createServer(expressApp);

let mainWindow;
let flaskProcess;
let flaskStarted = false;

function createWindow() {
    
    const flaskPath = path.join(__dirname, 'main.exe');
    
    flaskProcess = execFile(flaskPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true
        },
    });

    mainWindow.loadURL(startUrl);
    // mainWindow.loadFile(path.join(__dirname, 'out/index.html'))

    // Handle the window close event
    mainWindow.on('close', () => {
        if (flaskProcess) {
            flaskProcess.kill('SIGTERM');

        }
    });
}

// const flaskPath = path.join(__dirname, 'main.exe');


app.on('ready', () => {
    // flaskProcess = execFile(flaskPath, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error: ${error}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);
    // });

    expressApp.use(express.static(path.join(__dirname, 'out')));

    expressApp.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'out', 'index.html'));
    });

    server.listen(3000, () => {
        console.log('Server running on port 3000');
        createWindow();
    });

    ipcMain.on('open-folder', (event, folderPath) => {
        shell.showItemInFolder(folderPath);
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        exec('taskkill /f /t /im main.exe', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error terminating process: ${err}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


app.on('before-quit', () => {
    // Ensure the Flask server is terminated when the app is quit
    if (flaskProcess) {
        flaskProcess.kill('SIGTERM');
    }
});