const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WORLD'S DUMBEST DOMAIN!!1!</title>
    <meta name="description" content="THE WORLD\\'S DUMBEST DOMAIN - CLICK THE BUTTON FOR MAX DUMBNESS!!!">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="WORLD\\'S DUMBEST DOMAIN!!1!">
    <meta property="og:description" content="THE WORLD\\'S DUMBEST DOMAIN - CLICK THE BUTTON FOR MAX DUMBNESS!!!">
    <meta property="og:image" content="https://worldsdumbestdomain.com/dumb.png">
    <meta property="og:url" content="https://worldsdumbestdomain.com">
    <meta property="og:type" content="website">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="WORLD\\'S DUMBEST DOMAIN!!1!">
    <meta name="twitter:description" content="THE WORLD\\'S DUMBEST DOMAIN - CLICK THE BUTTON FOR MAX DUMBNESS!!!">
    <meta name="twitter:image" content="https://worldsdumbestdomain.com/dumb.png">
    
    <script defer data-domain="worldsdumbestdomain.com" src="https://analytics.martinamps.com/js/script.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Comic Sans MS', sans-serif;
            background: repeating-linear-gradient(45deg, #ff00ff, #00ffff 10%, #ff00ff 20%);
            overflow-x: hidden; /* Allow vertical scrolling, hide horizontal */
            text-align: center;
            color: yellow;
            text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
            padding-bottom: 80px; /* Extra space for fixed bottom marquee */
            padding-top: 80px; /* Extra space for fixed top marquee */
            min-height: 100vh; /* Ensure full viewport height */
            line-height: 1.4; /* Improved line height for readability */
            letter-spacing: 0.5px; /* Slightly increased letter spacing */
        }

        h1 {
            font-size: min(4rem, 15vw); /* Responsive font size */
            margin-top: 30px;
            margin-bottom: 15px;
            animation: pulse 1s infinite alternate;
            padding: 5px 15px;
            background-color: rgba(0,0,0,0.6); /* Add background for better contrast */
            display: inline-block;
            border-radius: 15px;
            text-shadow: 2px 2px 4px black; /* Stronger text shadow */
            border: 2px solid white; /* Add border for emphasis */
        }

        #big-button {
            background-color: red;
            color: white;
            font-size: min(3rem, 8vw); /* Responsive font size */
            padding: min(20px, 5vw) min(40px, 10vw);
            border: min(10px, 3vw) dashed yellow;
            border-radius: 50px;
            cursor: pointer;
            margin: 0 auto;
            position: relative;
            z-index: 100;
            font-weight: bold;
            animation: shake 0.5s infinite;
            box-shadow: 0 0 30px 10px rgba(255, 255, 0, 0.7);
            max-width: 90%;
            width: max-content;
            display: inline-block;
            word-wrap: break-word;
            -webkit-tap-highlight-color: rgba(0,0,0,0); /* Remove tap highlight on mobile */
        }

        #big-button:hover {
            background-color: green;
            transform: scale(1.1);
        }

        #result {
            font-size: min(8rem, 20vw); /* Responsive font size */
            margin-top: 20px;
            visibility: hidden;
        }

        .marquee {
            position: fixed;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            box-sizing: border-box;
            background: rgba(0,0,0,0.85);
            color: lime;
            padding: min(10px, 3vw);
            font-size: min(2rem, 5vw); /* Smaller font size for better fit */
            font-weight: bold;
            z-index: 1000;
            height: auto;
            text-shadow: 1px 1px 2px black; /* Text shadow for better readability */
            letter-spacing: 0.8px; /* Increased letter spacing */
            border-top: 2px solid lime; /* Border for better visibility */
            border-bottom: 2px solid lime;
        }

        .marquee-top {
            top: 0;
            max-height: 60px;
        }

        .marquee-bottom {
            bottom: 0;
            max-height: 60px;
        }

        .marquee-content {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 15s linear infinite;
        }

        #countdown {
            font-size: min(15rem, 30vw);
            margin-bottom: 2rem;
            position: relative;
            z-index: 2000;
            width: 100%;
            text-align: center;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.8);
            font-weight: bold;
            background: rgba(0,0,0,0.5);
            padding: 20px 0;
            border-radius: 20px;
        }

        #redirect-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 1000;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            padding: 15px;
        }

        #redirect-text {
            font-size: min(3rem, 10vw);
            margin-bottom: 20px;
            animation: rainbowText 1s infinite;
            position: relative;
            z-index: 1000;
            text-align: center;
            width: 100%;
            background: rgba(0,0,0,0.5);
            padding: 15px 0;
            border-radius: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }

        #redirect-link {
            font-size: min(2rem, 8vw);
            color: #00ff00;
            text-decoration: underline;
            margin-bottom: 20px;
            cursor: pointer;
            position: relative;
            z-index: 1000;
            text-align: center;
            width: 100%;
            word-wrap: break-word;
            background: rgba(0,0,0,0.5);
            padding: 15px 0;
            border-radius: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }

        .emoji-rain {
            position: absolute;
            font-size: min(30px, 8vw); /* Responsive font size */
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
            display: none !important;
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
            width: min(150px, 20vw); /* Responsive size */
            height: min(150px, 20vw); /* Responsive size */
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
    <h2 style="font-size: min(1.5rem, 7vw); margin: 10px; background-color: rgba(0,0,0,0.7); padding: 10px; border-radius: 10px; display: inline-block; text-shadow: 1px 1px 2px black; line-height: 1.3;">👇👇👇 CLICK THIS AMAZING BUTTON 👇👇👇</h2>

    <div style="margin: 30px auto 100px auto; max-width: 90%;">
        <button id="big-button">CLICK THIS DUMB BUTTON!!!</button>
    </div>

    <div id="result">??</div>
    
    <!-- Footer with poop emoji -->
    <div style="margin: 40px auto 80px auto; text-align: center;">
        <a 
            href="https://x.com/martinamps" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="
                display: inline-flex;
                align-items: center;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                transition: color 0.2s;
                font-size: min(1rem, 5vw);
                background-color: rgba(0, 0, 0, 0.3);
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                text-shadow: 1px 1px 2px black;
            "
            onmouseover="this.style.color='rgba(255, 255, 255, 1)'"
            onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'"
        >
            Built with <span style="margin: 0 5px; font-size: 1.2em;">💩</span> by @martinamps
        </a>
    </div>

    <div class="marquee marquee-bottom">
        <div class="marquee-content">
            💯💯💯 THIS WEBSITE WON 87 DESIGN AWARDS!!! CREATED BY A CERTIFIED DUMMY!!! 100% SATISFACTION GUARANTEED OR YOUR MONEY BACK!!! 💯💯💯
        </div>
    </div>

    <div id="redirect-overlay">
        <div id="countdown">10</div>
        <div id="redirect-text">... DOING SOMETHING DUMB !!!</div>
        <div id="redirect-link">Redirecting to https://www.worldsdumbestapp.com/</div>
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
            img.style.fontSize = 'min(100px, 15vw)'; // Responsive font size
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
            // Remove problematic audio
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
                button.style.fontSize = "min(4rem, 12vw)"; // Responsive font size
                button.style.animation = "pulse 0.5s infinite alternate, shake 0.3s infinite";
            } else if (clickCount === 2) {
                // Second click - trigger countdown and redirect
                redirectOverlay.style.display = 'flex';

                // Start 10 second countdown
                let timeLeft = 10;
                countdown.style.visibility = 'visible';
                countdown.textContent = timeLeft;

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

        // Make button run away sometimes (mobile friendly version)
        button.addEventListener('mouseover', (e) => {
            if (Math.random() > 0.7) {
                // Calculate safe area to prevent button going off-screen
                const maxX = Math.max(50, window.innerWidth - button.offsetWidth - 30);
                const maxY = Math.max(100, window.innerHeight - button.offsetHeight - 80);
                
                // Ensure button stays within view (at least 50px from edges)
                const safeX = Math.min(Math.max(30, Math.random() * maxX), maxX);
                const safeY = Math.min(Math.max(100, Math.random() * maxY), maxY);
                
                // Set to fixed position to keep visible during scroll
                button.style.position = 'fixed';
                button.style.left = \`\${safeX}px\`;
                button.style.top = \`\${safeY}px\`;
                
                // Reset position after a delay to ensure it doesn't get stuck
                setTimeout(() => {
                    if (clickCount < 2) { // Only reset if we haven't started redirect countdown
                        button.style.position = 'relative';
                        button.style.left = 'auto';
                        button.style.top = 'auto';
                    }
                }, 3000);
            }
        });
        
        // Also add touch event for mobile users
        button.addEventListener('touchstart', (e) => {
            // 30% chance of button running away on touch
            if (Math.random() > 0.7) {
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                
                // Make sure button stays within 80% of the viewport
                const safeX = Math.min(Math.max(20, Math.random() * (viewportWidth * 0.8)), viewportWidth * 0.8);
                const safeY = Math.min(Math.max(100, Math.random() * (viewportHeight * 0.7)), viewportHeight * 0.7);
                
                button.style.position = 'fixed';
                button.style.left = \`\${safeX}px\`;
                button.style.top = \`\${safeY}px\`;
                
                // Reset after a short delay
                setTimeout(() => {
                    if (clickCount < 2) {
                        button.style.position = 'relative';
                        button.style.left = 'auto';
                        button.style.top = 'auto';
                    }
                }, 2500);
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
