import _Component from "./_component.js";

class Button extends _Component {
    constructor(parent, text, color = 'var(--primary-color)' ) {
        super(parent);
        this.element = document.createElement('button');
        this.element.className = 'button';
        
        this.css = `
        .button {
            background-color: ${color};
            color: #ffffff;
            padding: .7rem 1rem;
            border-radius: .5rem;
            margin: .5rem 5px;
            cursor: pointer;
        }
        .button:hover{
            opacity: 0.8;
        }
        `
        this.setStyle(this.css);
        // setting parameters
        this.text = text;
        
        // Programing the element
        this.element.textContent = this.text;
        
        this.render();
        // return this.element;
    }


}

export default Button;