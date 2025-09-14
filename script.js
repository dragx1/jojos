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
// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    initSmoothScrolling();
    initModal();
    initForm(); // Инициализируем форму
    initScrollAnimations();
});

// Функция для инициализации формы
function initForm() {
    console.log('Initializing form...');
    const carForm = document.getElementById('carForm');
    
    if (!carForm) {
        console.error('Form not found!');
        return;
    }
    
    console.log('Form found, adding event listener');
    
    // Удаляем старые обработчики чтобы избежать дублирования
    carForm.replaceWith(carForm.cloneNode(true));
    const freshForm = document.getElementById('carForm');
    
    // Флаг для отслеживания отправки
    let isSending = false;
    let lastSubmissionHash = '';
    let lastSubmissionTime = 0;
    
    freshForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const currentTime = Date.now();
        const formData = {
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value,
            price: document.getElementById('price').value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value
        };
        
        // Создаем уникальный хэш для этой заявки
        const submissionHash = Object.values(formData).join('|') + '|' + currentTime;
        
        // Защита от быстрых повторных нажатий (менее 5 секунд)
        if (currentTime - lastSubmissionTime < 5000) {
            console.log('⚠️ Too fast submission, ignoring...');
            return;
        }
        
        // Защита от идентичных заявок
        if (submissionHash === lastSubmissionHash) {
            console.log('⚠️ Duplicate submission, ignoring...');
            return;
        }
        
        // Если уже отправляется - игнорируем
        if (isSending) {
            console.log('⚠️ Form is already sending, ignoring...');
            return;
        }
        
        isSending = true;
        lastSubmissionHash = submissionHash;
        lastSubmissionTime = currentTime;
        
        // Блокируем кнопку отправки
        const submitBtn = freshForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;

        // Показать лоадер
        const loader = document.getElementById('loader');
        if (loader) {
            console.log('Showing loader');
            loader.style.display = 'flex';
        }

        console.log('Form data:', formData);
        
        // Формируем текст сообщения
        const messageText = `
🚗 Новая заявка на оценку автомобиля

Марка: ${formData.brand}
Модель: ${formData.model}
Год выпуска: ${formData.year}
Желаемая цена: ${formData.price} руб.
Имя клиента: ${formData.name}
Телефон: ${formData.phone}

Дата заявки: ${new Date().toLocaleString('ru-RU')}
        `;

        console.log('Message text:', messageText);

        const botToken = '8112921007:AAHvjM0SWYMZDh3xucPLMMfKyPmZ7TYfztY';
        const chatIds = ['1049514305', '1039331603'];

        console.log('Trying to send to Telegram...');

        // 2. ПРОБУЕМ ОТПРАВИТЬ В TELEGRAM
        let telegramSuccess = false;
        let sentMessages = 0;
        
        try {
            // Отправляем в первый чат
            const response1 = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatIds[0],
                    text: messageText
                })
            });
            
            if (response1.ok) {
                console.log('✅ Telegram message sent successfully to first chat!');
                telegramSuccess = true;
                sentMessages++;
                
                // Пробуем отправить во второй чат
                try {
                    const response2 = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: chatIds[1],
                            text: messageText
                        })
                    });
                    
                    if (response2.ok) {
                        console.log('✅ Message sent to second chat too!');
                        sentMessages++;
                    } else {
                        console.log('❌ Second chat error:', response2.status);
                    }
                } catch (secondError) {
                    console.log('Second chat request failed:', secondError.message);
                }
                
            } else {
                console.log('❌ Telegram API error:', response1.status);
            }
            
        } catch (error) {
            console.log('❌ Telegram request failed:', error.message);
        }

        // 3. СОХРАНЯЕМ ДАННЫЕ В ЛOCALSTORAGE
        try {
            const submissions = JSON.parse(localStorage.getItem('carSubmissions') || '[]');
            submissions.push({
                data: formData,
                message: messageText,
                timestamp: new Date().toISOString(),
                sentToTelegram: telegramSuccess,
                messagesSent: sentMessages
            });
            
            localStorage.setItem('carSubmissions', JSON.stringify(submissions));
            console.log('✅ Data saved to localStorage');
            
        } catch (storageError) {
            console.error('Storage error:', storageError);
        }

        // 4. ВОССТАНАВЛИВАЕМ КНОПКУ
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // 5. СКРЫВАЕМ ЛОАДЕР
        if (loader) {
            loader.style.display = 'none';
        }

        // 6. ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ
        if (telegramSuccess) {
            showNotification('✅ Заявка отправлена! Мы свяжемся с вами скоро.', 'success');
        } else {
            showNotification('⚠️ Заявка сохранена! Мы перезвоним вам в течение 15 минут.', 'warning');
        }

        // 7. ЗАКРЫВАЕМ МОДАЛЬНОЕ ОКНО И ОЧИЩАЕМ ФОРМУ
        const modal = document.getElementById('carModal');
        if (modal) {
            modal.classList.remove('visible');
        }
        document.body.style.overflow = 'auto';
        freshForm.reset();
        
        console.log('Form processing completed. Total messages sent:', sentMessages);
        
        // 8. РАЗБЛОКИРУЕМ ФОРМУ
        isSending = false;
        
    }, { once: true }); // { once: true } гарантирует однократное выполнение
}

// Функция для показа уведомления
function showNotification(message, type) {
    console.log('Showing notification:', message);
    const notification = document.getElementById('notification');
    
    if (notification) {
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#ff9800';
        notification.classList.add('show');
        
        setTimeout(function() {
            notification.classList.remove('show');
        }, 5000);
    }
}

// Функция для просмотра сохраненных заявок
function checkSavedSubmissions() {
    console.log('=== CHECKING SAVED SUBMISSIONS ===');
    const submissions = JSON.parse(localStorage.getItem('carSubmissions') || '[]');
    console.log('Total submissions:', submissions.length);
    submissions.forEach((sub, index) => {
        console.log(`--- Submission ${index + 1} ---`);
        console.log('Data:', sub.data);
        console.log('Sent to Telegram:', sub.sentToTelegram);
        console.log('Messages sent:', sub.messagesSent);
        console.log('Timestamp:', sub.timestamp);
    });
    return submissions;
}

// Добавляем функции в глобальную область видимости для отладки
window.checkSubmissions = checkSavedSubmissions;
window.clearSubmissions = function() {
    localStorage.removeItem('carSubmissions');
    console.log('Submissions cleared');
};
});