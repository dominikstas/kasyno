// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const warningPopup = document.getElementById("warning-popup")
  const acceptWarningButton = document.getElementById("accept-warning")
  const leaveButton = document.getElementById("leave-site")
  const balanceElement = document.getElementById("balance-amount")
  const jackpotElement = document.getElementById("jackpot-amount")
  const betAmountInput = document.getElementById("bet-amount")
  const spinButton = document.getElementById("spin-button")
  const resultText = document.getElementById("result")
  const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")]
  const adContainer = document.getElementById("ad-container")
  const adImage = document.getElementById("ad-image")
  const closeAdButton = document.getElementById("close-ad-button")
  const watchAdButton = document.getElementById("watch-ad-button")
  const adTimer = document.getElementById("ad-timer")

  let balance = 10000
  let jackpot = 50000

  const emojis = ["🍎", "🍋", "🍒", "🍇", "🍊", "🔔", "💎", "7️⃣"]
  const weights = [30, 25, 20, 15, 10, 5, 3, 1]

  function showWarningPopup() {
    warningPopup.style.display = "flex"
  }

  function hideWarningPopup() {
    warningPopup.style.display = "none"
  }

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
    return emojis[0]
  }

  function showAd() {
    const adNumber = Math.floor(Math.random() * 3) + 1
    adImage.src = `ads/ad${adNumber}.jpg`
    adContainer.style.display = "flex"
    closeAdButton.disabled = true

    let timeLeft = 10
    adTimer.textContent = timeLeft

    const timer = setInterval(() => {
      timeLeft--
      adTimer.textContent = timeLeft

      if (timeLeft <= 0) {
        clearInterval(timer)
        closeAdButton.disabled = false
        closeAdButton.textContent = "Odbierz nagrodę!"
        adTimer.style.display = "none"
      }
    }, 1000)
  }

  function closeAd() {
    adContainer.style.display = "none"
    updateBalance(2500)
    adTimer.style.display = "block"
    closeAdButton.textContent = "Poczekaj 10s"
    resultText.textContent = "Otrzymano 2500 zł za obejrzenie reklamy! 🎉"
    resultText.style.color = "#ffd700"
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
      if (balance < 100) {
        if (confirm("Twoje saldo jest niskie. Czy chcesz obejrzeć reklamę, aby otrzymać 2500 zł?")) {
          showAd()
          return
        }
      }
      alert("Nieprawidłowa kwota zakładu!")
      return
    }

    spinButton.disabled = true
    updateBalance(-betAmount)

    const finalEmojis = reels.map(() => getRandomEmoji())

    await Promise.all(reels.map((reel, index) => animateReel(reel, finalEmojis[index])))

    let winAmount = 0
    const jackpotChance = 0.0001

    if (finalEmojis[0] === finalEmojis[1] && finalEmojis[1] === finalEmojis[2]) {
      if (finalEmojis[0] === "7️⃣" && Math.random() < jackpotChance) {
        winAmount = jackpot
        resultText.textContent = "JACKPOT! 🎉🎉🎉"
        document.body.style.animation = "glow 1s infinite"
        setTimeout(() => {
          document.body.style.animation = ""
        }, 5000)
      } else {
        const multiplier = emojis.indexOf(finalEmojis[0]) + 2
        winAmount = betAmount * multiplier
        resultText.textContent = `Wygrana! ${winAmount} zł! 🎉`
      }
    } else if (
      finalEmojis[0] === finalEmojis[1] ||
      finalEmojis[1] === finalEmojis[2] ||
      finalEmojis[0] === finalEmojis[2]
    ) {
      winAmount = Math.floor(betAmount * 1.5)
      resultText.textContent = `Mała wygrana! ${winAmount} zł! 😃`
    } else {
      if (Math.random() < 0.1) {
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

    jackpot += Math.floor(betAmount * 0.1)
    updateJackpot()

    spinButton.disabled = false
  }

  // Event Listeners
  acceptWarningButton.addEventListener("click", hideWarningPopup)
  leaveButton.addEventListener("click", () => {
    window.close()
    if (!window.closed) {
      window.location.href = "about:blank"
    }
  })
  spinButton.addEventListener("click", spin)
  closeAdButton.addEventListener("click", closeAd)
  watchAdButton.addEventListener("click", showAd)

  // Initialize
  showWarningPopup()
  updateJackpot()

  // Mobile height adjustment
  function adjustHeight() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  window.addEventListener("resize", adjustHeight)
  adjustHeight()
})

