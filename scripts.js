// ===== 1. ตัวแปร =====
const player = document.getElementById("player");
const fish = document.getElementById("fish");
const events = [];
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const game = document.getElementById("game");
const world = document.getElementById("world");
const fallingObjects = [];
let memoriesOpened = 0;
const TOTAL_MEMORIES = 3;


const WORLD_WIDTH = 2000;
const PLAYER_WIDTH = 80;

let y = 200;

const interactHint = document.getElementById("interact-hint");


const WORLD_HEIGHT = window.innerHeight;
const PLAYER_HEIGHT = 60;

let x = 50;
let canInteract = null;
let gameStarted = false;

let vx = 0;
let vy = 0;

const SPEED = 0.4;
const MAX_SPEED = 4;
const FRICTION = 0.92;

const NPC_FISH_IMAGES = [
  "assets/images/fish1.png",
  "assets/images/fish2.png",
  "assets/images/fish3.png",
  "assets/images/fish4.png"
];

const WATER_GRAVITY = 0.04;   // ช้ากว่าแรงโน้มถ่วงปกติ
const WATER_DRAG = 0.985;    // แรงต้านน้ำ

const keys = {};

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key.toLowerCase() === "e" && canInteract) {

    // ❌ ยังไม่ครบ → ไม่ให้เปิดหัวใจ
    if (
      canInteract.id === "ending" &&
      memoriesOpened < TOTAL_MEMORIES
    ) {
      return;
    }

    openPopup(
      canInteract.dataset.text,
      canInteract.dataset.image,
      canInteract
    );
  }
});


document.addEventListener("keyup", e => {
  keys[e.key] = false;
});


// ===== 2. ฟังก์ชัน =====
window.startGame = function () {
  document.getElementById("welcome").style.display = "none";
  gameStarted = true;

  setTimeout(() => {
    spawnFallingEvent(
      400,
      "อะแฮ่มๆๆๆ สวัสดีครับ เขินนะเนี่ยทำอะไรแบบนี้โอเคๆ อันนี้คือความทรงจำชิ้นแรกนะเจ้าวาฬข้าวปั้น เห็น logo นั่นมั้ยยย ใช่แล้ว roblox ไงละ คุณก็คงจำได้แหละเนาะการเจอกันครั้งแรกที่แบบงงๆ5555 จากคนที่ทักทาย จนอยู่กันถึงตี 4 จนผมเริ่มทักแชทไปบ่นกับคุณ แต่รู้มั้ยว่าอะไรในที่ตกผม ตอนนั้นหนะมันจะมีตัวละครที่แต่งเป็นเอเลี่ยนแล้วเขาพูดภาษาอังกฤษ ตอนแรกเราก็คุยเล่นสนุกๆจนเขาเริ่มขอๆอจีเราละเราไม่ชอบ เราพยายามไม่ให้ละคุณก็เดินมาคุยแนให้ว่า no no ไม่ๆ อะไรนี่แหละ อะแฮะ จังหวะตกหลุมรักเลยป้ะ ><",
      "assets/images/memory1.png"
    );
  }, 300);

  setTimeout(() => {
    spawnFallingEvent(
      900,
      "จำรูปนี้ได้มั้ยคับ5555 มีคนยอมเติมเกมละแต่งตัวคู่ด้วยคับ โคตรน่ารักอะ ทำไมจะไม่ชอบละเนาะเขาตามใจเราขนาดนี้ แต่น้องวาฬข้าวปั้นอย่าไปบอกใครนะ รู้กันแค่เรานะ ทั้งๆที่แต่งตัวไม่เป็น ก็พยายามแต่ง พยายามเล่น มันน่ารักมากๆๆๆๆเลย ",
      "assets/images/memory2.png"
    );
  }, 1200);

  setTimeout(() => {
    spawnFallingEvent(
      1400,
      "น้องวาฬข้าวปั้นรู้มั้ยว่าทำไมต้องเป็น emoji กอด เพราะเป็นสิ่งหนึ่งที่อั้มชอบมากเลยนะ ตอนนั้นหนะอั้มเคยถามจงว่าถ้าเจออั้มครั้งแรกจงจะทำอะไร จงบอกจะวิ่งมาจับกอดแล้วถูๆๆ บี้ๆๆแก้ม555 น่ารักเนาะ ตอนนั้นเขินมาก ปกติอั้มไม่ชอบกอดใครนะ แต่ถ้าเป็นจงอั้มต้องลองสักครั้งแล้วมั้ยนะ ว่าไงน้องวาฬข้าวปั้น❤️",
      "assets/images/memory3.png"
    );
  }, 2200);
};


