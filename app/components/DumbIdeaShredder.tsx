import React, { useState, useRef, useEffect } from 'react';

const FlipDigit = ({ digit, flipping, isChangingDigit = false, initialLoad = false, startDigit = '0' }) => {
  // Initialize with the actual digit right away, not blank
  const [displayedDigit, setDisplayedDigit] = useState(digit || startDigit);
  
  // Update the displayed digit when the actual digit changes
  useEffect(() => {
    if (!initialLoad) {
      setDisplayedDigit(digit);
    }
  }, [digit, initialLoad]);
  
  // For initial load, we want to animate from 0 to the final digit
  useEffect(() => {
    if (initialLoad) {
      // Start with the current digit already showing
      setDisplayedDigit(digit);
      
      // If we need animation later, uncomment this:
      // const timer = setTimeout(() => {
      //   setDisplayedDigit(digit);
      // }, 5000); 
      // return () => clearTimeout(timer);
    }
  }, [initialLoad, digit]);
  
  return (
    <div className="relative inline-block w-6 sm:w-8 h-10 sm:h-12 bg-gray-900 rounded-sm mx-0.5 sm:mx-1 overflow-hidden">
      <div className={`absolute inset-0 flex items-center justify-center text-amber-400 font-mono text-lg sm:text-xl font-bold 
        ${initialLoad ? 'animate-slow-countup' : ''}
        ${flipping ? (isChangingDigit ? 'animate-dramatic-flip' : 'animate-spin-up') : ''}
      `}>
        {displayedDigit}
      </div>
      {/* Horizontal line in middle to simulate split flap */}
      <div className="absolute w-full h-px bg-gray-700 top-1/2 transform -translate-y-1/2"></div>
      {/* Vertical screws on sides */}
      <div className="absolute left-1 top-1 w-1 h-1 bg-gray-600 rounded-full"></div>
      <div className="absolute right-1 top-1 w-1 h-1 bg-gray-600 rounded-full"></div>
      <div className="absolute left-1 bottom-1 w-1 h-1 bg-gray-600 rounded-full"></div>
      <div className="absolute right-1 bottom-1 w-1 h-1 bg-gray-600 rounded-full"></div>
    </div>
  );
};

const FlipCounter = ({ current, total, flipping, previousTotal, initialLoad = false }) => {
  // Convert numbers to padded strings
  const currentStr = String(current).padStart(3, '0');
  const totalStr = String(total).padStart(3, '0');
  const prevTotalStr = String(previousTotal || total).padStart(3, '0');
  
  // For initial load, we want to start from 000
  const startingStr = '000';
  
  // Determine which digits are changing
  const isDigitChanging = (index) => {
    return prevTotalStr[index] !== totalStr[index];
  };
  
  return (
    <div className="flex items-center justify-center scale-90 sm:scale-100 transform-gpu">
      <FlipDigit 
        digit={currentStr[0]} 
        flipping={flipping} 
        isChangingDigit={false} 
        initialLoad={initialLoad}
        startDigit={startingStr[0]} 
      />
      <FlipDigit 
        digit={currentStr[1]} 
        flipping={flipping} 
        isChangingDigit={false} 
        initialLoad={initialLoad}
        startDigit={startingStr[1]} 
      />
      <FlipDigit 
        digit={currentStr[2]} 
        flipping={flipping} 
        isChangingDigit={false} 
        initialLoad={initialLoad}
        startDigit={startingStr[2]} 
      />
      <div className="mx-1 sm:mx-2 text-amber-500 font-mono">/</div>
      <FlipDigit 
        digit={totalStr[0]} 
        flipping={isDigitChanging(0) && flipping} 
        isChangingDigit={isDigitChanging(0)} 
        initialLoad={initialLoad}
        startDigit={startingStr[0]} 
      />
      <FlipDigit 
        digit={totalStr[1]} 
        flipping={isDigitChanging(1) && flipping} 
        isChangingDigit={isDigitChanging(1)} 
        initialLoad={initialLoad}
        startDigit={startingStr[1]} 
      />
      <FlipDigit 
        digit={totalStr[2]} 
        flipping={isDigitChanging(2) && flipping} 
        isChangingDigit={isDigitChanging(2)} 
        initialLoad={initialLoad}
        startDigit={startingStr[2]} 
      />
    </div>
  );
};

