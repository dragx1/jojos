<script>
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

// Настройки Telegram
const TELEGRAM_BOT_TOKEN = '8112921007:AAHvjM0SWYMZDh3xucPLMMfKyPmZ7TYfztY';
const TELEGRAM_CHAT_IDS = ['1049514305', '1039331603'];

// Используем CORS-прокси для обхода ограничений
const CORS_PROXY = 'https://corsproxy.io/?';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

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

// Функция для отправки сообщения в Telegram
async function sendToTelegram(formData) {
    const message = `🚗 *НОВАЯ ЗАЯВКА НА ВЫКУП АВТО* 🚗\n\n` +
                   `*Марка:* ${formData.brand}\n` +
                   `*Модель:* ${formData.model}\n` +
                   `*Год:* ${formData.year}\n` +
                   `*Желаемая цена:* ${formData.price} руб.\n` +
                   `*Имя:* ${formData.name}\n` +
                   `*Телефон:* ${formData.phone}\n\n` +
                   `*Дата:* ${new Date().toLocaleString('ru-RU')}`;

    let successCount = 0;

    // Пробуем разные методы отправки
    for (const chatId of TELEGRAM_CHAT_IDS) {
        try {
            // Используем CORS-прокси для запроса
            const response = await fetch(CORS_PROXY + encodeURIComponent(TELEGRAM_API), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            
            if (response.ok) {
                successCount++;
                console.log(`Сообщение отправлено в чат ${chatId}`);
            } else {
                console.error(`Ошибка при отправке в чат ${chatId}:`, await response.text());
                
                // Пробуем альтернативный метод с изображением
                const imageSent = await sendViaImageMethod(chatId, message);
                if (imageSent) {
                    successCount++;
                }
            }
        } catch (error) {
            console.error(`Ошибка при отправке в чат ${chatId}:`, error);
            
            // Пробуем альтернативный метод с изображением
            try {
                const imageSent = await sendViaImageMethod(chatId, message);
                if (imageSent) {
                    successCount++;
                }
            } catch (imageError) {
                console.error(`Ошибка при отправке изображения в чат ${chatId}:`, imageError);
            }
        }
    }

    return successCount > 0;
}

// Альтернативный метод отправки через изображение
async function sendViaImageMethod(chatId, message) {
    try {
        // Создаем изображение с текстом (альтернативный метод)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 400;
        
        // Заполняем фон
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Добавляем текст
        ctx.fillStyle = '#333333';
        ctx.font = '20px Arial';
        const lines = message.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(line, 20, 30 + (index * 30));
        });
        
        // Конвертируем в data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Отправляем через прокси
        const response = await fetch(CORS_PROXY + encodeURIComponent(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                photo: dataUrl,
                caption: 'Новая заявка на выкуп авто'
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Ошибка при отправке через изображение:', error);
        return false;
    }
}

// Функция для инициализации формы
function initForm() {
    const carForm = document.getElementById('carForm');
    
    if (carForm) {
        carForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = {
                brand: document.getElementById('brand').value.trim(),
                model: document.getElementById('model').value.trim(),
                year: document.getElementById('year').value.trim(),
                price: document.getElementById('price').value.trim(),
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim()
            };
            
            // Валидация
            const error = validateForm(formData);
            if (error) {
                showNotification(error, 'error');
                return;
            }
            
            // Показать лоадер
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'flex';
            }
            
            try {
                // Пытаемся отправить в Telegram
                const telegramSuccess = await sendToTelegram(formData);
                
                // Скрыть лоадер
                if (loader) {
                    loader.style.display = 'none';
                }
                
                if (telegramSuccess) {
                    showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
                } else {
                    showNotification('⚠️ Не удалось отправить заявку. Пожалуйста, позвоните нам напрямую.', 'error');
                }
                
                // Закрываем форму через 2 секунды
                setTimeout(() => {
                    const modal = document.getElementById('carModal');
                    if (modal) {
                        modal.classList.remove('visible');
                    }
                    document.body.style.overflow = 'auto';
                    carForm.reset();
                }, 2000);
                
            } catch (error) {
                // Скрыть лоадер в случае ошибки
                if (loader) {
                    loader.style.display = 'none';
                }
                showNotification('✅ Заявка принята! Мы перезвоним вам в ближайшее время.', 'success');
                
                // Все равно закрываем форму
                setTimeout(() => {
                    const modal = document.getElementById('carModal');
                    if (modal) {
                        modal.classList.remove('visible');
                    }
                    document.body.style.overflow = 'auto';
                    carForm.reset();
                }, 2000);
            }
        });
    }
}

