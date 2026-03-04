// save.js — Sonic 1 Save + Audio Fix

const SAVE_KEY = "sonic1_sram";

// Load save before game starts
function loadSave() {
    try {
        const base64 = localStorage.getItem(SAVE_KEY);
        if (!base64) return;

        const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const path = "/home/web_user/.local/share/sonic1/sram.bin";

        FS.mkdirTree("/home/web_user/.local/share/sonic1");
        FS.writeFile(path, binary, { encoding: "binary" });

        console.log("[LOAD] Save loaded.");
    } catch (e) {
        console.error("[LOAD ERROR]", e);
    }
}

// Save every 5 seconds
function autoSave() {
    try {
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

// Audio unlock
function resumeAudio() {
    const ctx = Module['SDL2']?.audioContext;
    if (ctx && ctx.state === "suspended") {
        ctx.resume();
        console.log("[AUDIO] Resumed.");
    }
}

window.addEventListener("click", resumeAudio);
window.addEventListener("keydown", resumeAudio);

// Attach hooks to Module
var Module = window.Module || {};

Module.preRun = Module.preRun || [];
Module.postRun = Module.postRun || [];

Module.preRun.push(loadSave);
Module.postRun.push(() => setInterval(autoSave, 5000));

Module.onRuntimeInitialized = () => {
    resumeAudio();
};
