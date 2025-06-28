const reels = document.querySelectorAll('.reel');
const slotImages = [
    'assets/images/slots/slot1.png',
    'assets/images/slots/slot2.png',
    'assets/images/slots/slot3.png',
    'assets/images/slots/slot4.png',
    'assets/images/slots/slot5.png',
    'assets/images/slots/slot6.png'
];

reels.forEach(reel => {
    slotImages.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Slot image';
        reel.appendChild(img);
    });
});

// Slot Machine functionality

const spinButton = document.querySelector('#spin-button');  
const reel1 = document.querySelector('#reel-1');
const reel2 = document.querySelector('#reel-2');
const reel3 = document.querySelector('#reel-3');

const casino1 = new SlotMachine(reel1, {
    active: 0,
    delay: 500,
    direction: 'up'
});
const casino2 = new SlotMachine(reel2, {
    active: 1,
    delay: 500,
});
const casino3 = new SlotMachine(reel3, {
    active: 2,
    delay: 500,
    direction: 'up'
});

spinButton.addEventListener('click', () => {
    casino1.shuffle(5);
    casino2.shuffle(5);
    casino3.shuffle(5);
});
