const { app, BrowserWindow } = require('electron');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const user = encodeURIComponent('admin');
const password = encodeURIComponent('admin');
const authMechanism = 'DEFAULT';


const url = `mongodb://${user}:${password}@127.0.0.1:27017/news_comment?authMechanism=${authMechanism}`;

const dbName = 'test';



// client.connect(function(err){
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//     const db = client.db(dbName);

//     simplePipeline(db, function(){
//         client.close();
//     });
// });

const findDocuments = function (db, callback) {

    const collection = db.collection('news_article');
    collection.find({ 'level_code': 'YD000000' }).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
}

const simplePipeline = function (db, callback) {
    const collection = db.collection('news_article');
    collection.aggregate(
        [{ '$match': { "level_code": "YD000000", "status": 4 } },
        {
            '$group': {
                '_id': { 'month': { '$month': "$gmt_create" }, 'day': { '$dayOfMonth': "$gmt_create" }, 'year': { '$year': "$gmt_create" } },
                'count': { '$sum': 1 }
            }
        },
        { '$sort': { '_id.month': -1, '_id.year': -1, '_id.day': -1 } },
        { '$limit': 30 }
        ],
        function (err, cursor) {
            assert.equal(err, null);

            cursor.toArray(function (err, docs) {
                callback(docs);
            });
        }
    );
}

const peoplePipeline = function (db, callback) {
    const collection = db.collection('news_article');
    collection.aggregate(
        [{ '$match': { "level_code": "YD000000", "status": 4 } },
        {
            '$group': {
                '_id': { 'month': { '$month': "$gmt_create" }, 'day': { '$dayOfMonth': "$gmt_create" }, 'year': { '$year': "$gmt_create" }, 'total': "$author_id" }
            }
        },
        {
            '$group': {
                '_id': { 'year': "$_id.year", 'month': "$_id.month", 'day': "$_id.day" },
                'count': { '$sum': 1 }
            }
        },
        { '$sort': { '_id.month': -1, '_id.year': -1, '_id.day': -1 } },
        { '$limit': 30 }
        ],
        function (err, cursor) {
            assert.equal(err, null);

            cursor.toArray(function (err, docs) {
                callback(docs);
            });
        }
    );
}
// 保持对 window 对象的全局引用，如果不这么做的话，当 JavaScript 对象被
// 垃圾回收的时候，window 对象将会自动的关闭
let win

function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    const client = new MongoClient(url);

    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        simplePipeline(db, function (moment) {
            console.log("moment: ", moment);
            win.webContents.send("moment", moment);
        });

        peoplePipeline(db, function (people) {
            console.log("people: ", people);
            win.webContents.send("people", people);
        });

        client.close();
    });

    // 加载 index.html 文件
    win.loadFile('./app/index.html');

    // 打开开发者工具
    // win.webContents.openDevTools()

    // 当 window 被关闭，这个事件会被触发
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    });
}

// Electron 会初始化并准备
// 创建浏览器窗口时，调用这个函数
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 MacOS 上，除非用户用 COMMAND + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 MacOS 上，当单击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序种重新创建一个窗口
    if (win === null) {
        createWindow()
    }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。