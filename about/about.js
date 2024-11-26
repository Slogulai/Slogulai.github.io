document.addEventListener("DomContentLoaded", function() {
    const imageContainer = document.getElementById('image-container');
    const imageUrls = [
        '../assets/4runner-fortstevens.jpeg',
        '../assets/andresgrace-day.jpeg',
        '../assets/brokenoar-waldolake.jpeg',
        '../assets/chris-boat-pirate.jpeg',
        '../assets/chris-charlenabrie.jpeg',
        '../assets/chris-peteriredale.jpeg',
    ];

    imageUrls.forEach(url => {

        const img = document.CreateElement('img');
        img.src = url;
        const fileName = url.split('/').pop().split('.')[0];
        img.alt = fileName;
        img.className = fileName;
        imageContainer.appendChild(img);
    });
});