// save.js — handles saving Sonic 1 SRAM to localStorage

const SAVE_KEY = "sonic1_save_sram";

// Save SRAM every 5 seconds
function autoSave() {
    try {
        // Emscripten FS path where SRAM is stored
        const path = "/home/web_user/.local/share/sonic1/sram.bin";

        if (FS.analyzePath(path).exists) {
            const data = FS.readFile(path, { encoding: "binary" });
            const base64 = btoa(String.fromCharCode(...data));
            localStorage.setItem(SAVE_KEY, base64);
            console.log("[SAVE] SRAM saved.");
        }
    } catch (e) {
        console.error("[SAVE ERROR]", e);
    }
}

function loadSave() {
    try {
        const base64 = localStorage.getItem(SAVE_KEY);
        if (!base64) return;

        const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const path = "/home/web_user/.local/share/sonic1/sram.bin";

        // Ensure folder exists
        FS.mkdirTree("/home/web_user/.local/share/sonic1");

        FS.writeFile(path, binary, { encoding: "binary" });
        console.log("[SAVE] SRAM loaded.");
    } catch (e) {
        console.error("[LOAD ERROR]", e);
    }
}

// Load save on startup
Module = {
    preRun: [loadSave],
    postRun: () => setInterval(autoSave, 5000)
};
