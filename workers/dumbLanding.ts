const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WORLD\\'S DUMBEST DOMAIN!!1!</title>
    <script defer data-domain="worldsdumbestdomain.com" src="https://analytics.martinamps.com/js/script.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background: repeating-linear-gradient(45deg, #ff00ff, #00ffff 10%, #ff00ff 20%);
            overflow: hidden;
            text-align: center;
            color: yellow;
            text-shadow: 3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000;
        }

        h1 {
            font-size: 4rem;
            margin-top: 50px;
            animation: pulse 1s infinite alternate;
        }

        #big-button {
            background-color: red;
            color: white;
            font-size: 3rem;
            padding: 20px 40px;
            border: 10px dashed yellow;
            border-radius: 50px;
            cursor: pointer;
            margin-top: 50px;
            position: relative;
            z-index: 100;
            font-weight: bold;
            animation: shake 0.5s infinite;
            box-shadow: 0 0 30px 10px rgba(255, 255, 0, 0.7);
        }

        #big-button:hover {
            background-color: green;
            transform: scale(1.2);
        }

        #result {
            font-size: 8rem;
            margin-top: 30px;
            visibility: hidden;
        }

        .marquee {
            position: fixed;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            box-sizing: border-box;
            background: black;
            color: lime;
            padding: 10px;
            font-size: 2rem;
            font-weight: bold;
        }

        .marquee-top {
            top: 0;
        }

        .marquee-bottom {
            bottom: 0;
        }

        .marquee-content {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 15s linear infinite;
        }

        #countdown {
            font-size: 15rem;
            visibility: hidden;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;
        }

        #redirect-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
        }

        #redirect-text {
            font-size: 3rem;
            margin-bottom: 20px;
            animation: rainbowText 1s infinite;
        }

        #redirect-link {
            font-size: 2rem;
            color: #00ff00;
            text-decoration: underline;
            margin-bottom: 20px;
            cursor: pointer;
        }

        .emoji-rain {
            position: absolute;
            font-size: 30px;
            animation: fall linear;
            z-index: 10;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }

        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }

        @keyframes fall {
            to {
                transform: translateY(100vh);
            }
        }

        @keyframes rainbowText {
            0% { color: red; }
            14% { color: orange; }
            28% { color: yellow; }
            42% { color: green; }
            57% { color: blue; }
            71% { color: indigo; }
            85% { color: violet; }
            100% { color: red; }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .cursor {
            position: fixed;
            width: 40px;
            height: 40px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'%3E%3C/path%3E%3Cpath d='M12 5v14'%3E%3C/path%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 10000;
            display: none;
        }

        #bg-images {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            opacity: 0.3;
        }

        .bg-image {
            position: absolute;
            width: 150px;
            height: 150px;
            background-size: contain;
            background-repeat: no-repeat;
            animation: spin 5s linear infinite;
        }
    </style>
