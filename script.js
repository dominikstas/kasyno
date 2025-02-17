const warningPopup = document.getElementById("warning-popup")
const acceptWarningButton = document.getElementById("accept-warning")

function showWarningPopup() {
  warningPopup.style.display = "flex"
}

function hideWarningPopup() {
  warningPopup.style.display = "none"
}

acceptWarningButton.addEventListener("click", hideWarningPopup)

// Pokaż popup przy załadowaniu strony
window.addEventListener("load", showWarningPopup)

let balance = 10000
let jackpot = 50000
const balanceElement = document.getElementById("balance-amount")
const jackpotElement = document.getElementById("jackpot-amount")
const betAmountInput = document.getElementById("bet-amount")
const spinButton = document.getElementById("spin-button")
const resultText = document.getElementById("result")
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")]

const emojis = ["🍎", "🍋", "🍒", "🍇", "🍊", "🔔", "💎", "7️⃣"]
const weights = [13, 10, 8, 5, 4, 3, 2, 1] // Wagi dla każdego emoji

function updateBalance(amount) {
  balance += amount
  balanceElement.textContent = balance
  balanceElement.style.animation = "pulse 0.5s"
  setTimeout(() => {
    balanceElement.style.animation = ""
  }, 500)
}

function updateJackpot() {
  jackpot += Math.floor(Math.random() * 100) + 50
  jackpotElement.textContent = jackpot + " zł"
}

function getRandomEmoji() {
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  for (let i = 0; i < emojis.length; i++) {
    if (random < weights[i]) {
      return emojis[i]
    }
    random -= weights[i]
  }
  return emojis[0] // Domyślnie zwróć pierwszy emoji
}

function animateReel(reel, finalEmoji) {
  return new Promise((resolve) => {
    let spins = 0
    const maxSpins = 20 + Math.floor(Math.random() * 10)
    const interval = setInterval(() => {
      reel.textContent = getRandomEmoji()
      reel.style.animation = "spin 0.2s linear"
      spins++
      if (spins >= maxSpins) {
        clearInterval(interval)
        reel.textContent = finalEmoji
        reel.style.animation = ""
        resolve()
      }
    }, 100)
  })
}

async function spin() {
  const betAmount = Number.parseInt(betAmountInput.value)

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
    alert("Nieprawidłowa kwota zakładu!")
    return
  }

  spinButton.disabled = true
  updateBalance(-betAmount)

  const finalEmojis = reels.map(() => getRandomEmoji())

  await Promise.all(reels.map((reel, index) => animateReel(reel, finalEmojis[index])))

  let winAmount = 0
  const jackpotChance = 0.0001 // 0.01% szansa na jackpot

  if (finalEmojis[0] === finalEmojis[1] && finalEmojis[1] === finalEmojis[2]) {
    if (finalEmojis[0] === "7️⃣" && Math.random() < jackpotChance) {
      winAmount = jackpot
      resultText.textContent = "JACKPOT! 🎉🎉🎉"
      document.body.style.animation = "glow 1s infinite"
      setTimeout(() => {
        document.body.style.animation = ""
      }, 5000)
    } else {
      const multiplier = emojis.indexOf(finalEmojis[0]) + 2 // Im rzadszy symbol, tym większy mnożnik
      winAmount = betAmount * multiplier
      resultText.textContent = `Wygrana! ${winAmount} zł! 🎉`
    }
  } else if (
    finalEmojis[0] === finalEmojis[1] ||
    finalEmojis[1] === finalEmojis[2] ||
    finalEmojis[0] === finalEmojis[2]
  ) {
    winAmount = Math.floor(betAmount * 1.5) // Zmniejszona wygrana za dwa takie same symbole
    resultText.textContent = `Mała wygrana! ${winAmount} zł! 😃`
  } else {
    // Dodajemy małą szansę na minimalną wygraną, nawet jeśli symbole się nie zgadzają
    if (Math.random() < 0.1) {
      // 10% szans na minimalną wygraną
      winAmount = Math.floor(betAmount * 0.5)
      resultText.textContent = `Mała wygrana! ${winAmount} zł! 😊`
    } else {
      resultText.textContent = `Spróbuj ponownie! 😉`
    }
  }

  if (winAmount > 0) {
    updateBalance(winAmount)
    resultText.style.color = "#ffd700"
  } else {
    resultText.style.color = "#ff4500"
  }

  // Zwiększamy jackpot o procent przegranej kwoty
  jackpot += Math.floor(betAmount * 0.1)
  updateJackpot()

  spinButton.disabled = false
}

spinButton.addEventListener("click", spin)

// Inicjalizacja jackpota
updateJackpot()

// Obsługa dotykowa dla urządzeń mobilnych
spinButton.addEventListener("touchstart", (e) => {
  e.preventDefault() // Zapobiega podwójnemu kliknięciu na urządzeniach dotykowych
  spin()
})

// Dostosowanie wysokości kontenera na urządzeniach mobilnych
function adjustHeight() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty("--vh", `${vh}px`)
}

window.addEventListener("resize", adjustHeight)
adjustHeight() // Wywołaj funkcję na starcie

const leaveButton = document.getElementById("leave-site")
leaveButton.addEventListener("click", () => {
  window.close()
  // If window.close() doesn't work (e.g., in some browsers), redirect to a blank page
  if (!window.closed) {
    window.location.href = "about:blank"
  }
})

