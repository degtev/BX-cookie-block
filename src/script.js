(function(window, document, BX) {
    if (!BX) return;

    const myCookieNotice = {

        cookieName: 'cookie-site-confirm',

        getCookie(name) {
            const matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },

        setCookie(name, value, options = {}) {
            options = {
                path: '/',
                'max-age': 60 * 60 * 24 * 365,
                ...options
            };
            let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            for (let optionKey in options) {
                updatedCookie += "; " + optionKey;
                let optionValue = options[optionKey];
                if (optionValue !== true) {
                    updatedCookie += "=" + optionValue;
                }
            }
            document.cookie = updatedCookie;
        },

        show(options = {}) {
            if (document.querySelector('.cookie-block')) return;
            const {
                text = '',
                showClose = true,
                closeBtnContent = '',
                confirmText = '',
                unconfirmText = '',
                showIfCookieExists = false
            } = options;

            if (!showIfCookieExists && this.getCookie(this.cookieName)) return;

            const block = BX.create('div', {
                props: { className: 'cookie-block' }
            });

            const container = BX.create('div', {
                props: { className: 'cookie-block__container' }
            });

            // Кнопка "X"
            if (showClose) {
                const closeBtn = BX.create('div', {
                    props: { className: 'cookie-block__close' },
                    html: closeBtnContent
                });
                BX.bind(closeBtn, 'click', () => {

                    if (block.parentNode) block.parentNode.removeChild(block);
                });
                container.appendChild(closeBtn);
            }

            // Основной текст
            const content = BX.create('div', {
                html: text
            });
            container.appendChild(content);

            // Кнопки подтверждения
            if (confirmText || unconfirmText) {
                const buttons = BX.create('div', {
                    props: { className: 'cookie-block__buttons' }
                });

                if (unconfirmText) {
                    const unconfirmBtn = BX.create('div', {
                        props: { className: 'cookie-block__unconfirm' },
                        html: unconfirmText
                    });
                    BX.bind(unconfirmBtn, 'click', () => {
                        if (block.parentNode) block.parentNode.removeChild(block);
                    });
                    buttons.appendChild(unconfirmBtn);
                }

                if (confirmText) {
                    const confirmBtn = BX.create('div', {
                        props: { className: 'cookie-block__confirm' },
                        html: confirmText
                    });
                    BX.bind(confirmBtn, 'click', () => {
                        this.setCookie(this.cookieName, '1');
                        if (block.parentNode) block.parentNode.removeChild(block);
                    });
                    buttons.appendChild(confirmBtn);
                }

                container.appendChild(buttons);
            }

            block.appendChild(container);
            document.body.appendChild(block);
        }
    };

    window.myCookieNotice = myCookieNotice;

})(window, document, BX);