</head>
<body>
    <div class="marquee marquee-top">
        <div class="marquee-content">
            🔥🔥🔥 WELCOME TO THE WORLD\\'S DUMBEST DOMAIN!!! IT\\'S SO DUMB IT HURTS!!! CLICK THE BUTTON!!! NOW!!! WHY ARE YOU STILL READING THIS?!?! CLICK ALREADY!!! 🔥🔥🔥
        </div>
    </div>

    <h1>👑 WORLD\\'S DUMBEST DOMAIN!!! 👑</h1>
    <h2>👇👇👇 CLICK THIS AMAZING BUTTON 👇👇👇</h2>

    <button id="big-button">CLICK THIS DUMB BUTTON!!!</button>

    <div id="result">??</div>

    <div class="marquee marquee-bottom">
        <div class="marquee-content">
            💯💯💯 THIS WEBSITE WON 87 DESIGN AWARDS!!! CREATED BY A CERTIFIED DUMMY!!! 100% SATISFACTION GUARANTEED OR YOUR MONEY BACK!!! 💯💯💯
        </div>
    </div>

    <div id="redirect-overlay">
        <div id="redirect-text">... DOING SOMETHING DUMB !!!</div>
        <div id="redirect-link">Redirecting to https://www.worldsdumbestapp.com/</div>
        <div id="countdown">10</div>
    </div>

    <div id="bg-images"></div>

    <div class="cursor"></div>

    <script>
        // Add background spinning images
        const bgImages = document.getElementById('bg-images');
        const emojis = ['🤪', '💩', '🙃', '🤡', '👽', '🤖', '👾', '🤯', '🧠', '👁️'];

        for (let i = 0; i < 20; i++) {
            const img = document.createElement('div');
            img.className = 'bg-image';
            img.style.left = \`\${Math.random() * 100}%\`;
            img.style.top = \`\${Math.random() * 100}%\`;
            img.style.animationDuration = \`\${5 + Math.random() * 10}s\`;
            img.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            img.style.fontSize = '100px';
            bgImages.appendChild(img);
        }

        // Cursor follow
        const cursor = document.querySelector('.cursor');

        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = \`\${e.clientX}px\`;
            cursor.style.top = \`\${e.clientY}px\`;
        });

        // Emoji rain
        function createEmojiRain() {
            setInterval(() => {
                const emoji = document.createElement('div');
                emoji.className = 'emoji-rain';
                emoji.style.left = \`\${Math.random() * 100}%\`;
                emoji.style.top = '-30px';
                emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.animationDuration = \`\${Math.random() * 3 + 2}s\`;
                document.body.appendChild(emoji);

                setTimeout(() => {
                    document.body.removeChild(emoji);
                }, 5000);
            }, 300);
        }

        createEmojiRain();

        // Button functionality
        const button = document.getElementById('big-button');
        const result = document.getElementById('result');
        const redirectOverlay = document.getElementById('redirect-overlay');
        const countdown = document.getElementById('countdown');

        let clickCount = 0;

        button.addEventListener('click', () => {
            // Audio effects
            const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vm//Wk//3Nksoq/////r7////n+////+cw1+hG+X1G///hxtZOXQ+HlA+/j//5jQSGFZkJB5sOqBFYF+aDCbNBk5hVCBuB/wBpAQlGCX7rBj9n7VcDsANxVR2KtDmYTmU6YAMl61/0nZL+D7z6QoRg7i4TGE4R//+pgOHDkmbx2JD1gRPtPkj+oiNaQUc3vABQ06iL81TjYx2LFGc8c9CfVD77hSCQvn7JXhUXGcQTqYEBZPh3RWYK8xFBHGGw80j9tSS1mIrPBP8MwfvSX/uHoRoRoUMaO80pJ8L9D1pYVhLGqANWE6E4RBjg1NeInCWD95nIQxiB0+BapRg+sZkXC//uSRAAAAVlSurbAEkGLGWpIbAYwBIJAD/BoIAESZR1N94DgD5vCfoFnL9P/3YmkA87k6AT5fj2ROJ2F3zrM8kNB9sKwm4xiqcvUwRJGsWSIjsGyD9+J9uzYNSGYYr9nMnUPXFbdW');
            audio.play();

            // Flash screen
            document.body.style.backgroundColor = 'white';
            setTimeout(() => {
                document.body.style.backgroundColor = '';
            }, 100);

            clickCount++;

            if (clickCount === 1) {
                // First click - just change button text and style
                button.textContent = "CLICK IT AGAIN!!!";
                button.style.backgroundColor = "green";
                button.style.fontSize = "4rem";
                button.style.animation = "pulse 0.5s infinite alternate, shake 0.3s infinite";
            } else if (clickCount === 2) {
                // Second click - trigger countdown and redirect
                redirectOverlay.style.display = 'flex';

                // Add click handler for the redirect link
                const redirectLink = document.getElementById('redirect-link');
                redirectLink.addEventListener('click', () => {
                    window.location.href = "https://www.worldsdumbestapp.com/";
                });

                // Start 10 second countdown
                let timeLeft = 10;
                countdown.textContent = timeLeft;
                countdown.style.visibility = 'visible';

                const countdownInterval = setInterval(() => {
                    timeLeft--;
                    countdown.textContent = timeLeft;

                    // Dramatic flashing
                    document.body.style.backgroundColor = \`rgb(\${Math.random() * 255}, \${Math.random() * 255}, \${Math.random() * 255})\`;

                    if (timeLeft <= 0) {
                        clearInterval(countdownInterval);
                        window.location.href = "https://www.worldsdumbestapp.com/";
                    }
                }, 1000);
            }
        });

        // Make button run away sometimes
        button.addEventListener('mouseover', (e) => {
            if (Math.random() > 0.7) {
                const maxX = window.innerWidth - button.offsetWidth;
                const maxY = window.innerHeight - button.offsetHeight;

                button.style.position = 'absolute';
                button.style.left = \`\${Math.random() * maxX}px\`;
                button.style.top = \`\${Math.random() * maxY}px\`;

                // Add bounce sound
                const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
                audio.play();
            }
        });

        // Console message
        console.log('%c WORLD\\'S DUMBEST WEBSITE CONSOLE MESSAGE!!!', 'background: black; color: red; font-size: 24px; font-weight: bold;');
        console.log('%c WHY ARE YOU LOOKING AT THE CONSOLE? CLICK THE BUTTON!!!', 'background: yellow; color: blue; font-size: 18px;');
    </script>
</body>
</html>`;

export function handleDumbLandingRequest(): Response {
  return new Response(htmlContent, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
    },
  });
}
