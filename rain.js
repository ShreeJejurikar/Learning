class RainSystem {
    constructor() {
        this.isRaining = false;
        this.rainDrops = new Set();
        this.rainId = 0;
        this.rainContainer = null;
        this.lightningContainer = null;
        
        this.settings = {
            dropCount: 100,        // Number of rain drops
            minSpeed: 1,           // Minimum fall speed (seconds)
            maxSpeed: 3,           // Maximum fall speed (seconds) 
            spawnRate: 50,         // Milliseconds between drops
            minHeight: 20,         // Minimum drop height
            maxHeight: 80,         // Maximum drop height
            lightningInterval: 8000 // Lightning flash interval
        };
        
        this.init();
    }
    
    init() {
        this.checkRainMode();
        
        window.addEventListener('resize', () => {
            setTimeout(() => this.checkRainMode(), 100);
        });
    }
    
    checkRainMode() {
        const shouldRain = window.innerWidth <= 1000;
        
        if (shouldRain && !this.isRaining) {
            this.startRain();
        } else if (!shouldRain && this.isRaining) {
            this.stopRain();
        }
    }
    
    createRainContainer() {
        this.rainContainer = document.createElement('div');
        this.rainContainer.className = 'rain-container';
        document.body.appendChild(this.rainContainer);
        
        this.lightningContainer = document.createElement('div');
        this.lightningContainer.className = 'lightning-flash';
        document.body.appendChild(this.lightningContainer);
        
        const splashContainer = document.createElement('div');
        splashContainer.className = 'rain-splash';
        document.body.appendChild(splashContainer);
    }
    
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    createRainDrop() {
        if (!this.rainContainer || this.rainDrops.size >= this.settings.dropCount) {
            return;
        }
        
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.id = `rain-${this.rainId++}`;
        
        const leftPosition = this.random(0, 100);
        const height = this.random(this.settings.minHeight, this.settings.maxHeight);
        const speed = this.random(this.settings.minSpeed, this.settings.maxSpeed);
        const delay = this.random(0, 0.5);
        
        drop.style.left = `${leftPosition}%`;
        drop.style.height = `${height}px`;
        drop.style.animationDuration = `${speed}s`;
        drop.style.animationDelay = `${delay}s`;
        
        this.rainDrops.add(drop.id);
        
        const handleAnimationEnd = () => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
            this.rainDrops.delete(drop.id);
            drop.removeEventListener('animationend', handleAnimationEnd);
        };
        
        drop.addEventListener('animationend', handleAnimationEnd);
        
        this.rainContainer.appendChild(drop);
    }
    
    startRain() {
        if (this.isRaining) return;
        
        this.isRaining = true;
        
        if (!this.rainContainer) {
            this.createRainContainer();
        }
        
        if (window.cloudSystem) {
            window.cloudSystem.setSpawnRate(6000);
        }
        
        this.rainInterval = setInterval(() => {
            if (this.isRaining) {
                this.createRainDrop();
            }
        }, this.settings.spawnRate);
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                if (this.isRaining) {
                    this.createRainDrop();
                }
            }, i * 25);
        }
        
        this.startLightning();
        
        console.log('🌧️ Rain started');
    }
    
    stopRain() {
        if (!this.isRaining) return;
        
        this.isRaining = false;
        
        if (this.rainInterval) {
            clearInterval(this.rainInterval);
        }
        if (this.lightningInterval) {
            clearInterval(this.lightningInterval);
        }
        
        if (this.rainContainer) {
            this.rainContainer.remove();
            this.rainContainer = null;
        }
        if (this.lightningContainer) {
            this.lightningContainer.remove();
            this.lightningContainer = null;
        }
        
        const splashContainer = document.querySelector('.rain-splash');
        if (splashContainer) {
            splashContainer.remove();
        }
        
        this.rainDrops.clear();
        
        if (window.CloudSystem) {
            window.CloudSystem.setSpawnRate(4000);
        }
        
        console.log('☀️ Rain stopped');
    }
    
    startLightning() {
        if (!this.isRaining) return;
        
        this.lightningInterval = setInterval(() => {
            if (this.isRaining && this.lightningContainer) {
                // Random chance for lightning (30%)
                if (Math.random() < 0.3) {
                    this.triggerLightning();
                }
            }
        }, this.settings.lightningInterval);
    }
    
    triggerLightning() {
        if (!this.lightningContainer) return;
        
        // Trigger CSS animation by toggling a class
        this.lightningContainer.style.animation = 'none';
        setTimeout(() => {
            this.lightningContainer.style.animation = 'lightning 0.5s ease-in-out';
        }, 10);
    }
    
    // Public API
    getStats() {
        return {
            isRaining: this.isRaining,
            activeDrops: this.rainDrops.size,
            settings: { ...this.settings }
        };
    }
}

// Modify the existing CloudSystem to work with rain
if (typeof CloudSystem !== 'undefined') {
    // Extend CloudSystem to handle rain mode
    const originalCloudSystem = window.CloudSystem;
    
    window.CloudSystem = {
        ...originalCloudSystem,
        
        // Override init to include rain system
        init: () => {
            originalCloudSystem.init();
            if (!window.rainSystem) {
                window.rainSystem = new RainSystem();
            }
        },
        
        // Add rain controls
        startRain: () => window.rainSystem?.startRain(),
        stopRain: () => window.rainSystem?.stopRain(),
        getRainStats: () => window.rainSystem?.getStats()
    };
} else {
    // Create standalone rain system
    window.RainSystem = {
        init: () => {
            if (!window.rainSystem) {
                window.rainSystem = new RainSystem();
            }
        },
        start: () => window.rainSystem?.startRain(),
        stop: () => window.rainSystem?.stopRain(),
        getStats: () => window.rainSystem?.getStats()
    };
}

// Auto-initialize rain system
document.addEventListener('DOMContentLoaded', () => {
    if (!window.rainSystem) {
        window.rainSystem = new RainSystem();
    }
});

// Initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    if (!window.rainSystem) {
        window.rainSystem = new RainSystem();
    }
}