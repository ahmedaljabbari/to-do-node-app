document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-me")) {
        let x = prompt("Edit this item: ", e.target.parentElement.parentElement.querySelector('.item-text').innerText);

        if(x) {
            axios.post("/update", {
                title: x,
                id: e.target.dataset.itemid
            })
            .then((response) => {
            console.log(response);
            e.target.parentElement.parentElement.querySelector('.item-text').innerText = x
            })
            .catch((error) => {
            console.error(error);
            });
        }
    }

    if (e.target.classList.contains("delete-me")) {
        let x = confirm("Are you sure you want to delete this item ", e.target.parentElement.parentElement.querySelector('.item-text').innerText) + " ?";

        if(x) {
            axios.post("/delete-item", {
                id: e.target.dataset.itemid
            })
            .then((response) => {
            console.log(response);
            e.target.parentElement.parentElement.remove() 
            })
            .catch((error) => {
            console.error(error);
            });
        }
    }

    if (e.target.classList.contains("insert-btn")) {
        e.preventDefault();
        let txt = document.getElementById('insert-txt').value;
        if(txt) {
            axios.post("/add-item", {
                title: txt
            })
            .then((response) => {
            console.log(response.data);
            const childElement = document.createElement('li');
                childElement.setAttribute('class', 'list-group-item list-group-item-action d-flex align-items-center justify-content-between');
                childElement.innerHTML = `<span class="item-text">${txt}</span>
                <div>
                <button data-itemid="${response.data.insertedId}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-itemid="${response.data.insertedId}" class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>`;
                document.getElementById('myList').appendChild(childElement);
                document.getElementById('insert-txt').value = "";
                document.getElementById('insert-txt').focus();
            })
            .catch((error) => {
            console.error(error);
            });
        }
    }
});
