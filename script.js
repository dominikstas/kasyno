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
  return emojis[Math.floor(Math.random() * emojis.length)]
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
  if (finalEmojis[0] === finalEmojis[1] && finalEmojis[1] === finalEmojis[2]) {
    if (finalEmojis[0] === "7️⃣") {
      winAmount = jackpot
      resultText.textContent = "JACKPOT! 🎉🎉🎉"
      document.body.style.animation = "glow 1s infinite"
      setTimeout(() => {
        document.body.style.animation = ""
      }, 5000)
    } else {
      winAmount = betAmount * 10
      resultText.textContent = `Wielka wygrana! ${winAmount} zł! 🎉`
    }
  } else if (
    finalEmojis[0] === finalEmojis[1] ||
    finalEmojis[1] === finalEmojis[2] ||
    finalEmojis[0] === finalEmojis[2]
  ) {
    winAmount = betAmount * 2
    resultText.textContent = `Wygrana! ${winAmount} zł! 😃`
  } else {
    resultText.textContent = `Spróbuj ponownie! 😉`
  }

  if (winAmount > 0) {
    updateBalance(winAmount)
    resultText.style.color = "#ffd700"
  } else {
    resultText.style.color = "#ff4500"
  }

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

