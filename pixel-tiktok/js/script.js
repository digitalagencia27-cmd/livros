document.addEventListener('DOMContentLoaded', () => {

    // Pega todos os botões que não são o "Enviar Todos"
    const eventButtons = document.querySelectorAll('.btn[data-event]');
    const sendAllButton = document.getElementById('btn-send-all');

    // Função para mostrar feedback visual no botão
    const showButtonFeedback = (button) => {
        const originalText = button.innerText;
        button.innerText = '✅ Enviado!';
        button.classList.add('success');

        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('success');
        }, 2000); // Volta ao normal após 2 segundos
    };

    // Adiciona o evento de clique a cada botão de evento
    eventButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventName = button.dataset.event;

            // Aciona o evento do TikTok Pixel
            ttq.track(eventName);
            
            console.log(`Evento do TikTok acionado: ${eventName}`);

            // Mostra o feedback visual
            showButtonFeedback(button);
        });
    });

    // Lógica especial para o botão "Enviar Todos"
    if (sendAllButton) {
        sendAllButton.addEventListener('click', () => {
            const standardEvents = [
                'ViewContent',
                'Search',
                'AddToWishlist',
                'AddToCart',
                'InitiateCheckout',
                'AddPaymentInfo',
                'CompletePayment'
            ];

            console.log('Enviando todos os eventos padrão...');
            showButtonFeedback(sendAllButton);
            
            // Dispara cada evento com um pequeno intervalo
            standardEvents.forEach((event, index) => {
                setTimeout(() => {
                    ttq.track(event);
                    console.log(`-> Evento ${index + 1}/${standardEvents.length}: ${event} acionado.`);
                }, index * 300); // 300ms de intervalo entre cada evento
            });
        });
    }

});