class infoBox {

    constructor(msg = 'Example with class', theme = 'info', timeout = 3000, parent = '.area-infos') {
        // Cria o elemento <style> e define seu conteúdo como o código CSS.

        let style = document.createElement('style');

        // make msg wrap if it is too long (more than 300px).
        // if it is too long, break line
        // get size of the msg in pixels
        let size = Number( msg.length ) * 8
        
        if (size > 300) {
            msg = msg.substring(0, 300) + '...';
        }

        // let _info = `
        //     background: #ffb1ab;
        //     padding: 20px;
        //     margin-bottom: 20px;
        //     border-radius: 10px;
        //     display: flex;
        //     justify-content: space-between;
        //     border: 1px solid #9e271e;
        // `
        // infoBox.style.cssText += _info;

        // Define a hash to be used as a class name.
        // This is to avoid conflicts with other elements.
        let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        style.textContent = `
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            :root {
                --danger: #ffb1ab;
                --danger_dark: #9e271e;
                --success: #b1ffb1;
                --success_dark: #1e9e27;
                --warning: #fffbb1;
                --warning_dark: #9e9e27;
                --info: #b1e1ff;
                --info_dark: #1e679e;
            }

            .infoBox${hash} {
                z-index: 9999;
                width: 300px;
                background-color: var(--${theme});
                padding: 15px;
                margin: 10px 10px 0 0;
                border-radius: 5px;
                border: 1px solid var(--${theme}_dark);
                display: flex;
                justify-content: space-between;
    
                position: relative;
            }
            .infoBox${hash} > button {
                background-color: transparent;
                border: none;
                color: var(--${theme}_dark);
                font-weight: bold;
                font-size: 1.2em;
                cursor: pointer;
                position: sticky;
                right: 5px;
            }
    
            .infoBox${hash}:before {
                content: "";
                height: 5px;
                width: 100%;
                background-color: var(--${theme}_dark);
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
    
                animation: progress ${timeout/1000}s linear;
                animation-fill-mode: forwards;
            }
    
            .infoBox${hash}:hover:before {
                /* no hover, pausar a animação */
                animation-play-state: paused;
                animation: none;
            }
    
            @keyframes progress {
                to {
                    width: 0%;
                }
            }

            .area-infos {
                position: fixed;
                top: 70px;
                right: 10px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-end;
            }

        `;

        let areaInfos = document.querySelector('.area-infos');
        if(!areaInfos) {
            let newAreaInfos = document.createElement('div');
            newAreaInfos.classList.add('area-infos');
            document.body.appendChild(newAreaInfos);
        }

        // Cria o elemento <div> e adiciona a classe 'infoBox'.
        let infoBox = document.createElement('div');
        infoBox.classList.add('infoBox'+hash);

        // Define o conteúdo do elemento <div>.
        let msgSpan = document.createElement('span');
        msgSpan.textContent = msg;
        infoBox.appendChild(msgSpan);

        // Cria o botão 'X'.
        let close = document.createElement('button');
        close.setAttribute('class', 'close');
        close.innerHTML = 'X';

        // Adiciona um ouvinte de evento para ocultar o elemento <div> quando o botão 'X' for clicado.
        close.addEventListener('click', () => {
            infoBox.style.display = 'none';
        });

        // Anexa o botão ao elemento <div>.
        infoBox.appendChild(close);

        // Anexa o elemento <style> ao cabeçalho (tag <head>) do documento.
        document.head.appendChild(style);

        // Anexa o elemento <div> ao elemento pai especificado.
        document.querySelector(parent).appendChild(infoBox);

        // Remove o elemento elemento infoBox após o timeout

        // Ouvinte de evento para cancelar a remoção quando o mouse entrar no elemento .infoBox.
        infoBox.addEventListener('mouseenter', () => {
            clearTimeout(removeTimeout);
        });

        infoBox.addEventListener('mouseleave', () => {
            removeTimeout = setRemoveTimeout();
        })

        // Função para agendar a remoção após o timeout.
        const setRemoveTimeout = () => {
            return setTimeout(() => {
                infoBox.remove();
            }, timeout);
        }

        var removeTimeout = setRemoveTimeout();

        return infoBox;
    }
}

export default infoBox;