function openPopup(text, image, sourceEl) {
  popupText.innerText = text;

  const img = document.getElementById("popup-image");
  if (image) {
    img.src = image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  popup.style.display = "flex";

  // ⭐ บอกว่า popup นี้มาจากอะไร
  popup.dataset.from = sourceEl?.id || "";

  // นับความทรงจำเฉพาะครั้งแรก
  if (sourceEl && sourceEl.classList.contains("event") && !sourceEl.dataset.opened) {
    sourceEl.dataset.opened = "true";
    memoriesOpened++;
    checkEndingUnlock();
  }
}


function checkEndingUnlock() {
  if (memoriesOpened >= TOTAL_MEMORIES) {
    document.getElementById("ending").classList.add("unlocked");
  }
}


// เพิ่มฟังก์ชันปิด Popup ให้ทำงานร่วมกับปุ่มใน HTML
window.closePopup = function () {
  popup.style.display = "none";

  vx = 0;
  vy = 0;

  // ⭐ ถ้าเป็น ending → ไปหน้าเพลง
  if (popup.dataset.from === "ending") {
    setTimeout(() => {
      window.location.href = "https://www.youtube.com/watch?v=pyGU-UudvrM&list=RDpyGU-UudvrM&start_radio=1";
    }, 600); // หน่วงนิดนึงให้ฟีลซึ้ง
  }
};


// ปรับปรุงฟังก์ชัน checkEvent ให้แม่นยำขึ้น
function checkEvent() {
  canInteract = null;
  const playerRect = player.getBoundingClientRect();

  // ===== Memory events =====
  events.forEach(obj => {
    const evRect = obj.el.getBoundingClientRect();

    const dx = Math.abs(
      (evRect.left + evRect.width / 2) -
      (playerRect.left + playerRect.width / 2)
    );
    const dy = Math.abs(
      (evRect.top + evRect.height / 2) -
      (playerRect.top + playerRect.height / 2)
    );

    if (dx < 80 && dy < 80) {
      canInteract = obj.el;
    }
  });

  // ===== ❤️ Ending =====
  const ending = document.getElementById("ending");
  const endRect = ending.getBoundingClientRect();

  const dxEnd = Math.abs(
    (endRect.left + endRect.width / 2) -
    (playerRect.left + playerRect.width / 2)
  );
  const dyEnd = Math.abs(
    (endRect.top + endRect.height / 2) -
    (playerRect.top + playerRect.height / 2)
  );

  if (dxEnd < 80 && dyEnd < 80) {
    canInteract = ending;

    if (memoriesOpened < TOTAL_MEMORIES) {
      ending.dataset.text =
        `อ่านความทรงจำแล้ว ${memoriesOpened} / ${TOTAL_MEMORIES}`;
      ending.dataset.image = "";
    } else {
      ending.classList.add("unlocked");
      ending.dataset.text = "สวัสดีครับและขอบคุณนะครับ ที่เดินทางกันมาจนถึงตอนนี้ได้ ขอบคุณมากจริงๆครับ 450 km. อ่านแล้วดูไกลมั้ยครับ แต่ตลอด 9 เดือน ที่ผ่านอะไรมาด้วยกันทำให้รู้ว่า ระยะทางไม่มีผลเลยครับ ผมไม่เคยรู้สึกเหงาเลย กลับรู้สึกอบอุ่น รู้สึกมีตัวตนอยู่ เพราะใครกันนะ น้องวาฬข้าวปั้นรู้มั้ยครับ พอดีอั้มชอบคนๆนี้จริงๆนะ ไม่เคยทำอะไรแบบนี้ให้ใครมาก่อนด้วยครับ แค่อยากทำให้เพราะอยากทำให้คนในความทรงจำแต่ละก้อนนั้นรู้ว่าเขาเก่งและสำคัญมากๆเลยครับ ผมทำสิ่งนี้โดยมีแนวคิดจาก เกมวันนั้นที่ทำให้ผมมีข้ออ้างได้กลับมาพบคนๆนี้ และสิ่งที่เขาชอบ น้องวาฬข้าวปั้นเป็นตัวแทนของคนๆนั้นได้อย่างดีเลยนะ มองกี่ทีก็เหมือนมากๆเลย555 เพ้อไปหมดละ ก็แค่คนๆนั้นเขาซื้อเค้กวันเกิดให้ด้วยนะ เขาร้องเพลงวันเกิดให้ด้วยวันนั้น ตื่นมามีความสุขมากเลย เลยอยากตื่นมามีความสุขแบบนั้นทุกวัน เพราะฉะนั้นว่ายน้ำไปด้วยกันนะคับ ไม่ใช่น้องวาฬข้าวปั้นแล้วนะ แต่เป็นจง";
      ending.dataset.image = "assets/images/ending.png";
    }
  }

  // ===== Hint =====
  if (canInteract && popup.style.display !== "flex") {
    interactHint.classList.add("show");

    const rect = canInteract.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    interactHint.style.left =
      rect.left - gameRect.left + rect.width / 2 + "px";

    interactHint.style.top =
      rect.top - gameRect.top - 30 + "px";

    interactHint.innerText =
      canInteract.id === "ending" && memoriesOpened < TOTAL_MEMORIES
        ? canInteract.dataset.text
        : "กด E";
  } else {
    interactHint.classList.remove("show");
  }
}



function spawnFallingEvent(x, text, image) {
  const ev = document.createElement("img");
  ev.className = "event";
  ev.dataset.text = text;
  ev.dataset.image = image; // ⭐ ตรงนี้
  ev.src = image;

  ev.style.left = x + "px";
  ev.style.top = "-100px";

  world.appendChild(ev);

const obj = {
  el: ev,
  y: -100,
  vy: 0,
  landed: false,
  baseY: -100,

  // ⭐ ค่าลอยแบบสุ่ม
  floatOffset: Math.random() * Math.PI * 2,
  floatAmplitude: 6 + Math.random() * 18, // ความสูงการลอย (ต่างกัน)
  floatSpeed: 0.01 + Math.random() * 0.02, // ความเร็วลอย (ต่างกัน)

  // ⭐ ค่าการเด้ง
  bouncePower: 0.45 + Math.random() * 0.35,

  scale: 0.75 + Math.random() * 0.5
};


  events.push(obj);
}


const ending = document.getElementById("ending");
if (ending.classList.contains("unlocked")) {
  const endRect = ending.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  const dx =
    Math.abs((endRect.left + endRect.width / 2) -
             (playerRect.left + playerRect.width / 2));
  const dy =
    Math.abs((endRect.top + endRect.height / 2) -
             (playerRect.top + playerRect.height / 2));

  if (dx < 80 && dy < 80) {
    canInteract = ending;
    ending.dataset.text = "เรามาถึงตรงนี้ด้วยกันแล้ว 💖";
    ending.dataset.image = "assets/images/ending.png"; // ใส่รูปฉากจบ
  }
}


function updateCamera() {
  const screenCenter = game.offsetWidth / 2;
  let cameraX = x - screenCenter + PLAYER_WIDTH / 2;

  // กันกล้องหลุดซ้าย
  if (cameraX < 0) cameraX = 0;

  // กันกล้องหลุดขวา
  const maxCameraX = WORLD_WIDTH - game.offsetWidth;
  if (cameraX > maxCameraX) cameraX = maxCameraX;

  world.style.transform = `translateX(${-cameraX}px)`;
}

function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  bubble.style.left = Math.random() * WORLD_WIDTH + "px";

  const size = 10 + Math.random() * 20;
  bubble.style.width = bubble.style.height = size + "px";

  const duration = 4 + Math.random() * 4;
  bubble.style.animationDuration = duration + "s";

  world.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, duration * 1000);
}

