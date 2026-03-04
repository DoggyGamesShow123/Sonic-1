// save.js — IDBFS persistent save + audio unlock

const SAVE_DIR = "/home/web_user/.local/share/sonic1";
const SAVE_FILE = SAVE_DIR + "/sram.bin";

// AUDIO UNLOCK
function resumeAudio() {
    try {
        const ctx = Module?.SDL2?.audioContext || Module?.audioContext;
        if (ctx && ctx.state === "suspended") {
            ctx.resume().then(() => console.log("[AUDIO] Resumed"));
        }
    } catch (e) {
        console.log("[AUDIO] resume error", e);
    }
}

document.addEventListener("click", resumeAudio);
document.addEventListener("keydown", resumeAudio);

// IDBFS MOUNT + SYNC
function mountIDBFS() {
    try {
        FS.mkdirTree(SAVE_DIR);
        FS.mount(IDBFS, {}, SAVE_DIR);

        FS.syncfs(true, (err) => {
            console.log("[IDBFS] Loaded", err);
        });
    } catch (e) {
        console.error("[IDBFS] mount error", e);
    }
}

function saveToIDBFS() {
    FS.syncfs(false, (err) => {
        console.log("[IDBFS] Saved", err);
    });
}
