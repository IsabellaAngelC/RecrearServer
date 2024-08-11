document.getElementById("fetch-button").addEventListener("click", fetchData);
document.getElementById("publicar").addEventListener("click", createPost);
document.getElementById("button").addEventListener("click", deletePost);

async function fetchData() {
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:3004/posts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    renderErrorState();
  }
}


async function fetchUsers() {
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:3004/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("users", data);
  } catch (error) {
    renderErrorState();
  }
}

async function createPost(event) {
  event.preventDefault();
  
  const userName = document.getElementById("user-name").value;
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  const postData = {
    userName,
    title,
    body
  };

  try {
    const response = await fetch("http://localhost:3004/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    const newPost = await response.json();
    console.log("Post creado exitosamente:", newPost);

    // Crear un nuevo contenedor para mostrar el post
    const postContainer = document.createElement("div");
    postContainer.className = "postContainer";

    const userNameElement = document.createElement("h3");
    userNameElement.textContent = `Usuario: ${newPost.userName}`;

    const titleElement = document.createElement("h4");
    titleElement.textContent = `Título: ${newPost.title}`;

    const bodyElement = document.createElement("p");
    bodyElement.textContent = newPost.body;

    // Crear el botón de eliminar
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", async () => {
      try {
        const deleteResponse = await fetch(`http://localhost:3004/posts/${newPost.id}`, {
          method: "DELETE"
        });

        if (!deleteResponse.ok) {
          throw new Error("Failed to delete post");
        }

        // Remover el post del DOM
        postContainer.remove();
        console.log("Post eliminado exitosamente:", newPost.id);
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      }
    });

    // Añadir elementos al contenedor del post
    postContainer.appendChild(userNameElement);
    postContainer.appendChild(titleElement);
    postContainer.appendChild(bodyElement);
    postContainer.appendChild(deleteButton);

    // Mostrar el post recién creado debajo del formulario
    document.querySelector(".form-container").appendChild(postContainer);

    // Limpiar el formulario
    document.getElementById("post-form").reset();

  } catch (error) {
    console.error("Error:", error);
  }
}



async function deletePost(id) {
  try {
    const response = await fetch(`http://localhost:3004/posts/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    // Refresh posts after deletion
    fetchData();
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Loading...</p>";
  console.log("Loading...");
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data

  // Simulación de usuarios
  const usuarios = [
    { userId: 4, name: "John" },
    { userId: 5, name: "Jane" },
    { userId: 6, name: "Juan" },
    { userId: 7, name: "Pedro" },
    { userId: 8, name: "Pancrasio" },
    { userId: 9, name: "Pompilio" },
    { userId: 10, name: "Isa" }
  ];
  
  if (data.length > 0) {
    data.forEach((item) => {
      const itemUserId = Number(item.userId);
      const usuario = usuarios.find((usuario) => usuario.userId === itemUserId);

      if (usuario) {
        item.userName = usuario.name;
      } else {
        item.userName = "Desconocido"; // Valor por defecto si no se encuentra el usuario
      }

      const div = document.createElement("div");
      div.className = "item";

      const userNameElement = document.createElement("h3");
      userNameElement.textContent = `Usuario: ${item.userName}`;

      const titleElement = document.createElement("h4");
      titleElement.textContent = `Título: ${item.title}`;

      const bodyElement = document.createElement("p");
      bodyElement.textContent = item.body;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Borrar";
      deleteButton.onclick = () => deletePost(item.id);

      div.appendChild(userNameElement);
      div.appendChild(titleElement);
      div.appendChild(bodyElement);
      div.appendChild(deleteButton);

      container.appendChild(div);
    });
  }
}
