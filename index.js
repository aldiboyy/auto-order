const { Telegraf, Markup } = require('telegraf');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');

const { TOKEN, OWNER_ID, OWNER_USERNAME } = config;
const bot = new Telegraf(TOKEN);

// Setup database lowdb
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const defaultData = {
    users: {},
    stok: {
        indonesia: { nominus: [], spam: [] },
        luar: { nominus: [], spam: [] }
    },
    harga: {
        indonesia_nominus: 5000,
        indonesia_spam: 3000,
        luar_nominus: 7000,
        luar_spam: 4000
    },
    dana: "089xxxxxxxx",
    gopay: "089xxxxxxxx",
    maintenance: false,
    channel_notif: "",
    total_deposit: 0,
    total_stok_terjual: 0,
    pending_deposit: {}, // buat nyimpen data deposit yang nunggu ACC
    state: {}
};
const db = new Low(adapter, defaultData);

// Helper
const isOwner = (userId) => userId === OWNER_ID;
const fmt = (num) => num.toLocaleString('id-ID');

async function initDB() {
    await db.read();
    db.data ||= defaultData;
