export default function Botao(parent = 'body') {
    let botao = document.createElement('button')
    botao.id = 'componenteBotao'
    botao.textContent = 'BOTÃO'
    botao.onclick = () => {
        if(confirm("Quer deletar este botão?")) {
            botao.remove()
        }
    }
    document.querySelector(parent).append(botao)
}