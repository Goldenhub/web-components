
// select component
class SelectUI extends HTMLElement
{
    static observedAttributes = ["aria-expanded", "name"]
    shadow = null;
    dropdown = null;
    options = [];
    constructor(){
        self = super();
    }

    connectedCallback(){
        this.setAttribute('role', 'listbox');
        this.shadow = this.attachShadow({mode: 'open'});
        
        
        this.setAttribute('aria-expanded', 'false');
        
        let select = document.getElementById('select-template');
        this.shadow.append(select.content.cloneNode(true));
        this.dropdown = this.shadow.querySelector('[data-dropdown');

        this.addEventListener('click', function() {
            self.setAttribute('aria-expanded', self.getAttribute('aria-expanded') === "false" ? "true" : "false");
        });

        this.firstElementChild.setAttribute('aria-selected', 'true');
        this.firstElementChild.setAttribute('selected', 'true');

        this.options = this.options.concat([...document.querySelectorAll('option-ui')]);

    }   

    
    disconnectedCallback() {    
        this.shadow = null;
        this.dropdown = null;
        this.options = [];
    }

    attributeChangedCallback(name, oldVal, newVal){
        if(this.dropdown && name === "aria-expanded"){
            this.dropdown.style.display = (newVal === "false") ?  'none' : "unset";
        }
    }
}

class OptionUI extends HTMLElement {
    static observedAttributes = ['value', 'aria-selected', 'selected'];
    constructor(){
        super();
        this.setAttribute('role', 'option');
        this.setAttribute('aria-selected', 'false');
        this.setAttribute('selected', 'false');
    }

    connectedCallback(){
        
        let textNode = document.createTextNode(this.textContent);
        let style = document.getElementById('option-template');


        let shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(style.content.cloneNode(true))
        shadowRoot.appendChild(textNode)

        this.addEventListener('click', function(){
            for(let option of this.parentElement.options){
                option.setAttribute("aria-selected", "false")
                option.setAttribute("selected", "false")
            }
            this.setAttribute('selected', 'true')
            this.setAttribute('aria-selected', 'true')
        })
    }

    attributeChangedCallback(name, oldVal, newVal){
        if(newVal === "true" && (name === 'selected' || name === 'aria-selected')){
            let option = Array.from(this.parentElement.options).find(option => (option.attributes.selected?.nodeValue === newVal)) ?? this.parentElement.options[0];
            this.parentElement.shadowRoot.querySelector('[aria-hidden]').textContent = option.textContent
        }
    }
}

customElements.define("select-ui", SelectUI);
customElements.define("option-ui", OptionUI);