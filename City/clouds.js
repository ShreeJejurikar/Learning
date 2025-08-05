// Dynamic Cloud System for City Skyline
// Integrates with existing .cloud-container and .cloud classes

class CloudSystem {
    constructor() {
        this.isRunning = true;
        this.cloudId = 0;
        this.activeClouds = new Set();
        
        // Default settings for daytime cloud spawning
        this.settings = {
            spawnRate: 4000,    // 4 seconds between spawns
            minSize: 35,        // Minimum cloud size
            maxSize: 85,        // Maximum cloud size  
            minSpeed: 25,       // Minimum animation duration (seconds)
            maxSpeed: 55,       // Maximum animation duration (seconds)
            maxClouds: 8        // Maximum clouds on screen at once
        };
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Create cloud container if it doesn't exist
        this.container = document.querySelector('.cloud-container');
        if (!this.container) {
            this.createCloudContainer();
        }
        
        // Start spawning clouds after a short delay
        setTimeout(() => {
            this.startSpawning();
            // Create a few initial clouds for immediate effect
            this.createInitialClouds();
        }, 1000);
    }
    
    createCloudContainer() {
        this.container = document.createElement('div');
        this.container.className = 'cloud-container';
        document.body.appendChild(this.container);
    }
    
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    createCloud() {
        // Don't create more clouds if we've hit the limit
        if (this.activeClouds.size >= this.settings.maxClouds) {
            return;
        }
        
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.id = `cloud-${this.cloudId++}`;
        
        // Random properties for natural variation
        const size = this.random(this.settings.minSize, this.settings.maxSize);
        const topPosition = this.random(5, 75); // Keep within reasonable sky area
        const speed = this.random(this.settings.minSpeed, this.settings.maxSpeed);
        const opacity = this.random(0.6, 0.9);
        const blur = this.random(1.5, 3); // Vary the blur slightly
        
        // Apply styles
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`; // Clouds are wider than tall
        cloud.style.top = `${topPosition}%`;
        cloud.style.left = '-200px';
        cloud.style.opacity = opacity;
        cloud.style.animationDuration = `${speed}s`;
        cloud.style.filter = `blur(${blur}px)`;
        
        // Add slight color and shape variation for realism
        const whiteVariation = this.random(245, 255);
        cloud.style.background = `rgb(${whiteVariation}, ${whiteVariation}, ${whiteVariation})`;
        
        // Create cloud shape with pseudo-elements via CSS custom properties
        const beforeSize = this.random(0.4, 0.6);
        const afterSize = this.random(0.5, 0.7);
        const beforeLeft = this.random(5, 15);
        const afterRight = this.random(5, 15);
        
        cloud.style.setProperty('--before-size', `${beforeSize}`);
        cloud.style.setProperty('--after-size', `${afterSize}`);
        cloud.style.setProperty('--before-left', `${beforeLeft}%`);
        cloud.style.setProperty('--after-right', `${afterRight}%`);
        
        // Track active cloud
        this.activeClouds.add(cloud.id);
        
        // Clean up when animation completes
        const handleAnimationEnd = () => {
            if (cloud.parentNode) {
                cloud.parentNode.removeChild(cloud);
            }
            this.activeClouds.delete(cloud.id);
            cloud.removeEventListener('animationend', handleAnimationEnd);
        };
        
        cloud.addEventListener('animationend', handleAnimationEnd);
        
        // Add cloud to container
        this.container.appendChild(cloud);
        
        return cloud;
    }
    
    startSpawning() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        
        this.spawnInterval = setInterval(() => {
            if (this.isRunning) {
                // Add randomness to spawn timing (±50% of base rate)
                const randomDelay = this.random(
                    this.settings.spawnRate * 0.5, 
                    this.settings.spawnRate * 1.5
                );
                
                setTimeout(() => {
                    if (this.isRunning && this.activeClouds.size < this.settings.maxClouds) {
                        this.createCloud();
                    }
                }, randomDelay);
            }
        }, this.settings.spawnRate);
    }
    
    createInitialClouds() {
        // Create 2-3 clouds with staggered timing for natural start
        const initialCount = Math.floor(this.random(2, 4));
        
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                if (this.isRunning) {
                    this.createCloud();
                }
            }, i * 1500); // 1.5 second intervals
        }
    }
    
    // Public methods for external control
    pause() {
        this.isRunning = false;
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
    }
    
    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startSpawning();
        }
    }
    
    clear() {
        const clouds = this.container.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
            cloud.remove();
            this.activeClouds.delete(cloud.id);
        });
    }
    
    // Adjust spawn rate (useful for day/night cycles)
    setSpawnRate(milliseconds) {
        this.settings.spawnRate = milliseconds;
        if (this.isRunning) {
            this.startSpawning(); // Restart with new timing
        }
    }
    
    // Get current stats
    getStats() {
        return {
            activeClouds: this.activeClouds.size,
            isRunning: this.isRunning,
            settings: { ...this.settings }
        };
    }
}

// Auto-initialize when script loads
let cloudSystem;

// Initialize cloud system
function initClouds() {
    if (!cloudSystem) {
        cloudSystem = new CloudSystem();
    }
}

// Public API for external control
window.CloudSystem = {
    init: initClouds,
    pause: () => cloudSystem?.pause(),
    resume: () => cloudSystem?.resume(),
    clear: () => cloudSystem?.clear(),
    setSpawnRate: (rate) => cloudSystem?.setSpawnRate(rate),
    getStats: () => cloudSystem?.getStats()
};

// Auto-start
initClouds();