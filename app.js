const fileInput = document.querySelector('#file');
const preview = document.querySelector('#preview');
const reader = new FileReader();

function returnErrors(errors){
    if(document.querySelector('#errors')){
        document.querySelector('form').removeChild(document.querySelector('#errors'));
    }
    const errorUl = document.createElement('ul');
    errorUl.id = 'errors';
    errors.map(error => {
        const li = document.createElement('li');
        li.innerText = error;
        li.style.color = 'red';
        errorUl.appendChild(li);
        return li;
    })
    document.querySelector('form').appendChild(errorUl)
}

function handleSelected(e) {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        reader.addEventListener('load', (e) => {
            if (e.type === "load") {
                preview.src = reader.result;
            }
        });
        reader.readAsDataURL(selectedFile);
    }
}

fileInput.addEventListener('change', handleSelected);



document.querySelector('#submit').addEventListener('click', function(event){
    event.preventDefault();
    const name = document.querySelector('#name').value;
    const surname = document.querySelector('#surname').value;
    const type = document.querySelector('#type').value;
    const id = document.querySelector('#idNum').value;
    const picture = document.querySelector('#file').files[0];
    const errors = [];
    const errorUl = document.createElement('ul');
    errorUl.id = 'errors';
    if(type==='osoba' &&  id.length!==11){
            errors.push('Numer PESEL musi mieć 11 cyfr'); 
    }
    if(type==='firma' &&  id.length!==10){
        errors.push('Numer NIP musi mieć 10 cyfr'); 
    }   
    if(preview.width!== preview.height){
            errors.push('Zdjęcie musi być kwadratem');
    }
    if(!name || !surname || !type){
        errors.push('Żadne pole nie może być puste');
    }
    if(errors.length === 0){
        if(document.querySelector('#errors')){
            document.querySelector('form').removeChild(document.querySelector('#errors'));
        }
        fetch('https://localhost:60001/Contractor/Save', {method: 'POST', body: JSON.stringify({
            name,
            surname,
            type,
            id,
            picture
        })})
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(error => {
            console.error(error);
            returnErrors(['Nie znaleziono metody zapisu'])
        })
    }else{
        returnErrors(errors);
    }
    
})

