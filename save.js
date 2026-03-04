const SAVE_KEY = "sonic1_sram";
const SRAM_PATH = "/home/web_user/.local/share/sonic1/sram.bin";

function loadSave() {
    try {
        const base64 = localStorage.getItem(SAVE_KEY);
        if (!base64) {
            console.log("[SAVE] No existing save.");
            return;
        }

        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        FS.mkdirTree("/home/web_user/.local/share/sonic1");
        FS.writeFile(SRAM_PATH, bytes, { encoding: "binary" });

        console.log("[SAVE] Loaded from localStorage.");
    } catch (e) {
        console.error("[SAVE] load error", e);
    }
}

function autoSave() {
    try {
        if (!FS.analyzePath(SRAM_PATH).exists) return;

        const data = FS.readFile(SRAM_PATH, { encoding: "binary" });
        const base64 = btoa(String.fromCharCode(...data));
        localStorage.setItem(SAVE_KEY, base64);

        console.log("[SAVE] Saved to localStorage.");
    } catch (e) {
        console.error("[SAVE] save error", e);
    }
}