setInterval(createBubble, 800);

function spawnNPCFish() {
  const npc = document.createElement("img");

  const randomFish =
    NPC_FISH_IMAGES[Math.floor(Math.random() * NPC_FISH_IMAGES.length)];

  npc.src = randomFish;
  npc.className = "npc-fish";

  const fromLeft = Math.random() > 0.5;

  npc.style.top = 80 + Math.random() * (WORLD_HEIGHT - 50) + "px";
  npc.style.left = fromLeft ? "-80px" : WORLD_WIDTH + "px";

  if (!fromLeft) {
    npc.style.transform = "scaleX(-1)";
  }

  const duration = 6 + Math.random() * 6;
  npc.style.animationDuration = duration + "s";

  // ✨ สุ่มขนาดเล็กน้อย
  const scale = 0.6 + Math.random() * 0.6;
  npc.style.scale = scale;

  world.appendChild(npc);

  npc.style.opacity = 0.5 + Math.random() * 0.5;
npc.style.filter = scale < 0.8 ? "blur(1px)" : "none";


  setTimeout(() => npc.remove(), duration * 1000);
}
 
setInterval(spawnNPCFish, 2000);

if (Math.random() < 0.01) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.style.left = obj.el.style.left;
  bubble.style.top = obj.el.style.top;
  world.appendChild(bubble);

  setTimeout(() => bubble.remove(), 3000);
}


