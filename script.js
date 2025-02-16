document.getElementById("spin-button").addEventListener("click", function() {
    let wheel = document.getElementById("roulette-wheel");
    let resultText = document.getElementById("result");

    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";

    setTimeout(() => {
        let randomNum = Math.floor(Math.random() * 37);
        let rotation = 1440 + (randomNum * 9.73); // Symulacja losowego zatrzymania
        wheel.style.transition = "transform 2.5s ease-out";
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            resultText.textContent = `Wypadła liczba: ${randomNum}`;
        }, 2500);
    }, 100);
});
