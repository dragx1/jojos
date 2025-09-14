// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация плавной прокрутки для навигационных ссылок
    initSmoothScrolling();
    
    // Инициализация модального окна
    initModal();
    
    // Инициализация формы
    initForm();
    
    // Добавление анимаций для элементов при скролле
    initScrollAnimations();
});

// Функция для инициализации плавной прокрутки
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Функция для инициализации модального окна
function initModal() {
    const modal = document.getElementById('carModal');
    const sellCarBtn = document.getElementById('sellCarBtn');
    const closeModal = document.getElementById('closeModal');
    
    // Открытие модального окна
    if (sellCarBtn && modal) {
        sellCarBtn.addEventListener('click', function() {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Закрытие модального окна
    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('visible');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('carModal');
        if (e.target === modal) {
            modal.classList.remove('visible');
            document.body.style.overflow = 'auto';
        }
    });
}

// Функция для инициализации формы
function initForm() {
    const carForm = document.getElementById('carForm');
    
    if (carForm) {
        carForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Показать лоадер
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'flex';
            }
            
            // Имитация отправки данных
            setTimeout(function() {
                // Скрыть лоадер
                if (loader) {
                    loader.style.display = 'none';
                }
                
                // Показать уведомление об успехе
                showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Закрыть модальное окно
                const modal = document.getElementById('carModal');
                if (modal) {
                    modal.classList.remove('visible');
                }
                document.body.style.overflow = 'auto';
                
                // Очистить форму
                carForm.reset();
            }, 2000);
        });
    }
}

// Функция для показа уведомления
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    
    if (notification) {
        // Установка сообщения и цвета в зависимости от типа
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        
        // Показать уведомление
        notification.classList.add('show');
        
        // Скрыть уведомление через 5 секунд
        setTimeout(function() {
            notification.classList.remove('show');
        }, 5000);
    }
}

// Функция для инициализации анимаций при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .step-card, .contact-card');
    
    // Создание наблюдателя для анимации при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдение за всеми анимируемыми элементами
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// Добавление дополнительных эффектов при наведении на кнопки
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Добавление интерактивности для карточек
document.querySelectorAll('.feature-card, .step-card, .contact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
	// Функция для инициализации формы
function initForm() {
    const carForm = document.getElementById('carForm');
    
    if (carForm) {
        carForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Показать лоадер
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'flex';
            }

            // 1. СОБИРАЕМ ДАННЫЕ ИЗ ФОРМЫ
            const formData = {
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                price: document.getElementById('price').value,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value
            };
            
            // Формируем текст сообщения для Telegram
            const messageText = `
🚗 *Новая заявка на оценку автомобиля* 

*Марка:* ${formData.brand}
*Модель:* ${formData.model}
*Год выпуска:* ${formData.year}
*Желаемая цена:* ${formData.price} руб.
*Имя клиента:* ${formData.name}
*Телефон:* ${formData.phone}

*Дата заявки:* ${new Date().toLocaleString('ru-RU')}
            `;

            // 2. НАСТРОЙКИ ДЛЯ РОССИИ: Используем публичный прокси
            const botToken = '8112921007:AAHvjM0SWYMZDh3xucPLMMfKyPmZ7TYfztY';
            const chatIds = ['1049514305', '1039331603'];

            // Публичные прокси для обхода блокировки
            const proxyUrls = [
                'https://api.telegram-proxy.org/bot',
                'https://telegram-api.iran.liara.run/bot',
                'https://tg-proxy.fly.dev/bot'
            ];

            let lastError = null;

            // Пробуем отправить через каждый прокси до первого успешного
            for (const proxyUrl of proxyUrls) {
                try {
                    const telegramApiUrl = `${proxyUrl}${botToken}/sendMessage`;
                    
                    // Отправляем во все чаты через текущий прокси
                    const sendPromises = chatIds.map(chatId => {
                        const requestBody = {
                            chat_id: chatId,
                            text: messageText,
                            parse_mode: 'Markdown'
                        };

                        return fetch(telegramApiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody)
                        });
                    });

                    await Promise.all(sendPromises);
                    
                    // УСПЕХ: скрываем лоадер и показываем уведомление
                    if (loader) {
                        loader.style.display = 'none';
                    }
                    
                    showNotification('✅ Заявка отправлена! Мы свяжемся с вами для оценки автомобиля.', 'success');
                    
                    // Закрываем модальное окно и очищаем форму
                    const modal = document.getElementById('carModal');
                    if (modal) {
                        modal.classList.remove('visible');
                    }
                    document.body.style.overflow = 'auto';
                    carForm.reset();

                    return; // Выходим из функции при успехе

                } catch (error) {
                    console.error(`Ошибка с прокси ${proxyUrl}:`, error);
                    lastError = error;
                    continue; // Пробуем следующий прокси
                }
            }

            // ЕСЛИ ВСЕ ПРОКСИ НЕ СРАБОТАЛИ:
            if (loader) {
                loader.style.display = 'none';
            }
            
            // Сохраняем данные в localStorage на случай проблем с отправкой
            const failedSubmission = {
                data: formData,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('failedCarSubmission', JSON.stringify(failedSubmission));
            
            showNotification('⚠️ Не удалось отправить заявку. Пожалуйста, позвоните нам напрямую.', 'error');
            console.error('Все прокси не сработали:', lastError);
        });
    }
}
});