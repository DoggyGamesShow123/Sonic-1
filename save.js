// safe Module extension
var Module = Module || {};

Module.preRun = Module.preRun || [];
Module.postRun = Module.postRun || [];

const SAVE_KEY = "sonic1_sram";

function loadSave() {
    try {
        const base64 = localStorage.getItem(SAVE_KEY);
        if (!base64) return;

        const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const path = "/home/web_user/.local/share/sonic1/sram.bin";

        FS.mkdirTree("/home/web_user/.local/share/sonic1");
        FS.writeFile(path, binary);
        console.log("[SAVE] Loaded SRAM");
    } catch (e) {
        console.error(e);
    }
}

function autoSave() {
    try {
        const path = "/home/web_user/.local/share/sonic1/sram.bin";
        if (!FS.analyzePath(path).exists) return;

        const data = FS.readFile(path);
        const base64 = btoa(String.fromCharCode(...data));
        localStorage.setItem(SAVE_KEY, base64);
        console.log("[SAVE] Saved SRAM");
    } catch (e) {
        console.error(e);
    }
}

Module.preRun.push(loadSave);
Module.postRun.push(() => setInterval(autoSave, 5000));
