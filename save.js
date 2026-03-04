// save.js — Sonic 1 WASM: persistent SRAM via localStorage + audio unlock

const SAVE_KEY = "sonic1_sram";

// Path used by the Sonic 1 WASM port for SRAM
const SRAM_PATH = "/home/web_user/.local/share/sonic1/sram.bin";

// ---- SAVE / LOAD ----

function loadSave() {
    try {
        const base64 = localStorage.getItem(SAVE_KEY);
        if (!base64) {
            console.log("[SAVE] No existing save found.");
            return;
        }

        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        FS.mkdirTree("/home/web_user/.local/share/sonic1");
        FS.writeFile(SRAM_PATH, bytes, { encoding: "binary" });

        console.log("[SAVE] SRAM loaded from localStorage.");
    } catch (e) {
        console.error("[SAVE] Load error:", e);
    }
}

function autoSave() {
    try {
        if (!FS.analyzePath(SRAM_PATH).exists) {
            // Game hasn’t created SRAM yet
            return;
        }

        const data = FS.readFile(SRAM_PATH, { encoding: "binary" });
        const base64 = btoa(String.fromCharCode(...data));
        localStorage.setItem(SAVE_KEY, base64);

        console.log("[SAVE] SRAM saved to localStorage.");
    } catch (e) {
        console.error("[SAVE] Save error:", e);
    }
}

// ---- AUDIO UNLOCK ----

function resumeAudio() {
    try {
        const sdl = Module && Module.SDL2;
        const ctx = sdl && sdl.audioContext;
        if (ctx && ctx.state === "suspended") {
            ctx.resume().then(() => {
                console.log("[AUDIO] Resumed.");
            });
        }
    } catch (e) {
        console.error("[AUDIO] Resume error:", e);
    }
}

window.addEventListener("click", resumeAudio);
window.addEventListener("keydown", resumeAudio);
