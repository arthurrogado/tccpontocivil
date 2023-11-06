import _Component from "./_component.js";

class Modal extends _Component {

    constructor(parent, title, content, buttons = []) {
        super(parent);

        this.title = title;
        this.content = content;
        this.buttons = buttons;

        this.element = document.createElement('div');
        this.element.classList.add('modal');

        this.css = `
            .modal {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .modal .box {
                background-color: #ffffff;
                border-radius: 0.5rem;
                width: 90%;
                max-width: 600px;
                display: flex;
                flex-direction: column;
            }

            .modal .box .header {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;

                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid var(--light-color-1);
            }

            .modal .box .header h3 {
                display: inline-block;
                margin: 0;
            }

            .modal .box .header button {
                background-color: var(--primary-color);
                color: #ffffff;
                border: none;
                border-radius: 0.5rem;
                padding: 0.5rem 1rem;
                cursor: pointer;
            }
            .modal .box .header button:hover {
                opacity: 0.8;
            }

            .modal .box .content {
                padding: 1rem;
            }

            .modal .box .footer {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;

                justify-content: flex-end;
                align-items: center;
                padding: 1rem;
                border-top: 1px solid var(--light-color-3);
            }

        `;

        this.setStyle(this.css);

        // Programing the element

        let box = document.createElement('div');
        box.classList.add('box');

        let header = document.createElement('div');
        header.classList.add('header');

        let h3 = document.createElement('h3');
        h3.innerHTML = this.title;

        let button = document.createElement('button');
        button.textContent = 'X';
        button.addEventListener('click', () => {
            this.element.remove();
        });

        header.append(h3);
        header.append(button);
        
        let contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        contentDiv.innerHTML = this.content;

        let footer = document.createElement('div');
        footer.classList.add('footer');

        this.buttons.forEach(btn => {
            let button = document.createElement('button');
            button.classList.add('btn', btn.class);
            button.textContent = btn.text;
            button.addEventListener('click', () => {
                btn.action();
            });
            footer.appendChild(button);
        });
        
        box.append(header);
        box.append(contentDiv);
        box.append(footer);
        
        this.element.append(box);
        this.render();

    }

    fecharTodosModais() {
        document.querySelectorAll('.box').forEach(box => {
            box.parentElement.remove();
        });
    }

}

export default Modal;