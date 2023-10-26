import _Component from "./_component.js";

class Badge extends _Component {
    constructor(parent, text, color = 'var(--primary-color)' ) {
        super(parent);
        this.element = document.createElement('span');
        this.element.className = 'badge';
        
        this.css = `
        .badge {
            background-color: ${color};
            color: #ffffff;
            padding: .3rem;
            border-radius: 2rem;
            margin: 10px 5px;
            cursor: pointer;
        }
        .badge:hover{
            opacity: 0.8;
        }
        `
        this.setStyle(this.css);
        // setting parameters
        this.text = text;
        
        // Programing the element
        let badge = document.createElement('span');
        badge.classList.add('badge');
        badge.textContent = this.text;

        
        this.element.append(badge);
        this.render();
        // return this.element;
    }


}

export default Badge;