/**
 * BYMELLA CORE ARCHITECTURE
 * Recoded with native human logic for high-conversion fashion store.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // State penyimpan data baju pilihan pelanggan
    let cart = [];

    // Pointer Elemen DOM
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCounter = document.getElementById('cartCounter');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const whatsappCheckoutBtn = document.getElementById('whatsappCheckout');

    // Drawer Handler (Buka Tutup Tas Belanja)
    if (cartToggle && cartOverlay && closeCart) {
        cartToggle.addEventListener('click', () => cartOverlay.classList.add('active'));
        closeCart.addEventListener('click', () => cartOverlay.classList.remove('active'));
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    // Fungsi Utama Render Antarmuka Isi Keranjang Belanja
    const renderCartUi = () => {
        // Hitung total kuantitas barang
        const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalQty;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-text">Keranjangmu masih kosong nih. Yuk, isi dengan baju incaranmu!</p>';
            cartSubtotal.textContent = 'Rp 0';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let calculatedSubtotal = 0;

        cart.forEach((item, index) => {
            const rowTotal = item.price * item.quantity;
            calculatedSubtotal += rowTotal;

            const cartItemRow = document.createElement('div');
            cartItemRow.className = 'cart-item-row';
            cartItemRow.style.display = 'flex';
            cartItemRow.style.justify = 'space-between';
            cartItemRow.style.alignItems = 'center';
            cartItemRow.style.marginBottom = '16px';
            cartItemRow.style.paddingBottom = '12px';
            cartItemRow.style.borderBottom = '1px solid #F5EBED';

            // Visual Tambahan Kontrol Kuantitas (+ dan -) untuk kemudahan Pembeli
            cartItemRow.innerHTML = `
                <div>
                    <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:2px;">${item.name}</h4>
                    <span style="font-size:0.85rem; color:#6E5E61;">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <br>
                    <div class="qty-control-wrapper">
                        <button class="qty-btn dec-qty" data-index="${index}">-</button>
                        <input type="text" class="qty-input" value="${item.quantity}">
                        <button class="qty-btn inc-qty" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete-item-trigger" data-index="${index}" style="background:none; border:none; color:#C0392B; cursor:pointer; padding:8px;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            cartItemsContainer.appendChild(cartItemRow);
        });

        cartSubtotal.textContent = `Rp ${calculatedSubtotal.toLocaleString('id-ID')}`;
    };

    // Handler klik tombol "Masuk Tas" di Grid Katalog
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-action');
        if (btn) {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'), 10);

            const checkExist = cart.find(item => item.id === id);

            if (checkExist) {
                // Jika sudah ada di tas, naikkan jumlahnya
                checkExist.quantity += 1;
            } else {
                // Jika item baru
                cart.push({ id, name, price, quantity: 1 });
            }

            renderCartUi();
            
            // Beri umpan balik visual singkat kalau baju sukses masuk tas
            const oldText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Masuk!';
            btn.style.backgroundColor = '#FF5E7E';
            btn.style.color = '#ffffff';
            setTimeout(() => {
                btn.innerHTML = oldText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 800);
        }
    });

    // Menangani Penambahan, Pengurangan Kuantitas, & Hapus di dalam Mini Cart
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        // Tombol Tambah (+)
        if (target.classList.contains('inc-qty')) {
            const idx = parseInt(target.getAttribute('data-index'), 10);
            cart[idx].quantity += 1;
            renderCartUi();
        }
        
        // Tombol Kurang (-)
        if (target.classList.contains('dec-qty')) {
            const idx = parseInt(target.getAttribute('data-index'), 10);
            if (cart[idx].quantity > 1) {
                cart[idx].quantity -= 1;
            } else {
                // Kalau dikurangi saat jumlah = 1, maka otomatis hapus
                cart.splice(idx, 1);
            }
            renderCartUi();
        }

        // Tombol Hapus (Tong Sampah)
        if (target.closest('.delete-item-trigger')) {
            const trigger = target.closest('.delete-item-trigger');
            const idx = parseInt(trigger.getAttribute('data-index'), 10);
            cart.splice(idx, 1);
            renderCartUi();
        }
    });

    // Integrasi Checkout WhatsApp dengan Gaya Narasi Manusia Hidup
    if (whatsappCheckoutBtn) {
        whatsappCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Pilih bajunya dulu yuk, tas belanja kamu masih kosong nih.');
                return;
            }

            const PHONE_ADMIN = '628123456789'; // Ganti dengan nomor WhatsApp jualanmu
            
            let teksOrder = `*Pesanan Baru - ByMella Official*\n`;
            teksOrder += `===============================\n`;
            teksOrder += `Kak Admin, saya mau pesan baju-baju gemas ini ya:\n\n`;

            let hitungTotal = 0;
            cart.forEach((item, i) => {
                const sub = item.price * item.quantity;
                hitungTotal += sub;
                teksOrder += `${i + 1}. *${item.name}*\n   Jumlah: ${item.quantity} pcs\n   Subtotal: Rp ${sub.toLocaleString('id-ID')}\n\n`;
            });

            teksOrder += `===============================\n`;
            teksOrder += `💰 *Total Pembayaran*: Rp ${hitungTotal.toLocaleString('id-ID')}\n\n`;
            teksOrder += `Boleh dibantu kirim format orderan dan detail total ongkos kirimnya kak? Terima kasih! ✨`;

            const linkWa = `https://api.whatsapp.com/send?phone=${PHONE_ADMIN}&text=${encodeURIComponent(teksOrder)}`;
            window.open(linkWa, '_blank');
        });
    }

    // Auto-generate Product Sliders for all products
    const productMedias = document.querySelectorAll('.product-media');
    productMedias.forEach(media => {
        const existingImg = media.querySelector('img.product-img');
        const badge = media.querySelector('.product-badge');
        if (!existingImg) return;

        // Tentukan gambar dummy (geser urutan gambar sebagai variasi)
        let imgSrc2 = 'assets/baju_pilihan_1.png';
        if (existingImg.src.includes('baju_pilihan_1.png')) imgSrc2 = 'assets/baju_pilihan_2.png';
        else if (existingImg.src.includes('baju_pilihan_2.png')) imgSrc2 = 'assets/baju_pilihan_3.png';
        
        const slider = document.createElement('div');
        slider.className = 'product-slider';
        
        const slide1 = document.createElement('div');
        slide1.className = 'slider-item';
        const img1 = document.createElement('img');
        img1.src = existingImg.src;
        img1.className = 'product-img';
        img1.alt = existingImg.alt || 'Gambar Produk 1';
        slide1.appendChild(img1);
        
        const slide2 = document.createElement('div');
        slide2.className = 'slider-item';
        const img2 = document.createElement('img');
        img2.src = imgSrc2;
        img2.className = 'product-img';
        img2.alt = 'Gambar Produk Tambahan';
        slide2.appendChild(img2);
        
        slider.appendChild(slide1);
        slider.appendChild(slide2);
        
        media.innerHTML = '';
        if (badge) media.appendChild(badge);
        media.appendChild(slider);
        
        // Teks Hint Geser
        const swipeHint = document.createElement('div');
        swipeHint.className = 'swipe-hint';
        swipeHint.innerHTML = 'Geser <i class="fas fa-arrow-right"></i>';
        media.appendChild(swipeHint);
        
        // Tombol Navigasi Slider
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        media.appendChild(prevBtn);
        media.appendChild(nextBtn);
        
        // Logika Geser (Scroll)
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
        });
    });

    // Mesin Filtrasi Kategori Katalog Instan (PO / Custom / Ready)
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.product-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetCategory = tab.getAttribute('data-target');

            cards.forEach(card => {
                const itemCat = card.getAttribute('data-category');
                
                if (targetCategory === 'all' || itemCat === targetCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Lightbox / Zoom Gambar Logic
    const lightboxOverlay = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentLightboxImages = [];
    let currentLightboxIndex = 0;

    if (lightboxOverlay && lightboxImg && lightboxClose) {
        // Delegasi event klik untuk semua gambar produk yang ada & baru dibuat
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-img')) {
                const slider = e.target.closest('.product-slider');
                if (slider) {
                    currentLightboxImages = Array.from(slider.querySelectorAll('.product-img')).map(img => img.src);
                    currentLightboxIndex = currentLightboxImages.indexOf(e.target.src);
                } else {
                    currentLightboxImages = [e.target.src];
                    currentLightboxIndex = 0;
                }

                lightboxImg.src = currentLightboxImages[currentLightboxIndex];
                lightboxOverlay.classList.add('active');
            }
        });

        const updateLightboxImage = () => {
            if(currentLightboxImages.length > 0) {
                lightboxImg.src = currentLightboxImages[currentLightboxIndex];
            }
        };

        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation(); // Mencegah klik menyebar ke overlay (yang akan menutup modal)
                if (currentLightboxImages.length > 0) {
                    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
                    updateLightboxImage();
                }
            });

            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentLightboxImages.length > 0) {
                    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
                    updateLightboxImage();
                }
            });
        }

        const closeLightbox = () => {
            lightboxOverlay.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; currentLightboxImages = []; }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) closeLightbox();
        });
    }
});