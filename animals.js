  const birdTemplates = {
        bat: {
          type: 'night',
          html: `
            <div class="bat-body"></div>
            <div class="bat-wing left"></div>
            <div class="bat-wing right"></div>
          `
        },
        crow: {
          type: 'day',
          html: `
            <div class="crow-body"></div>
            <div class="crow-head"></div>
            <div class="crow-beak"></div>
            <div class="crow-wing left"></div>
            <div class="crow-wing right"></div>
          `
        },
        pigeon: {
          type: 'day',
          html: `
            <div class="pigeon-body"></div>
            <div class="pigeon-head"></div>
            <div class="pigeon-beak"></div>
            <div class="pigeon-wing left"></div>
            <div class="pigeon-wing right"></div>
          `
        },
        seagull: {
          type: 'day',
          html: `
            <div class="seagull-body"></div>
            <div class="seagull-head"></div>
            <div class="seagull-beak"></div>
            <div class="seagull-wing left"></div>
            <div class="seagull-wing right"></div>
          `
        },
        eagle: {
          type: 'day',
          html: `
            <div class="eagle-body"></div>
            <div class="eagle-head"></div>
            <div class="eagle-beak"></div>
            <div class="eagle-wing left"></div>
            <div class="eagle-wing right"></div>
          `
        }
      };

      const config = {
        day: {
          birds: ['crow', 'pigeon', 'seagull', 'eagle'],
          spawnInterval: { min: 2000, max: 8000 }, // 2-8 seconds
          maxBirds: 3
        },
        night: {
          birds: ['bat'],
          spawnInterval: { min: 3000, max: 10000 }, // 3-10 seconds  
          maxBirds: 2
        }
      };

      let activeBirds = [];
      let currentMode = 'day';
      let spawnTimer;

      function checkMode() {
        const isNight = window.innerWidth <= 1000;
        const newMode = isNight ? 'night' : 'day';
        
        if (newMode !== currentMode) {
          currentMode = newMode;
          clearAllBirds();
          clearTimeout(spawnTimer);
          startSpawning();
        }
      }

      function createBird(birdType) {
        const bird = document.createElement('div');
        bird.className = birdType;
        bird.innerHTML = birdTemplates[birdType].html;
        
        const randomHeight = Math.random() * 30 + 10;
        bird.style.top = randomHeight + '%';
        
        const randomDelay = Math.random() * 2;
        bird.style.animationDelay = `-${randomDelay}s`;
        
        document.body.appendChild(bird);
        activeBirds.push(bird);
        
        const animationDuration = getAnimationDuration(birdType);
        setTimeout(() => {
          removeBird(bird);
        }, (animationDuration + randomDelay) * 1000);
      }

      function getAnimationDuration(birdType) {
        const durations = {
          bat: 12,
          crow: 15, 
          pigeon: 18,
          seagull: 20,
          eagle: 25
        };
        return durations[birdType] || 15;
      }

      function removeBird(bird) {
        if (bird && bird.parentNode) {
          bird.parentNode.removeChild(bird);
        }
        activeBirds = activeBirds.filter(b => b !== bird);
      }

      function clearAllBirds() {
        activeBirds.forEach(bird => {
          if (bird && bird.parentNode) {
            bird.parentNode.removeChild(bird);
          }
        });
        activeBirds = [];
      }

      function spawnBird() {
        const modeConfig = config[currentMode];
        
        if (activeBirds.length >= modeConfig.maxBirds) {
          scheduleNextSpawn();
          return;
        }
        
        const availableBirds = modeConfig.birds;
        const randomBird = availableBirds[Math.floor(Math.random() * availableBirds.length)];
        
        createBird(randomBird);
        scheduleNextSpawn();
      }

      function scheduleNextSpawn() {
        const modeConfig = config[currentMode];
        const minInterval = modeConfig.spawnInterval.min;
        const maxInterval = modeConfig.spawnInterval.max;
        const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
        
        spawnTimer = setTimeout(spawnBird, randomInterval);
      }

      function startSpawning() {
        setTimeout(spawnBird, 1000);
      }

      function init() {
        checkMode();
        startSpawning();
        
        window.addEventListener('resize', checkMode);
      }

      window.addEventListener('load', init);