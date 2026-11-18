// ==========================================
// 1. НАСТРОЙКИ (Ссылка от Google Apps Script)
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKmWhF8WXqDjOMT_Iito0PEAx9kUZk92daUFWwRg1HwVi9r4Qy49zrGva4B1H9B5mP/exec';

// ==========================================
// 2. АНИМАЦИЯ ЧАСТИЦ
// ==========================================
tsParticles.load("particles-js", {
    particles: {
        number: { value: 40, density: { enable: true, value_area: 800 } },
        color: { value: "#d4af37" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
        links: { enable: false },
        move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: "bubble" } },
        modes: { bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8 } }
    },
    retina_detect: true
});

// ==========================================
// 3. ЛОГИКА САЙТА
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Переключение экранов и умная шапка ---
    const navLinks = document.querySelectorAll('.nav-link');
    const screens = document.querySelectorAll('.screen');
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    // Сразу прячем бургер, если мы на главной (при загрузке)
    if(document.getElementById('hero').classList.contains('active-screen')) {
        burgerBtn.classList.add('hide-burger');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Скрываем все экраны
            navLinks.forEach(l => l.classList.remove('active'));
            screens.forEach(s => s.classList.remove('active-screen'));

            const targetId = link.getAttribute('data-target');
            const targetScreen = document.getElementById(targetId);

            // Подсвечиваем активную ссылку
            if (link.classList.contains('btn-nav') || link.classList.contains('btn-main') || link.classList.contains('btn-outline')) {
                const menuLink = document.querySelector(`nav .nav-link[data-target="${targetId}"]`);
                if(menuLink) menuLink.classList.add('active');
            } else {
                link.classList.add('active');
            }
            
            // Показываем нужный экран
            targetScreen.classList.add('active-screen');

            // --- ЛОГИКА УМНОЙ ШАПКИ ---
            if (targetId === 'hero') {
                burgerBtn.classList.add('hide-burger'); // Прячем на главной
            } else {
                burgerBtn.classList.remove('hide-burger'); // Показываем на остальных
            }

            // Закрываем мобильное меню, если оно было открыто
            navMenu.classList.remove('active');
            burgerBtn.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    });

     // --- Бургер-меню и затемнение ---
    
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active'); 
    });

    // Если кликнули по затемнению, закрываем меню
    navOverlay.addEventListener('click', () => {
        burgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
    });

        // --- ЛОГИКА ПОШАГОВОЙ ЗАПИСИ ---
    let currentService = { name: '', price: 0 };
    let currentMaster = '';

    // Функция переключения шагов
    window.goToStep = function(stepNumber) {
        // Прячем все шаги
        document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
        // Показываем нужный
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Обновляем прогресс-бар
        for(let i=1; i<=3; i++) {
            const indicator = document.getElementById(`step${i}-indicator`);
            if(i <= stepNumber) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    };

    // Выбор услуги
    window.selectService = function(name, price, element) {
        // Подсветка
        document.querySelectorAll('#step-1 .option-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        
        // Сохраняем данные
        currentService = { name, price };
        document.getElementById('summaryService').innerText = name;
        document.getElementById('summaryPrice').innerText = price + ' ₽';
        document.getElementById('hiddenService').value = name;

        // Автоматический переход на шаг 2
        setTimeout(() => goToStep(2), 300); 
    };

    // Выбор мастера
    window.selectMaster = function(name, element) {
        document.querySelectorAll('#step-2 .option-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        
        currentMaster = name;
        document.getElementById('summaryMaster').innerText = name;
        document.getElementById('hiddenMaster').value = name;

        // Автоматический переход на шаг 3
        setTimeout(() => goToStep(3), 300);
    };

    // --- ОТПРАВКА ФОРМЫ (Скрытая форма для обхода блокировок) ---
    const form = document.getElementById('bookingForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        // Берем данные из тех полей, которые теперь есть в новой форме
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        // Для услуги и мастера берем значения из наших скрытых полей (hidden), 
        // которые мы заполнили при клике на карточки
        const service = document.getElementById('hiddenService').value;
        const master = document.getElementById('hiddenMaster').value;

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Отправка...';
        submitBtn.disabled = true;

        const text = `🔥 <b>Новая заявка (Новый Стиль)!</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Телефон:</b> ${phone}\n✂️ <b>Услуга:</b> ${service}\n💈 <b>Мастер:</b> ${master}`;

        // --- ВОТ ОНА, НАША СКРЫТАЯ ФОРМА ДЛЯ ОБХОДА ---
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = GOOGLE_SCRIPT_URL;
        hiddenForm.target = 'hidden_iframe';
        hiddenForm.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'text';
        input.value = text;
        hiddenForm.appendChild(input);

        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        
        document.body.appendChild(iframe);
        document.body.appendChild(hiddenForm);
        
        hiddenForm.submit();

        setTimeout(() => {
            document.body.removeChild(hiddenForm);
            document.body.removeChild(iframe);
            
            alert(`Спасибо, ${name}! Ваша заявка принята. Мы свяжемся с вами.`);
            form.reset();
            
            // Возвращаем форму на 1-й шаг после успешной отправки
            goToStep(1);
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            
            // Возвращаемся на главный экран сайта
            document.querySelector('.nav-link[data-target="hero"]').click();
            
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1000); 
    });
});