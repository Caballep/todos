const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow = electron;
let addWindow = electron;   

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit()); //Window close is not the same that end the app, so if the main window is closed all the children windows will die too

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    mainWindow.setMenu(mainMenu);
    
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 250,
        height: 175,
        title: 'Add New Todo'
    });

    const emptyMenu = Menu.buildFromTemplate(menuTemplateEmpty);
    addWindow.setMenu(null);

    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => { addWindow = null; })
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

const menuTemplateEmpty = [];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
    menuTemplateEmpty.unshift();
}

if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'DEVELOPER',
        submenu: [
            {role: 'reload'},
            {
                label: 'Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });

    menuTemplateEmpty.push({
        label: 'DEVELOPER',
        submenu: [
            {
                label: 'Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}