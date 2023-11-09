import _Component from "./_component.js";

class Table extends _Component {

    constructor(parent, data, columns, headers = [], actions = [], hasSearchBar = true) {

        // example of actions:
        // [
        //     {
        //         text: 'Visualizar',
        //         action: (id) => {
        //             httpClient.navigateTo('/escritorio/visualizar', {id: id})
        //         }
        //     },
        //     {
        //         text: '<i class="fas fa-trash"></i>',
        //         action: (id) => {
        //             httpClient.makeRequest('/api/escritorio/deletar', {id: id})
        //         }
        //     }
        // ]


        super(parent);
        this.element = document.createElement('div');
        // Set the class of the Element
        this.element.classList.add('tableBox');
        this.data = data;
        this.columns = columns;
        this.headers = headers != '' ? headers : columns;
        this.actions = actions;

        // Then set the style with Element class
        this.css = `
            .tableBox {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
            }

            .tableBox input {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #dddddd;
                border-radius: 0.2rem;
            }
            .tableBox input:focus {
                outline: none;
            }

            .tableBox table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.9rem;
                font-family: sans-serif;

                box-shadow: 0 0 1px rgb(0, 0, 0);
                boder-radius: 0.2rem;
            }

            .tableBox table thead th {
                border: 1px solid #000000;
                padding: 1rem;
                font-weight: bold;
                font-size: 1rem;
                text-align: center;
                background-color: var(--primary-color);
                color: white;
            }

            .tableBox table tbody td {
                border: 1px solid #000000;
                padding: 0.5rem;
                text-align: center;
            }

            .tableBox table tbody tr:nth-child(even) {
                background-color: var(--light-color-4);
            }
            .tableBox table tbody tr:nth-child(odd) {
                background-color: var(--light-color-3);
            }

            .tableBox table tbody tr {
                transition: all 0.2s ease;
            }
            .tableBox table tbody tr:hover {
                background-color: var(--light-color-1);
            }

        `
        this.setStyle(this.css);
        // setStyle adds the hash to the classes

        // Setting Element

        // Search bar
        if(hasSearchBar) {
            let searchBar = document.createElement('input');
            searchBar.type = 'text';
            searchBar.placeholder = 'Search...';
            searchBar.addEventListener('input', event => {
                let query = event.target.value;
    
                let filteredData = data.filter(element => {
                    console.log('element: ', element)
                    for(let column of columns) {
                        if(element[column].toString().toLowerCase().includes(query.toLowerCase())) return true;
                    }
                    return false;
                })
                
                // this.element.querySelect('table').remove();
                // this.renderTable(filteredData, this.headers);
                
                // Ocultar as linhas que não contém o query
                this.element.querySelectorAll('table tbody tr').forEach(tr => {
                    if(filteredData.find(element => element.id == tr.dataset.id)) {
                        tr.style.display = 'table-row';
                    } else {
                        tr.style.display = 'none';
                    }
                })

            })
            this.element.append(searchBar);
        }
        
        // Table
        this.renderTable(data, this.headers);
        
        this.render();

    }

    renderTable(data, headers) {
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let tr = document.createElement('tr');

        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            tr.append(th);
        })

        thead.append(tr);
        table.append(thead);

        // header actions
        if(this.actions.length > 0) {
        let th = document.createElement('th');
        th.textContent = 'Ações';
        th.colSpan = this.actions.length;
            tr.append(th);
        }

        data?.forEach(element => {
            let row = document.createElement('tr');
            row.dataset.id = element?.id;
            this.columns.forEach(column => {
                let cell = document.createElement('td');
                cell.textContent = element[column];
                row.append(cell);
            })

            // actions
            if(this.actions.length > 0) {


                let cell = document.createElement('td');
                this.actions.forEach(action => {
                    let button = document.createElement('button');
                    button.classList.add('btn', 'btn-primary');
                    button.innerHTML = action.text;
                    button.addEventListener('click', () => {
                        action.action(element.id);
                    })
                    cell.append(button);
                });
                row.append(cell);
            };

            tbody.append(row);
        })
        table.append(tbody);
        this.element.append(table);
    }

    setData(data) {
        this.data = data;
        this.renderTable(data, this.headers);
    }

}

export default Table;