const DumbIdeaShredder = () => {
  // Generate random initial requirement between 53 and 177
  const getRandomRequirement = () => Math.floor(Math.random() * (177 - 53 + 1)) + 53;
  
  const [idea, setIdea] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const [shreds, setShreds] = useState([]);
  const [showInput, setShowInput] = useState(true);
  const [cardPosition, setCardPosition] = useState({ top: 0, opacity: 0 });
  const [cardVisible, setCardVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requiredChars, setRequiredChars] = useState(getRandomRequirement());
  const [previousRequired, setPreviousRequired] = useState(requiredChars);
  const [flipAnimating, setFlipAnimating] = useState(false);
  const [showRequirementChange, setShowRequirementChange] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const shredderRef = useRef(null);
  
  // Set initialLoad to false immediately to show digits right away
  useEffect(() => {
    // We don't want the slow animation, so make it quick
    if (initialLoad) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 500); // Much quicker animation
    }
  }, []);
  
  // Only trigger animations when requirement changes, not on every character typed
  useEffect(() => {
    // This will only trigger when requiredChars changes, not on every character typed
    if (previousRequired !== requiredChars) {
      setFlipAnimating(true);
      const timer = setTimeout(() => {
        setFlipAnimating(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [requiredChars, previousRequired]);
  
  const handleSubmit = () => {
    // Special handling for when requirement is the initial random number
    if (requiredChars === previousRequired) {
      // They hit exactly the initial requirement
      if (idea.length === requiredChars) {
        // Don't shred yet, just update requirement
        setPreviousRequired(requiredChars);
        setRequiredChars(requiredChars + 1);
        setFlipAnimating(true);
        setTimeout(() => setFlipAnimating(false), 1500);
        return;
      } else {
        // They didn't hit the exact requirement - friendly at first
        setErrorMessage(`Sorry, your idea needs to be exactly ${requiredChars} characters (currently ${idea.length}). Our idea submission system is very particular!`);
        return;
      }
    }
    
    // At this point, requirement must be the incremented value
    
    // Check if they met the incremented character requirement  
    if (idea.length !== requiredChars) {
      // After the first try, be more aggressive with the error message
      setErrorMessage(`NOPE! EXACTLY ${requiredChars} CHARACTERS OR IT DOESN'T COUNT! (currently ${idea.length}) MUAHAHAHA!!!`);
      return;
    }
    
    // Now we can actually shred (only happens when req=random+1 and input=random+1)
    setErrorMessage('');
    setIsShredding(true);
    setShowInput(false);
    setCardVisible(true);
    
    // Start card animation - now from higher up for more dramatic effect
    setCardPosition({ top: -180, opacity: 1 });
    
    // Animate card into view first - hover above shredder longer
    setTimeout(() => {
      setCardPosition({ top: -40, opacity: 1 });
    }, 300);
    
    // Hold the card in view for user to read
    setTimeout(() => {
      // Add a slight bounce effect before shredding
      setCardPosition({ top: -30, opacity: 1 });
    }, 1500);
    
    // Move card toward shredder after a longer delay
    setTimeout(() => {
      setCardPosition({ top: 0, opacity: 1 });
    }, 3000);
    
    // Start shredding after card enters - with increased delay
    setTimeout(() => {
      // Create shreds from the text
      const shredCount = Math.max(25, idea.length / 2); // More shreds for better effect
      const newShreds = [];
      
      for (let i = 0; i < shredCount; i++) {
        // Text content for each shred - random fragments of the idea
        const startPos = Math.floor(Math.random() * idea.length);
        const length = Math.min(Math.floor(Math.random() * 8) + 1, idea.length - startPos);
        const textFragment = idea.substring(startPos, startPos + length);
        
        newShreds.push({
          id: i,
          text: textFragment,
          x: 50, // start at middle of shredder
          y: 110, // start at the middle of the shredder
          rotation: Math.random() * 30 - 15,
          speed: Math.random() * 2 + 3,
          width: Math.random() * 30 + 10,
          opacity: 1
        });
      }
      
      setShreds(newShreds);
      setCardPosition({ top: 120, opacity: 0 }); // Card disappears into shredder
    }, 4500);
    
    // Reset after animation completes with a new random requirement
    // Increased from 6000 to 9000 to account for the longer card animation
    setTimeout(() => {
      const newRequirement = getRandomRequirement();
      setIdea('');
      setIsShredding(false);
      setShowInput(true);
      setShreds([]);
      setCardVisible(false);
      setPreviousRequired(newRequirement);
      setRequiredChars(newRequirement);
      setInitialLoad(true); // Reset to show the countup animation for the new requirement
      setTimeout(() => setInitialLoad(false), 1000); // Faster initialization
    }, 9000);
  };
  
  useEffect(() => {
    if (!isShredding || shreds.length === 0) return;
    
    let animationId;
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      
      // Only update every few frames for performance
      if (frameCount % 2 === 0) {
        setShreds(prevShreds => 
          prevShreds.map(shred => {
            // Different phases of animation
            if (shred.y < 100) {
              // First phase: falling into shredder
              return {
                ...shred,
                y: shred.y + shred.speed,
                rotation: shred.rotation + (Math.random() * 2 - 1)
              };
            } else if (shred.y < 300) {
              // Second phase: coming out as shreds
              return {
                ...shred,
                y: shred.y + shred.speed * 1.5,
                x: shred.x + (Math.random() * 10 - 5),
                rotation: shred.rotation + (Math.random() * 10 - 5),
                opacity: Math.max(0, shred.opacity - 0.01)
              };
            } else {
              // Final phase: fading out at bottom
              return {
                ...shred,
                y: shred.y + shred.speed,
                opacity: Math.max(0, shred.opacity - 0.05)
              };
            }
          })
        );
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isShredding, shreds.length]);
  
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 dumb-container" style={{
      borderWidth: "6px",
      borderColor: "#ff00ff",
      marginTop: "40px",
      marginBottom: "20px", /* Add margin at bottom for spacing */
      boxShadow: "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.92)",
      paddingTop: "clamp(24px, 8vw, 32px)", /* Additional top padding to prevent content being cut off on mobile */
    }}>
      <h2 className="text-3xl font-bold mb-6 text-center dumb-text dumb-glow" style={{
        fontSize: "clamp(1.5rem, 5vw, 2rem)",
        padding: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        textShadow: "2px 2px 0 black"
      }}>
        📝 IDEA SUBMISSION STATION!!! 📝
      </h2>
      
      <div className="w-full max-w-md relative">
        {showInput ? (
          <div className="mb-8">
            <div className="mb-3 p-2 bg-black bg-opacity-10 rounded-lg border-2 border-dashed border-yellow-400">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <span className="text-xl dumb-text font-bold" style={{ 
                  textShadow: "1px 1px 0 black",
                  letterSpacing: "0.5px",
                  fontSize: "clamp(1.1rem, 4vw, 1.3rem)"
                }}>
                  🌟 YOUR DUMB IDEA HERE:
                </span>
                <div className="flex-shrink-0 ml-0 sm:ml-2">
                  <FlipCounter 
                    current={idea.length} 
                    total={requiredChars} 
                    flipping={flipAnimating}
                    previousTotal={previousRequired}
                    initialLoad={initialLoad}
                  />
                </div>
              </div>
              <p className="text-sm dumb-text mt-1 mb-2" style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "bold",
                textShadow: "1px 1px 0 black",
                fontSize: "clamp(0.8rem, 3vw, 0.9rem)"
              }}>
                What's the MOST ABSURD feature we should add to this RIDICULOUS website?
              </p>
            </div>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="w-full p-4 border-4 border-dashed border-purple-400 rounded-lg shadow-lg mb-3 h-36 focus:ring focus:ring-purple-400 text-black"
              placeholder={`Type your BRILLIANTLY DUMB idea here! Our sophisticated idea processing system requires EXACTLY ${requiredChars} characters...`}
              style={{
                fontFamily: "'Comic Sans MS', cursive, sans-serif", 
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000000',
                backgroundColor: '#ffffff'
              }}
            />
            {errorMessage && (
              <div className={`text-red-500 text-lg font-bold mb-2 ${requiredChars !== previousRequired ? 'dumb-text' : ''}`}>
                {errorMessage}
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="dumb-button w-full py-4 px-6"
              style={{
                fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
                fontWeight: "bold",
                letterSpacing: "1px",
                background: "linear-gradient(to right, #ff00ff, #00ffff, #ff00ff)",
                backgroundSize: "200% auto",
                animation: "backgroundShift 3s ease infinite, shake 0.5s infinite",
                border: "4px dotted yellow",
                textShadow: "2px 2px 0 black, -1px -1px 0 black"
              }}
            >
              🚀 SUBMIT YOUR GENIUS IDEA!!! 🚀
            </button>
          </div>
        ) : null}
        
        {/* Idea Card (positioned behind shredder) */}
        {cardVisible && (
          <div 
            className="absolute left-0 right-0 mx-auto w-72 bg-white p-4 rounded-lg shadow-lg z-0 border-4 border-dashed border-purple-400"
            style={{
              top: `${cardPosition.top}px`,
              opacity: cardPosition.opacity,
              transition: 'all 2s ease-in-out',
              transformOrigin: 'center bottom',
              textAlign: 'center',
              fontSize: '16px',
              lineHeight: '1.5',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              maxHeight: '200px',
              overflow: 'hidden',
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              color: '#000000',
              backgroundColor: '#ffffff',
              fontWeight: 'bold',
              boxShadow: '0 0 20px rgba(255, 0, 255, 0.5), 0 10px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="text-xs font-bold mb-2 text-center" style={{ color: '#ff00ff' }}>
              AMAZING IDEA SUBMISSION #9,483
            </div>
            <span style={{ color: '#000000' }}>{idea}</span>
          </div>
        )}
        
        {/* Shredder (positioned in front of card) - Only visible when shredding */}
        <div 
          ref={shredderRef}
          className={`relative mx-auto w-80 h-48 ${isShredding ? 'mb-64 opacity-100 scale-100' : 'opacity-0 scale-75'} z-10 dumb-tilt-left transition-all duration-700 ease-in-out shadow-2xl`}
          style={{transformOrigin: 'center top'}}
        >
          {/* Shredder top - nicer gradient and design */}
          <div className="w-full h-20 bg-gradient-to-b from-blue-700 to-blue-900 rounded-t-lg flex items-center justify-center p-2 border-2 border-blue-500 border-b-0">
            <div className="w-full h-full bg-blue-800 rounded-lg flex items-center justify-center relative">
              <div className="w-3/4 h-1 bg-blue-300 rounded-full"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-blue-900 text-xs font-bold">GREAT IDEA VAULT</span>
              </div>
              {/* Indicator lights */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Shredder middle (where paper goes in) - more detail */}
          <div className="w-full h-10 bg-gradient-to-b from-blue-800 to-gray-700 flex items-center justify-center relative border-x-2 border-blue-500">
            <div className="w-3/4 h-2 bg-black rounded-full"></div>
            <div className="absolute top-0 left-0 w-full text-center text-xs text-white font-bold bg-blue-600 py-1">
              GREAT IDEA RECEPTACLE
            </div>
          </div>
          
          {/* Shredder bottom - with details */}
          <div className="w-full h-20 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg border-2 border-blue-500 border-t-0 relative">
            {/* Add some fake buttons and lights */}
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-3 left-3 w-12 h-4 bg-gray-800 rounded"></div>
          </div>
          
          {/* Shred particles */}
          {shreds.map(shred => (
            <div
              key={shred.id}
              className="absolute bg-white shadow-md z-20"
              style={{
                left: `${shred.x}%`,
                top: `${shred.y}px`,
                transform: `rotate(${shred.rotation}deg)`,
                width: `${shred.width}px`,
                height: '4px',
                opacity: shred.opacity,
                transition: 'opacity 0.5s',
                fontSize: '7px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontFamily: "'Comic Sans MS', cursive, sans-serif",
                color: '#000000',
                fontWeight: 'bold',
                backgroundColor: '#ffffff',
                border: '1px solid #dddddd'
              }}
            >
              {shred.text}
            </div>
          ))}
        </div>
        
        {isShredding && (
          <div className="mt-8 text-center text-3xl dumb-text" style={{
            overflow: 'hidden',
            padding: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            maxWidth: "90%",
            margin: "0 auto",
            marginTop: "30px"
          }}>
            <div className="inline-block transform transition-all duration-1000 animate-bounce" style={{
              textShadow: "2px 2px 0 black, -1px -1px 0 black",
              fontWeight: "bold",
              fontSize: "clamp(1.3rem, 5vw, 1.8rem)"
            }}>
              💥 PLOT TWIST! YOUR GENIUS IDEA IS BEING SHREDDED!!! 💥
            </div>
            <div className="text-sm mt-2" style={{
              textShadow: "1px 1px 0 black",
              fontWeight: "bold"
            }}>
              Don't worry, we've already collected over 9,000 ideas... and ignored ALL of them! 😈
            </div>
          </div>
        )}
      </div>
      
      {/* Animation explanations - Show only when not shredding */}
      {!isShredding && (
        <div className="mt-6 text-center dumb-text" style={{
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "90%",
          margin: "0 auto"
        }}>
          <p className="mb-2" style={{
            fontSize: "clamp(1rem, 4vw, 1.2rem)",
            fontWeight: "bold",
            textShadow: "1px 1px 0 black"
          }}>
            We've received <span className="font-bold dumb-glow">9,482</span> AMAZING ideas so far!
          </p>
          <p style={{
            fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
            fontWeight: "bold",
            textShadow: "1px 1px 0 black",
            fontStyle: "italic"
          }}>
            The more ABSURD and RIDICULOUS your suggestion, the better!!! 🤪👍
          </p>
        </div>
      )}
      
      {/* Add a CSS animation for the flipping effect */}
      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        .animate-flip {
          animation: flip 0.5s ease-in-out;
          transform-style: preserve-3d;
        }
        
        @keyframes slow-countup {
          0% { transform: translateY(0); }
          10% { transform: translateY(-100%); }
          20% { transform: translateY(-200%); }
          30% { transform: translateY(-300%); }
          40% { transform: translateY(-400%); }
          50% { transform: translateY(-500%); }
          60% { transform: translateY(-600%); }
          70% { transform: translateY(-700%); }
          80% { transform: translateY(-800%); }
          90% { transform: translateY(-900%); }
          100% { transform: translateY(-1000%); }
        }
        .animate-slow-countup {
          animation: slow-countup 5s steps(10, end);
        }
        
        @keyframes spin-up {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(360deg); }
        }
        .animate-spin-up {
          animation: spin-up 0.3s ease-in-out;
          transform-style: preserve-3d;
        }
        
        @keyframes dramatic-flip {
          0% { transform: rotateX(0deg); }
          20% { transform: rotateX(180deg); }
          40% { transform: rotateX(360deg); }
          60% { transform: rotateX(540deg); }
          80% { transform: rotateX(720deg); }
          100% { transform: rotateX(900deg); }
        }
        .animate-dramatic-flip {
          animation: dramatic-flip 1.5s ease-in-out;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default DumbIdeaShredder;