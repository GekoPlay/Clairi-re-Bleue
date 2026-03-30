
const btnLangue = document.getElementById('langage');
const divFr = document.getElementById('fr');
const divEn = document.getElementById('en');


btnLangue.addEventListener('click', () => {
    
    if (divFr.style.display !== 'none') {
        divFr.style.display = 'none';    
        divEn.style.display = 'block';   
        btnLangue.innerText = 'Passer en Français';
    } 
    
    else {
        divFr.style.display = 'block';   
        divEn.style.display = 'none';    
        btnLangue.innerText = 'Switch to English'; 
    }
});