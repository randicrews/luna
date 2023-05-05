var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var edit = document.getElementsByClassName("fa-edit");
var trash = document.getElementsByClassName("fa-trash");

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const context = this.parentNode.parentNode.childNodes[1].innerText
        const date = this.parentNode.parentNode.childNodes[4].innerText
        const symptom = this.parentNode.parentNode.childNodes[7].innerText
        fetch('dates', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'context': context,
            'date': date,
            'symptoms': symptom,
            
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

Array.from(edit).forEach(function (element) {
  element.addEventListener("click", function () {
    element.style.display = 'none';
    var id = element.parentNode.getAttribute('data-id');
    // Create a form element
    const form = document.createElement('form');
    // form.action = `/date/${element.parentNode.getAttribute('data-id')}`
    // form.method = 'put'

     // Create a text input for the context
     const contextInput = document.createElement('input')
     contextInput.type =  'text'
     contextInput.value = this.parentNode.parentNode.childNodes[1].innerText
     contextInput.name = 'context'
     contextInput.id = 'context-input'
     contextInput.required =true
     form.appendChild(contextInput)

    // Create a text input for the date
    const dateInput = document.createElement('input')
    dateInput.type = 'date'
    dateInput.value = this.parentNode.parentNode.childNodes[4].innerText
    dateInput.id = 'date-input'
    dateInput.name = 'date'
    dateInput.required =true
    form.appendChild(dateInput)

    // Create a text input for the symptom
    const symptomInput = document.createElement('input')
    symptomInput.type = 'text'
    symptomInput.id = 'symptoms-input'
    symptomInput.name = 'symptom'
    symptomInput.required =true
    symptomInput.placeholder = 'Enter symptom'
    symptomInput.value = this.parentNode.parentNode.childNodes[7].innerText

    console.log(this.parentNode.parentNode.childNodes[7].innerText, '1', this.parentNode.parentNode.childNodes[7], '2')

    form.appendChild(symptomInput);

    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Update';
    submitButton.classList.add('btn-default')
    submitButton.setAttribute('data-id', id) 
    form.appendChild(submitButton);


    // Insert the form after the edit icon's parent element
    const message = element.parentNode;
    message.insertBefore(form, message.childNodes[3]);

    // Add a submit event listener to the form
    form.addEventListener('submit', (event) => {
      // Prevent the form from submitting
      event.preventDefault();
      // Get the updated values from the form
      const context = document.querySelector('#context-input').value;
      const date = document.querySelector('#date-input').value;
      const symptoms = document.querySelector('#symptoms-input').value
      const id2 = event.target.parentNode.getAttribute('data-id');
      // TODO: Update the post with the new values
      console.log(id2, 'id2')
      fetch(`/date/${id2}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context: context,
          date: date,
          symptoms: symptoms
        })
      })
      .then(response => {
        if (response.ok) {
          location.reload(); // refresh the page to show the updated post
        } else {
          console.log('Error updating post');
        }
      });

      // Remove the form from the DOM
      form.remove();

      // Show the edit icon again
    })
  });
});
