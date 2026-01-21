class Lightbox {
    constructor(selector) {
        this.images = document.querySelectorAll(selector);
        this.currentIndex = 0;
        this.galleryImages = [];

        if (this.images.length > 0) {
            this.init();
        }
    }

    init() {
        this.images.forEach((img, index) => {
            this.galleryImages.push(img.src);
            img.addEventListener('click', () => this.open(index));
        });

        this.createModal();

        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.changeImage(-1);
        });
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.changeImage(1);
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('open')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.changeImage(-1);
            if (e.key === 'ArrowRight') this.changeImage(1);
        });
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <a class="lightbox-prev">&#10094;</a>
            <div class="lightbox-content-wrapper">
                <img class="lightbox-image" src="" alt="Gallery Image">
            </div>
            <a class="lightbox-next">&#10095;</a>
        `;
        document.body.appendChild(modal);

        this.modal = modal;
        this.modalImg = modal.querySelector('.lightbox-image');
        this.closeBtn = modal.querySelector('.lightbox-close');
        this.prevBtn = modal.querySelector('.lightbox-prev');
        this.nextBtn = modal.querySelector('.lightbox-next');
    }

    open(index) {
        this.currentIndex = index;
        this.updateImage();
        this.modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    changeImage(direction) {
        this.currentIndex += direction;

        if (this.currentIndex >= this.galleryImages.length) {
            this.currentIndex = 0;
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.galleryImages.length - 1;
        }

        this.updateImage();
    }

    updateImage() {
        this.modalImg.src = this.galleryImages[this.currentIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Lightbox('.lightbox-trigger');
});