function gameLoop() {

  // ยังไม่เริ่มเกม → แค่รอ
  if (!gameStarted) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // popup เปิด → หยุดขยับ
  if (popup && popup.style.display === "flex") {
    requestAnimationFrame(gameLoop);
    return;
  }

  // ===== movement =====
  if (keys["ArrowRight"]) {
    vx += SPEED;
    fish.style.transform = "scaleX(1)";
  }
  if (keys["ArrowLeft"]) {
    vx -= SPEED;
    fish.style.transform = "scaleX(-1)";
  }
  if (keys["ArrowUp"]) vy -= SPEED;
  if (keys["ArrowDown"]) vy += SPEED;

  vx = Math.max(-MAX_SPEED, Math.min(vx, MAX_SPEED));
  vy = Math.max(-MAX_SPEED, Math.min(vy, MAX_SPEED));

  x += vx;
  y += vy;

  vx *= FRICTION;
  vy *= FRICTION;

  x = Math.max(0, Math.min(x, WORLD_WIDTH - PLAYER_WIDTH));
  y = Math.max(50, Math.min(y, WORLD_HEIGHT - PLAYER_HEIGHT - 50));

  player.style.left = x + "px";
  player.style.top = y + "px";

  updateCamera();
  checkEvent();

  // ===== falling + floating events =====
events.forEach(obj => {

  if (!obj.landed) {
    // 🌊 ตกในน้ำ (ช้า นุ่ม)
    obj.vy += WATER_GRAVITY;
    obj.vy *= WATER_DRAG;
    obj.y += obj.vy;

    const groundY = WORLD_HEIGHT - 140;

    if (obj.y >= groundY) {
      obj.y = groundY;

      // ⭐ เด้งสูง!
      obj.vy = -obj.vy * obj.bouncePower;

      // ถ้าเด้งแรงน้อยแล้ว → ถือว่าลงพื้น
      if (Math.abs(obj.vy) < 0.4) {
        obj.vy = 0;
        obj.landed = true;
        obj.baseY = groundY;
      }
    }

    obj.el.style.top = obj.y + "px";

  } else {
    // 🫧 ลอยขึ้นลงไม่เท่ากัน
    obj.floatOffset += obj.floatSpeed;

    const floatY =
      Math.sin(obj.floatOffset) * obj.floatAmplitude;

    const rotate =
      Math.sin(obj.floatOffset * 0.7) * 4;

    obj.el.style.top =
      obj.baseY + floatY + "px";

    obj.el.style.transform =
      `rotate(${rotate}deg) scale(${obj.scale})`;
  }

});



  requestAnimationFrame(gameLoop);
}

// เริ่ม loop
requestAnimationFrame(gameLoop);


console.log(x, y);
