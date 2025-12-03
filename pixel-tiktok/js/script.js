document.addEventListener('DOMContentLoaded', () => {

    // --- Referências aos Elementos do DOM ---
    const pixelIdInput = document.getElementById('pixel-id-input');
    const activateButton = document.getElementById('btn-activate-pixel');
    const fillRandomButton = document.getElementById('btn-fill-random');
    const fillProductRandomButton = document.getElementById('btn-fill-product-random');
    const eventButtons = document.querySelectorAll('.btn[data-event]');
    const sendAllButton = document.getElementById('btn-send-all');

    // --- Estado da Aplicação ---
    let isPixelActive = false;

    // --- Funções de Utilidade ---

    const sha256 = async (message) => {
        const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    /**
     * Gera dados de produto aleatórios e realistas.
     */
    const fillRandomProductData = () => {
        const productNames = ['Tênis Esportivo Pro', 'Fone de Ouvido Bluetooth', 'Mochila Urbana', 'Relógio Inteligente', 'Câmera Digital Compacta'];
        const productCategories = ['Eletrônicos', 'Vestuário', 'Acessórios', 'Esportes', 'Tecnologia'];
        
        const randomSku = `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const randomName = productNames[Math.floor(Math.random() * productNames.length)];
        const randomCategory = productCategories[Math.floor(Math.random() * productCategories.length)];
        const randomPrice = (Math.random() * 1000 + 50).toFixed(2);
        const randomQuantity = Math.floor(Math.random() * 5) + 1;
        const randomType = Math.random() > 0.5 ? 'product' : 'product_group';

        document.getElementById('content-id').value = randomSku;
        document.getElementById('content-name').value = randomName;
        document.getElementById('content-category').value = randomCategory;
        document.getElementById('content-price').value = randomPrice;
        document.getElementById('content-quantity').value = randomQuantity;
        document.getElementById('content-type').value = randomType;
    };

    /**
     * Preenche todos os campos do formulário com dados aleatórios.
     */
    const fillRandomData = () => {
        const randomNames = ['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Souza'];
        const randomDomains = ['exemplo.com', 'teste.net', 'email.org'];
        const randomStreets = ['Rua das Flores', 'Avenida Principal', 'Alameda dos Anjos', 'Travessa da Esperança'];
        const randomCities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília'];
        const randomUtmSource = ['google', 'facebook', 'tiktok', 'newsletter'];
        const randomUtmMedium = ['cpc', 'social', 'email', 'referral'];
        const randomUtmCampaign = ['promocao_verao', 'lançamento_produto', 'black_friday', 'venda_2024'];

        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        const nameParts = randomName.toLowerCase().replace(' ', '.');
        const randomDomain = randomDomains[Math.floor(Math.random() * randomDomains.length)];
        const randomPhone = `+55${11 + Math.floor(Math.random() * 90)}${98765432 + Math.floor(Math.random() * 1000000)}`;
        const randomStreet = randomStreets[Math.floor(Math.random() * randomStreets.length)];
        const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
        const randomExternalId = `user_${Math.random().toString(36).substring(2, 9)}`;

        document.getElementById('email').value = `${nameParts}@${randomDomain}`;
        document.getElementById('phone').value = randomPhone;
        document.getElementById('name').value = randomName;
        document.getElementById('address').value = `${randomStreet}, ${Math.floor(Math.random() * 999) + 1}, ${randomCity}`;
        document.getElementById('external-id').value = randomExternalId;
        document.getElementById('utm-source').value = randomUtmSource[Math.floor(Math.random() * randomUtmSource.length)];
        document.getElementById('utm-medium').value = randomUtmMedium[Math.floor(Math.random() * randomUtmMedium.length)];
        document.getElementById('utm-campaign').value = randomUtmCampaign[Math.floor(Math.random() * randomUtmCampaign.length)];
    };

    /**
     * Coleta e hasheia os dados do formulário de correspondência avançada.
     */
    const getAdvancedMatchingData = async () => {
        const data = {};
        if (document.getElementById('email').value) data.email = await sha256(document.getElementById('email').value);
        if (document.getElementById('phone').value) data.phone = await sha256(document.getElementById('phone').value);
        if (document.getElementById('name').value) data.name = await sha256(document.getElementById('name').value);
        if (document.getElementById('address').value) data.address = await sha256(document.getElementById('address').value);
        if (document.getElementById('external-id').value) data.external_id = await sha256(document.getElementById('external-id').value);
        return data;
    };

    /**
     * Coleta os dados do produto para enviar como parâmetros do evento.
     */
    const getProductData = () => {
        const contentId = document.getElementById('content-id').value;
        const contentName = document.getElementById('content-name').value;
        const contentCategory = document.getElementById('content-category').value;
        const contentPrice = document.getElementById('content-price').value;
        const contentQuantity = document.getElementById('content-quantity').value;
        const contentType = document.getElementById('content-type').value;

        // Sempre retorna um objeto com content_id, mesmo que vazio
        return {
            content_id: contentId || `DEFAULT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            content_name: contentName || undefined,
            content_category: contentCategory || undefined,
            content_type: contentType,
            value: parseFloat(contentPrice) || 0,
            currency: 'BRL',
            quantity: parseInt(contentQuantity) || 1
        };
    };
    
    const showButtonFeedback = (button, successText = '✅ Enviado!') => {
        const originalText = button.innerText;
        button.innerText = successText;
        button.classList.add('success');
        setTimeout(() => { button.innerText = originalText; button.classList.remove('success'); }, 2000);
    };

    // --- Lógica Principal ---

    const activatePixel = () => {
        const pixelId = pixelIdInput.value.trim();
        if (!pixelId) {
            alert('Por favor, insira um Pixel ID válido.');
            return;
        }

        const script = document.createElement('script');
        script.innerHTML = `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('${pixelId}');
              ttq.page();
            }(window, document, 'ttq');
        `;
        document.head.appendChild(script);

        isPixelActive = true;
        activateButton.innerText = '✅ Pixel Ativado!';
        activateButton.disabled = true;
        pixelIdInput.disabled = true;

        eventButtons.forEach(btn => btn.disabled = false);
        sendAllButton.disabled = false;

        console.log(`Pixel ${pixelId} ativado com sucesso!`);
    };

    const triggerTiktokEvent = async (eventName, button) => {
        if (!isPixelActive) {
            alert('Ative o pixel primeiro!');
            return;
        }

        // Combina dados de correspondência avançada com dados do produto
        const advancedData = await getAdvancedMatchingData();
        const productData = getProductData();
        
        // Para eventos que não precisam de dados de produto, envia apenas os dados avançados
        let eventData = { ...advancedData };
        
        // Adiciona dados do produto para eventos relevantes
        if (['ViewContent', 'AddToWishlist', 'AddToCart', 'InitiateCheckout', 'CompletePayment'].includes(eventName)) {
            eventData = { ...eventData, ...productData };
        }
        
        // Para o evento CompletePayment, garante que email e phone sejam incluídos
        if (eventName === 'CompletePayment') {
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            if (email) eventData.email = await sha256(email);
            if (phone) eventData.phone = await sha256(phone);
            
            console.log('Dados do evento CompletePayment:', eventData);
        }
        
        ttq.track(eventName, eventData);
        console.log(`Evento acionado: ${eventName}`, eventData);
        showButtonFeedback(button);
    };

    // --- Event Listeners ---
    activateButton.addEventListener('click', activatePixel);
    fillRandomButton.addEventListener('click', fillRandomData);
    fillProductRandomButton.addEventListener('click', fillRandomProductData);

    eventButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventName = button.dataset.event;
            triggerTiktokEvent(eventName, button);
        });
    });

    sendAllButton.addEventListener('click', async () => {
        if (!isPixelActive) return;
        const standardEvents = ['ViewContent', 'Search', 'AddToWishlist', 'AddToCart', 'InitiateCheckout', 'AddPaymentInfo', 'CompletePayment'];
        const advancedData = await getAdvancedMatchingData();
        const productData = getProductData();
        
        showButtonFeedback(sendAllButton, '🚀 Enviando Tudo...');
        standardEvents.forEach((event, index) => {
            setTimeout(async () => {
                let eventData = { ...advancedData };
                
                // Adiciona dados do produto para eventos relevantes
                if (['ViewContent', 'AddToWishlist', 'AddToCart', 'InitiateCheckout', 'CompletePayment'].includes(event)) {
                    eventData = { ...eventData, ...productData };
                }
                
                // Para o evento CompletePayment, garante que email e phone sejam incluídos
                if (event === 'CompletePayment') {
                    const email = document.getElementById('email').value;
                    const phone = document.getElementById('phone').value;
                    
                    if (email) eventData.email = await sha256(email);
                    if (phone) eventData.phone = await sha256(phone);
                }
                
                ttq.track(event, eventData); 
                console.log(`-> Evento ${index + 1}: ${event}`, eventData); 
            }, index * 300);
        });
    });

});
