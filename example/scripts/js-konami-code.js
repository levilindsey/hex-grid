'use strict';

(function() {
    window.jsKonamiCode = {};

    // TODO: You should assign your own callback here.
    window.jsKonamiCode.callback = defaultCallback;

    window.jsKonamiCode.keyDelayThresholdMs = 700;

    window.jsKonamiCode.konamiCodeSequence = [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'KeyB',
        'KeyA',
    ];

    const KEY_CODE_CONFIGURATIONS = {
        'ArrowUp': {
            code: 'ArrowUp',
            key: 'ArrowUp',
        },
        'ArrowDown': {
            code: 'ArrowDown',
            key: 'ArrowDown',
        },
        'ArrowLeft': {
            code: 'ArrowLeft',
            key: 'ArrowLeft',
        },
        'ArrowRight': {
            code: 'ArrowRight',
            key: 'ArrowRight',
        },
        'KeyW': {
            code: 'KeyW',
            key: 'w',
        },
        'KeyS': {
            code: 'KeyS',
            key: 's',
        },
        'KeyA': {
            code: 'KeyA',
            key: 'a',
        },
        'KeyD': {
            code: 'KeyD',
            key: 'd',
        },
        'KeyB': {
            code: 'KeyB',
            key: 'b',
        },
    };

    let latestKeyPressTime = -window.jsKonamiCode.keyDelayThresholdMs;

    let currentCodeSequence = [];
    let currentKeySequence = [];

    function setUp() {
        document.addEventListener('keydown', onKeyDown, false);
    }

    function onKeyDown(event) {
        // Update the time.
        const previousKeyPressTime = latestKeyPressTime;
        latestKeyPressTime = Date.now();

        // Clear stale key sequences.
        if (latestKeyPressTime >= previousKeyPressTime + window.jsKonamiCode.keyDelayThresholdMs) {
            currentCodeSequence = [];
            currentKeySequence = [];
        }

        // Record the current key.
        currentCodeSequence.push(event.code);
        currentKeySequence.push(event.key);

        if (checkForMatch()) {
            window.jsKonamiCode.callback();
        }
    }

    function checkForMatch() {
        const expectedSequence = window.jsKonamiCode.konamiCodeSequence;

        if (currentCodeSequence.length < expectedSequence) {
            return false;
        }

        let foundMatch = true;
        for (let i = 0; i < expectedSequence.length; i++) {
            if (currentCodeSequence[currentCodeSequence.length - 1 - i] !==
                expectedSequence[expectedSequence.length - 1 - i]) {
                foundMatch = false;
                break;
            }
        }

        if (foundMatch) {
            return true;
        }

        foundMatch = true;
        for (let i = 0; i < expectedSequence.length; i++) {
            if (currentKeySequence[currentKeySequence.length - 1 - i].toLowerCase() !==
                KEY_CODE_CONFIGURATIONS[expectedSequence[expectedSequence.length - 1 - i]].key
                    .toLowerCase()) {
                foundMatch = false;
                break;
            }
        }

        return foundMatch;
    }

    function defaultCallback() {
        console.log("");
        console.log("REST 30");
        console.log("");

        const audio = document.querySelector('#konami-code-confirmation-sound');
        audio.volume = 0.08;
        audio.play();
    }

    window.addEventListener('load', setUp, false);
})();