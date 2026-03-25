document.addEventListener('DOMContentLoaded', () => {

    // --- 0. 🟢 เริ่มต้น AOS ทันที (แก้ปัญหาหน้าเว็บขาว) 🟢 ---
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    // เปิดให้แชทบอทแสดงผล
    const chatContainer = document.querySelector('.ai-chat-container');
    if (chatContainer) chatContainer.classList.add('show');

    // --- 1. ระบบ Continuous Marquee Slider (ไหลไปเรื่อยๆ) ---
    const sliders = document.querySelectorAll('.project-slider');
    
    sliders.forEach(slider => {
        const cards = Array.from(slider.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            slider.appendChild(clone);
        });

        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;
        
        let speed = 0.5; 
        let exactScroll = 0;

        const startAutoScroll = () => {
            cancelAnimationFrame(animationId);
            exactScroll = slider.scrollLeft; 
            
            const play = () => {
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    exactScroll = 0;
                    slider.scrollLeft = 0;
                } else {
                    exactScroll += speed; 
                    slider.scrollLeft = exactScroll;
                }
                animationId = requestAnimationFrame(play);
            };
            play();
        };

        const stopAutoScroll = () => cancelAnimationFrame(animationId);

        startAutoScroll();

        slider.addEventListener('mouseenter', stopAutoScroll);
        slider.addEventListener('mouseleave', () => {
            if (!isDown) {
                slider.style.cursor = 'grab';
                startAutoScroll(); 
            }
        });

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            stopAutoScroll(); 
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
            startAutoScroll(); 
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
        
        slider.style.cursor = 'grab';
    });

    // --- 2. ระบบ Smooth Scroll ---
    document.querySelectorAll('nav a, .hero-btns a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offsetPosition = targetElement.offsetTop - 80;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- 3. ระบบฟอร์ม Contact ---
    const contactForm = document.querySelector('.custom-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // ปล่อยให้ Formspree ทำงานตามปกติ
        });
    }

    // --- 4. ระบบ AI Chatbot ---
    const chatToggle = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatBody = document.getElementById('chat-body');

    if (chatToggle && chatWindow && closeChatBtn) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            const dot = chatToggle.querySelector('.notification-dot');
            if (dot) dot.style.display = 'none';
        });
        closeChatBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        msgDiv.innerHTML = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (text === '') return;

        addMessage(text, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const responses = [
                "ยังไม่เปิดการใช้งานฟีเจอร์นี้นะครับ แต่ถ้าคุณอยากรู้จักผลงานหรือประสบการณ์ของผมเพิ่มเติม ลองดูในส่วน Projects หรือ Certifications ได้เลยครับ! 😊",
                "ERROR 404: The system is currently unavailable. We apologize for the inconvenience.",
            ];
            const randomReply = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomReply, 'ai');
        }, 1000); 
    }

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });
    }

    // --- 5. ระบบพิมพ์ดีดเล่นวน (Typewriter Effect) ---
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const textArray = ["Co-operative Education Student"];
        let textIndex = 0, charIndex = 0, isDeleting = false;

        function typeWriter() {
            const currentWord = textArray[textIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false; textIndex = (textIndex + 1) % textArray.length; typeSpeed = 500; 
            }
            setTimeout(typeWriter, typeSpeed);
        }
        setTimeout(typeWriter, 1500); 
    }

    // --- 6. ⭐️ ระบบสลับโหมดมืด/สว่าง ⭐️ ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if(themeBtn) {
            const icon = themeBtn.querySelector('i');
            icon.classList.remove('fa-moon'); 
            icon.classList.add('fa-sun');
            icon.style.color = '#fbbf24'; 
            icon.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.8)';
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const icon = themeBtn.querySelector('i');
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                icon.style.color = '#fbbf24';
                icon.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.8)';
                localStorage.setItem('theme', 'light'); 
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                icon.style.color = ''; 
                icon.style.textShadow = ''; 
                localStorage.setItem('theme', 'dark'); 
            }
        });
    }

    // --- 7. ระบบ Portfolio Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 8. ระบบ Modal ป๊อปอัปแกลเลอรี (ครบวงจร) ---
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const projectCards = document.querySelectorAll('.open-modal-btn');
    const activityImgs = document.querySelectorAll('.activity-img-click');
    const certBtns = document.querySelectorAll('.cert-view-btn'); // 🟢 สำหรับปุ่ม View Full ของเกียรติบัตร
    
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalCounter = document.getElementById('modal-counter');
    const modalBody = document.getElementById('modal-text-content'); 
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let projectImages = []; 
    let currentImgIndex = 0; 

    if(modal) {
        // --- 8.1 เปิดจากการ์ดโปรเจกต์ (มีข้อความ) ---
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                if (modalBody) modalBody.style.display = 'block'; 

                const title = card.getAttribute('data-title');
                const rawImages = card.getAttribute('data-img');
                projectImages = rawImages ? rawImages.split(',').map(img => img.trim()) : []; 
                currentImgIndex = 0; 

                const desc = card.getAttribute('data-desc');
                const techs = card.getAttribute('data-tech') ? card.getAttribute('data-tech').split(',').map(tech => tech.trim()) : []; 

                if (modalTitle) modalTitle.textContent = title;
                if (modalDesc) modalDesc.textContent = desc;
                
                if (modalTech) {
                    modalTech.innerHTML = '';
                    techs.forEach(tech => {
                        const span = document.createElement('span');
                        span.textContent = tech;
                        modalTech.appendChild(span);
                    });
                }

                updateGallery();
                checkNavButtons();
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // --- 8.2 เปิดจากรูปภาพกิจกรรม (ไม่มีข้อความ) ---
        activityImgs.forEach((img, index) => {
            img.addEventListener('click', () => {
                if (modalBody) modalBody.style.display = 'none'; 
                projectImages = Array.from(activityImgs).map(actImg => actImg.getAttribute('src'));
                currentImgIndex = index; 
                updateGallery();
                checkNavButtons();
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // --- 8.3 🟢 เปิดจากปุ่ม View Full เกียรติบัตร (ไม่มีข้อความ) 🟢 ---
        certBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (modalBody) modalBody.style.display = 'none'; 
                
                const certImgSrc = btn.getAttribute('data-img');
                projectImages = [certImgSrc]; 
                currentImgIndex = 0; 

                updateGallery();
                checkNavButtons();
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // --- 🖼️ ฟังก์ชันช่วยจัดการแกลเลอรี ---
        function updateGallery() {
            if(projectImages.length > 0) {
                modalImg.src = projectImages[currentImgIndex]; 
                modalCounter.textContent = `${currentImgIndex + 1} / ${projectImages.length}`; 
            }
        }

        function checkNavButtons() {
            if(projectImages.length > 1) {
                prevBtn.classList.add('show');
                nextBtn.classList.add('show');
            } else {
                prevBtn.classList.remove('show');
                nextBtn.classList.remove('show');
            }
        }

        const navigateGallery = (direction) => {
            if(projectImages.length > 1) {
                currentImgIndex += direction; 
                if(currentImgIndex < 0) currentImgIndex = projectImages.length - 1; 
                if(currentImgIndex >= projectImages.length) currentImgIndex = 0; 
                updateGallery(); 
            }
        };

        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(-1); }); 
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(1); }); 

        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            projectImages = []; 
            modalImg.src = ''; 
        };

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if(e.target === modal || e.target.classList.contains('modal-gallery-wrapper')) closeModal(); 
        });

        document.addEventListener('keydown', (e) => {
            if(modal.classList.contains('show')) {
                if(e.key === 'Escape') closeModal(); 
                if(e.key === 'ArrowLeft') navigateGallery(-1); 
                if(e.key === 'ArrowRight') navigateGallery(1); 
            }
        });
    }

    console.log("✅ Web Developer Portfolio Engine: Active 🚀");
});