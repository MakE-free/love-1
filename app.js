
    const noBtn = document.querySelector("#noBtn");
    const yesBtn = document.querySelector("#yesBtn");
    const hint = document.querySelector("#hint");
    const speech = document.querySelector("#speech");
    const verdict = document.querySelector("#verdict");
    const actions = document.querySelector("#actions");
    const paws = document.querySelector(".paws");
    const confetti = document.querySelector(".confetti");
    const countdownTitle = document.querySelector("#countdownTitle");
    const daysLeft = document.querySelector("#daysLeft");
    const hoursLeft = document.querySelector("#hoursLeft");
    const minutesLeft = document.querySelector("#minutesLeft");
    const secondsLeft = document.querySelector("#secondsLeft");
    const dateTime = new Date("2026-10-28T00:00:00+05:00").getTime(); // 28 қазанның басталуы; кездесу сағаты әлі келісілмеген.

    const noLines = [
      "Жоқ дейсің бе? Мысық естімегендей болды.",
      "Батырма жауапкершіліктен қорқып кетті.",
      "404 қатесі: бас тарту табылмады.",
      "«Жоқ» гүл иіскеуге қашып кетті.",
      "Бас тартуға тым сүйкімді ғой.",
      "Мысық табанымен жолды жауып тастады.",
      "«Жоқ» уақытша үзілісте.",
      "Басып қала жаздадың. Сәл-ақ қалды.",
      "Романтика сервері сұрауды қабылдамады.",
      "Батырма тағы бір мүмкіндік сұрады."
    ];

    const speechLines = [
      "Мяу, өтінемін",
      "Гүлдер де қобалжып тұр",
      "Бұл көзқарасты жаттықтырдым",
      "«Жоқ» есептелмейді",
      "Кездесуге барайықшы",
      "Табаныммен «иә» деймін"
    ];

    let escapeCount = 0;
    let locked = false;
    let trapReady = false;
    let lastEscapeAt = 0;
    const escapeCooldown = 520;
    const trapAfter = 5;

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createPaw(x, y) {
      const paw = document.createElement("span");
      paw.className = "paw";
      paw.style.left = `${x}px`;
      paw.style.top = `${y}px`;
      paw.innerHTML = "<span class='toe'></span><span class='toe'></span><span class='toe'></span>";
      paws.appendChild(paw);
      setTimeout(() => paw.remove(), 750);
    }

    function updateCountdown() {
      if (dateTime === null) {
        [daysLeft, hoursLeft, minutesLeft, secondsLeft].forEach(box => box.textContent = "—");
        return;
      }
      const diff = Math.max(0, dateTime - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (value) => String(value).padStart(2, "0");

      daysLeft.textContent = pad(days);
      hoursLeft.textContent = pad(hours);
      minutesLeft.textContent = pad(minutes);
      secondsLeft.textContent = pad(seconds);

      if (diff === 0) {
        countdownTitle.textContent = "Бүгін — біздің кездесу күніміз!";
      }
    }

    function floatNoButton() {
      if (noBtn.parentElement === document.body) return;

      const rect = noBtn.getBoundingClientRect();
      noBtn.classList.add("running");
      document.body.appendChild(noBtn);
      noBtn.style.width = `${Math.round(rect.width)}px`;
      noBtn.style.left = `${Math.round(rect.left)}px`;
      noBtn.style.top = `${Math.round(rect.top)}px`;
    }

    function placeNoTrap() {
      const firstRect = yesBtn.getBoundingClientRect();
      const needsScroll = firstRect.top < 70 || firstRect.bottom > window.innerHeight - 26;

      if (needsScroll) {
        yesBtn.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        window.setTimeout(placeNoTrap, 320);
        return;
      }

      floatNoButton();
      const yesRect = yesBtn.getBoundingClientRect();
      const noRect = noBtn.getBoundingClientRect();
      const width = Math.min(168, window.innerWidth - 36);
      const height = Math.max(noRect.height, 52);

      trapReady = true;
      noBtn.classList.add("running", "trap");
      yesBtn.classList.add("teased");
      noBtn.style.width = `${width}px`;
      noBtn.style.left = `${Math.round(yesRect.left + yesRect.width / 2 - width / 2)}px`;
      noBtn.style.top = `${Math.round(yesRect.top + yesRect.height / 2 - height / 2)}px`;
      noBtn.style.transform = "";
      noBtn.textContent = "Шынымен жоқ па? 😼";
      hint.textContent = "Мысық қулық ойлап тапты: «Жоқ» батырмасы «Иә»-нің орнына тұрып алды. Енді ол да келіседі!";
      speech.textContent = "Басып көрші";
    }

    function moveNoButton(event) {
      if (locked) return;
      if (trapReady) {
        placeNoTrap();
        return;
      }

      const now = Date.now();
      if (now - lastEscapeAt < escapeCooldown) return;
      lastEscapeAt = now;

      floatNoButton();
      const rect = noBtn.getBoundingClientRect();
      const actionsRect = actions.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const padding = 14;
      const maxLeft = Math.max(padding, vw - rect.width - padding);
      const maxTop = Math.max(padding, vh - rect.height - padding);
      const nearButtons = Math.min(maxTop - 8, Math.max(padding + 20, actionsRect.top - rect.height - 18));
      const lowerButtons = Math.min(maxTop - 8, Math.max(padding + 20, actionsRect.bottom + 12));
      const midLower = Math.min(maxTop - 8, Math.max(padding + 20, actionsRect.top - rect.height - 88));
      const sideRun = [
        { left: maxLeft, top: nearButtons },
        { left: padding, top: nearButtons },
        { left: maxLeft, top: midLower },
        { left: padding, top: midLower },
        { left: maxLeft, top: lowerButtons },
        { left: padding, top: lowerButtons }
      ];
      const target = sideRun[escapeCount % sideRun.length];

      noBtn.style.left = `${Math.round(Math.min(maxLeft, Math.max(padding, target.left + random(-10, 10))))}px`;
      noBtn.style.top = `${Math.round(Math.min(maxTop - 8, Math.max(padding + 20, target.top + random(-8, 8))))}px`;
      noBtn.style.transform = `rotate(${Math.round(random(-12, 12))}deg) scale(${Math.max(0.72, 1 - escapeCount * 0.035)})`;

      const line = noLines[escapeCount % noLines.length];
      hint.textContent = line;
      noBtn.textContent = escapeCount > 7 ? "Жарайды..." : ["Жоқ", "Жо-оқ", "Ой", "Тимеді", "Кейін"][escapeCount % 5];
      speech.textContent = speechLines[escapeCount % speechLines.length];

      const x = event?.clientX ?? rect.left + rect.width / 2;
      const y = event?.clientY ?? rect.top + rect.height / 2;
      createPaw(x, y);

      escapeCount += 1;
      if (escapeCount >= trapAfter) {
        window.setTimeout(placeNoTrap, 180);
      }
    }

    function celebrate() {
      if (locked) return;
      locked = true;
      trapReady = false;
      document.body.classList.add("accepted");
      noBtn.style.opacity = "0";
      noBtn.style.pointerEvents = "none";
      yesBtn.classList.remove("teased");
      actions.style.gridTemplateColumns = "1fr";
      yesBtn.textContent = "Алақай!";
      hint.textContent = "Келістік пуська, кездесуіміздің чек-листіне өтсеңіз";
      speech.textContent = "Мяу, алақай!";
      verdict.classList.add("show");
      launchConfetti();
    }

    function launchConfetti() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const colors = ["#c56b39", "#e3ad50", "#87915c", "#d88b55", "#a45142", "#edc67a"];
      for (let i = 0; i < 96; i += 1) {
        const piece = document.createElement("span");
        const isHeart = i % 5 === 0;
        piece.className = isHeart ? "heart" : "confetti-piece";
        piece.textContent = isHeart ? "♥" : "";
        piece.style.left = `${random(0, 100)}vw`;
        piece.style.top = `${random(-25, -5)}svh`;
        piece.style.setProperty("--bg", colors[i % colors.length]);
        piece.style.setProperty("--dur", `${random(2.2, 4.2)}s`);
        piece.style.setProperty("--drift", `${random(-80, 80)}px`);
        piece.style.transform = `rotate(${random(0, 180)}deg)`;
        confetti.appendChild(piece);
        setTimeout(() => piece.remove(), 4400);
      }
    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      noBtn.addEventListener("pointerenter", moveNoButton);
    }

    noBtn.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (trapReady) {
        celebrate();
      } else {
        moveNoButton(event);
      }
    });

    window.addEventListener("resize", () => {
      if (locked || !noBtn.classList.contains("running")) return;
      if (trapReady) { placeNoTrap(); return; }
      const rect = noBtn.getBoundingClientRect();
      noBtn.style.left = `${Math.max(14, Math.min(rect.left, innerWidth - rect.width - 14))}px`;
      noBtn.style.top = `${Math.max(14, Math.min(rect.top, innerHeight - rect.height - 14))}px`;
    });

    noBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (trapReady) {
        celebrate();
      } else if (Date.now() - lastEscapeAt >= escapeCooldown) {
        moveNoButton(event);
      }
    });

    yesBtn.addEventListener("click", celebrate);

    updateCountdown();
    setInterval(updateCountdown, 1000);

    setInterval(() => {
      if (!locked) {
        speech.textContent = speechLines[Math.floor(random(0, speechLines.length))];
      }
    }, 4200);
  