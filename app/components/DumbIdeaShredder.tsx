import React, { useState, useRef, useEffect } from 'react';

const FlipDigit = ({ digit, flipping, isChangingDigit = false, initialLoad = false, startDigit = '0' }) => {
  const [displayedDigit, setDisplayedDigit] = useState(initialLoad ? startDigit : digit);
  
  // Update the displayed digit when the actual digit changes
  useEffect(() => {
    if (!initialLoad) {
      setDisplayedDigit(digit);
    }
  }, [digit, initialLoad]);
  
  // For initial load, we want to animate from 0 to the final digit
  useEffect(() => {
    if (initialLoad) {
      const timer = setTimeout(() => {
        setDisplayedDigit(digit);
      }, 5000); // Show final digit after animation completes
      return () => clearTimeout(timer);
    }
  }, [initialLoad, digit]);
  
  return (
    <div className="relative inline-block w-8 h-12 bg-gray-900 rounded-sm mx-1 overflow-hidden">
      <div className={`absolute inset-0 flex items-center justify-center text-amber-400 font-mono text-xl font-bold 
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
    <div className="flex items-center justify-center">
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
      <div className="mx-2 text-amber-500 font-mono">/</div>
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
  
  // Initial load animation
  useEffect(() => {
    if (initialLoad) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 5000); // Set to 5 seconds to match the animation duration
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
    
    // Start card animation
    setCardPosition({ top: -150, opacity: 1 });
    
    // Animate card into shredder
    setTimeout(() => {
      setCardPosition({ top: 30, opacity: 1 });
    }, 100);
    
    // Start shredding after card enters
    setTimeout(() => {
      // Create shreds from the text
      const shredCount = Math.max(20, idea.length / 2);
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
    }, 1500);
    
    // Reset after animation completes with a new random requirement
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
      setTimeout(() => setInitialLoad(false), 5000);
    }, 6000);
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
    <div className="flex flex-col items-center justify-center p-4 dumb-container">
      <h2 className="text-3xl font-bold mb-6 text-center dumb-text dumb-glow">
        GOT IDEAS TO MAKE THIS SITE EVEN DUMBER???
      </h2>
      
      <div className="w-full max-w-md relative">
        {showInput ? (
          <div className="mb-8">
            <div className="mb-3 flex justify-between items-center">
              <span className="text-xl dumb-text">🌟 SUBMIT YOUR IDEA:</span>
              <div className="flex-shrink-0">
                <FlipCounter 
                  current={idea.length} 
                  total={requiredChars} 
                  flipping={flipAnimating}
                  previousTotal={previousRequired}
                  initialLoad={initialLoad}
                />
              </div>
            </div>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="w-full p-4 border-4 border-dashed border-yellow-400 rounded-lg shadow-lg mb-2 h-32 focus:ring focus:ring-yellow-400 text-black"
              placeholder={`Share your idea here! We need exactly ${requiredChars} characters...`}
              style={{
                fontFamily: "'Comic Sans MS', cursive, sans-serif", 
                fontSize: '16px',
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
              className="dumb-button w-full py-3 px-4"
            >
              ✨ SUBMIT BRILLIANT IDEA! ✨
            </button>
          </div>
        ) : null}
        
        {/* Idea Card (positioned behind shredder) */}
        {cardVisible && (
          <div 
            className="absolute left-0 right-0 mx-auto w-72 bg-white p-4 rounded shadow-md z-0 border-4 border-dashed border-yellow-400"
            style={{
              top: `${cardPosition.top}px`,
              opacity: cardPosition.opacity,
              transition: 'all 1.5s ease-in-out',
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
              fontWeight: 'bold'
            }}
          >
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
          <div className="mt-8 text-center text-3xl dumb-text" style={{overflow: 'hidden'}}>
            <div className="inline-block transform transition-all duration-1000 animate-bounce">
              💥 SURPRISE! YOUR IDEA IS BEING DESTROYED!!! 💥
            </div>
          </div>
        )}
      </div>
      
      {/* Animation explanations - Show only when not shredding */}
      {!isShredding && (
        <div className="mt-6 text-center dumb-text text-lg">
          <p className="mb-2">WE'VE COLLECTED <span className="font-bold dumb-glow">9,482</span> AMAZING SUGGESTIONS!!!</p>
          <p>THE MORE RIDICULOUS YOUR IDEA, THE BETTER!!! 🤪</p>
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