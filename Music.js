class MusicController {
    constructor() {
        this.audio = document.getElementById('bgMusic');
        this.audioSource = document.getElementById('audioSource');
        this.musicControl = document.getElementById('musicControl');
        this.musicIcon = document.getElementById('musicIcon');
        
        this.isPlaying = false;
        
        // Icon URLs
        this.playIcon = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDKK2JJ4hhd4jolVXuTRr36Awj7erI8FVvdw&s';
        this.stopIcon = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStEABrqUfynIxWVmgKPcuNfqvMe9MPY0m0uQ&s';
        
        // Audio paths
        this.dayMusicPath = 'Day_Music.mp3';
        this.nightMusicPath = 'Night_Music.mp3';
        
        this.mediaQuery = window.matchMedia('(max-width: 1000px)');
        
        this.init();
    }
    
    init() {
        this.updateAudioSource();
        
        this.musicControl.addEventListener('click', () => this.toggleMusic());
        this.mediaQuery.addListener(() => {
            this.updateAudioSource();
            if (this.isPlaying) {
                this.audio.load();
                this.audio.play();
            }
        });
        
        this.audio.addEventListener('ended', () => this.resetToPlay());
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Audio file not found. Please check the file path.');
            this.resetToPlay();
        });
    }
    
    updateAudioSource() {
        if (this.mediaQuery.matches) {
            this.audioSource.src = this.nightMusicPath;
        } else {
            this.audioSource.src = this.dayMusicPath;
        }
        this.audio.load();
    }
    
    toggleMusic() {
        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
    }
    
    playMusic() {
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.musicIcon.src = this.stopIcon;
                    this.musicIcon.alt = 'Stop Music';
                    this.musicControl.classList.add('playing');
                })
                .catch(error => {
                    console.error('Play failed:', error);
                });
        }
    }
    
    stopMusic() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.resetToPlay();
    }
    
    resetToPlay() {
        this.isPlaying = false;
        this.musicIcon.src = this.playIcon;
        this.musicIcon.alt = 'Play Music';
        this.musicControl.classList.remove('playing');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicController();
});