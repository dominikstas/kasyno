let balance = 10000
const balanceElement = document.getElementById("balance-amount")
const betAmountInput = document.getElementById("bet-amount")
const betColorSelect = document.getElementById("bet-color")
const spinButton = document.getElementById("spin-button")
const wheel = document.getElementById("roulette-wheel")
const ball = document.getElementById("ball")
const resultText = document.getElementById("result")

function updateBalance(amount) {
  balance += amount
  balanceElement.textContent = balance
}

function getRandomNumber() {
  return Math.floor(Math.random() * 37)
}

function getColorFromNumber(number) {
  if (number === 0) return "green"
  return number % 2 === 0 ? "black" : "red"
}

function spin() {
  const betAmount = Number.parseInt(betAmountInput.value)
  const betColor = betColorSelect.value

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
    alert("Nieprawidłowa kwota zakładu!")
    return
  }

  spinButton.disabled = true
  updateBalance(-betAmount)

  const randomNum = getRandomNumber()
  const resultColor = getColorFromNumber(randomNum)
  const rotation = 1440 + randomNum * 9.73

  wheel.style.transform = `rotate(${rotation}deg)`
  ball.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`

  setTimeout(() => {
    if (betColor === resultColor) {
      const winAmount = betColor === "green" ? betAmount * 35 : betAmount * 2
      updateBalance(winAmount)
      resultText.textContent = `Wygrałeś ${winAmount} zł! Wypadło: ${randomNum} (${resultColor})`
    } else {
      resultText.textContent = `Przegrałeś ${betAmount} zł. Wypadło: ${randomNum} (${resultColor})`
    }

    spinButton.disabled = false
  }, 5000)
}

spinButton.addEventListener("click", spin)