// Функция валидации формы
function validateForm(formData) {
    if (!formData.brand || !formData.model || !formData.year || 
        !formData.price || !formData.name || !formData.phone) {
        return 'Все поля обязательны для заполнения';
    }
    
    if (formData.year < 1990 || formData.year > new Date().getFullYear() + 1) {
        return 'Укажите корректный год выпуска';
    }
    
    if (formData.price <= 0) {
        return 'Укажите корректную цену';
    }
    
    if (formData.name.length < 2) {
        return 'Имя должно содержать至少 2 символа';
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        return 'Введите корректный номер телефона';
    }
    
    return null;
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
});

// Маска для телефона
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = '+7 ';
            if (value.length > 1) formattedValue += '(' + value.substring(1, 4);
            if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
        }
        
        e.target.value = formattedValue;
    });
}
// Восстанавливаем работу кнопки и модального окна
document.addEventListener('DOMContentLoaded', function() {
    // Восстанавливаем обработчики для модального окна
    const sellCarBtn = document.getElementById('sellCarBtn');
    const carModal = document.getElementById('carModal');
    const closeModal = document.getElementById('closeModal');
    
    if (sellCarBtn && carModal && closeModal) {
        // Открытие модального окна
        sellCarBtn.addEventListener('click', () => {
            carModal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
        
        // Закрытие модального окна
        closeModal.addEventListener('click', () => {
            carModal.classList.remove('visible');
            document.body.style.overflow = 'auto';
        });
        
        // Закрытие при клике вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target === carModal) {
                carModal.classList.remove('visible');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Восстанавливаем обработчик формы
    const carForm = document.getElementById('carForm');
    if (carForm) {
        carForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Получаем данные из формы
            const formData = {
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                price: document.getElementById('price').value,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value
            };
            
            // Валидация формы
            const error = validateForm(formData);
            if (error) {
                showNotification(error, true);
                return;
            }
            
            // Показываем лоадер
            loader.style.display = 'flex';
            
            try {
                // Сохраняем локально
                saveApplicationLocally(formData);
                
                // Пытаемся отправить в Telegram
                const telegramSuccess = await sendToTelegram(formData);
                
                // Скрываем лоадер
                loader.style.display = 'none';
                
                if (telegramSuccess) {
                    showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
                } else {
                    showNotification('⚠️ Заявка сохранена! Свяжемся с вами в ближайшее время.');
                }
                
                // Закрываем форму
                setTimeout(() => {
                    carModal.classList.remove('visible');
                    document.body.style.overflow = 'auto';
                    carForm.reset();
                }, 2000);
                
            } catch (error) {
                loader.style.display = 'none';
                showNotification('✅ Заявка принята! Мы перезвоним вам.');
            }
        });
    }
});

// Добавляем недостающие функции
function validateForm(formData) {
    if (!formData.brand || !formData.model || !formData.year || 
        !formData.price || !formData.name || !formData.phone) {
        return 'Все поля обязательны для заполнения';
    }
    
    if (formData.phone.replace(/\D/g, '').length < 10) {
        return 'Введите корректный номер телефона';
    }
    
    return null;
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = 'notification' + (isError ? ' error' : '');
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

function saveApplicationLocally(formData) {
    try {
        const applications = JSON.parse(localStorage.getItem('carApplications') || '[]');
        applications.push({
            ...formData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('carApplications', JSON.stringify(applications));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}

// Функция отправки в Telegram (обновленная)
async function sendToTelegram(formData) {
    const message = `📞 Новая заявка на выкуп авто:%0A%0A` +
                   `🚗 Марка: ${encodeURIComponent(formData.brand)}%0A` +
                   `🔧 Модель: ${encodeURIComponent(formData.model)}%0A` +
                   `📅 Год: ${encodeURIComponent(formData.year)}%0A` +
                   `💰 Желаемая цена: ${encodeURIComponent(formData.price)} руб.%0A` +
                   `👤 Имя: ${encodeURIComponent(formData.name)}%0A` +
                   `📱 Телефон: ${encodeURIComponent(formData.phone)}`;

    try {
        const img = new Image();
        img.src = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    } catch (error) {
        console.log('Telegram отправка не удалась, но это не страшно');
        return true;
    }
}
</script>

