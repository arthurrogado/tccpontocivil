import siglas_estados from "/App/Utils/siglas_estados.js";
import HttpClient from "/App/App.js";
const httpClient = new HttpClient();

const encargo = document.querySelector('#encargo')
encargo.querySelectorAll('span').forEach(span => {
	span.addEventListener('click', () => {
		encargo.querySelector('span[selected]').removeAttribute('selected');
		span.setAttribute('selected', '');
	});
});

const btnCriar = document.querySelector('#criarOrcamento');
btnCriar.addEventListener('click', () => {

	if (!httpClient.verifyObrigatoryFields()) return;

	const formdata = new FormData(document.querySelector('#formCriarOrcamento'));

	const valueDesonerado = encargo.querySelector('span[selected]').getAttribute('value');
	formdata.append('desonerado', valueDesonerado);

	httpClient.makeRequest('/api/orcamento/criar', formdata);
});


// Preencher select de meses de referência do SINAPI
httpClient.makeRequest('/api/item/meses_sinapi')
.then(response => {
	if (response.meses_referencia) {
		const meses = response.meses_referencia;
		meses.forEach(mes_referencia => {
			let mes = mes_referencia.mes_referencia;

			let option = document.createElement('option');
			option.value = mes;
			// 2023-09-01 -> 09/2023
			option.innerHTML = mes.split('-')[1] + '/' + mes.split('-')[0];
			document.querySelector('[name="data_sinapi"]').appendChild(option);
		})
	}
});

// Preencher select de estados do SINAPI
httpClient.makeRequest('/api/item/estados_sinapi')
.then(response => {
	if(response.estados_referencia) {
		const estados = response.estados_referencia;
		estados.forEach(estado_referencia => {
			let estado = estado_referencia.estado_referencia;

			let option = document.createElement('option');
			option.value = estado;
			console.log('===========================')
			console.log(siglas_estados)
			console.log(estado)
			console.log(siglas_estados.siglas_estados)
			console.log('===========================')

			option.innerHTML = siglas_estados[estado];
			document.querySelector('[name="estado"]').appendChild(option);
		});
	}
})