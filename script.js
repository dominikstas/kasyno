document.getElementById("spin-button").addEventListener("click", function() {
    let wheel = document.getElementById("roulette-wheel");
    let resultText = document.getElementById("result");

    wheel.style.transform = "rotate(0deg)"; // Resetujemy obrót
    wheel.style.transition = "none";

    setTimeout(() => {
        let randomNum = Math.floor(Math.random() * 37); // Losowa liczba 0-36
        let rotation = 1440 + (randomNum * 10); // 4 pełne obroty + losowe przesunięcie
        wheel.style.transition = "transform 3s ease-out";
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            resultText.textContent = `Wypadła liczba: ${randomNum}`;
        }, 3000);
    }, 100);
});
