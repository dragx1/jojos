document.addEventListener('DOMContentLoaded', () => { // <-- Добавлено ожидание загрузки DOM
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            const targetPane = document.getElementById(target);

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            targetPane.classList.add('active');
            button.classList.add('active');
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    barba.init({
        transitions: [{
            name: 'fade',
            leave(data) {
                return gsap.to(data.current.container, {opacity: 0, duration: 0.5});
            },
            enter(data) {
                return gsap.to(data.next.container, {opacity: 1, duration: 0.5});
            },
            once(data) {
                // Этот код выполнится только один раз при первой загрузке страницы.
                initTabs();  //  Вызываем функцию инициализации табов.
            }

        }]
    });

    function initTabs() {  //  Функция инициализации табов.
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabPanes = document.querySelectorAll('.tab-pane');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const target = button.dataset.target;
                    const targetPane = document.getElementById(target);

                    tabPanes.forEach(pane => {
                        pane.classList.remove('active');
                    });

                    tabButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });

                    targetPane.classList.add('active');
                    button.classList.add('active');
                });
            });
    }

});
