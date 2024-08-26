# Prueba técnica Holdconet - Juan Pablo Sepúlveda


## Descripción
Esta página es el desarrollo de la prueba técnica entregada por Holdconet. La web consiste en una tabla que muestra datos de calles proporcionados por una API. Se utilizó Axios para realizar las llamadas a la API y obtener los datos; para su visualización se utilizaron componentes MUI.

La tabla permite ordenar cada una de las columnas mediante un método de ordenación. Además, incluye una función de búsqueda optimizada con un debouncer para evitar múltiples llamadas innecesarias a la API, filtrado de datos y de creación de calles.

La tabla también está configurada para permitir la paginación desde el cliente.

Finalmente, se implementó un diseño responsivo y se agregó la funcionalidad de modo claro y oscuro para mejorar la experiencia de visualización y accesibilidad en toda la web, junto con alertas por medio de snackbars.


## Instrucciones de depliegue

1. **Iniciar server**

    Para poder inicializar la página web de manera correcta, es necesario tener montado el servidor según las indicaciones en: https://github.com/JuanPabloSQ/tech-interview-holdconet-server


2. **Clonar el repositorio**
    ```bash
    git clone https://github.com/JuanPabloSQ/tech-interview-holdconet
    ```

3. **Generar un archivo `.env` en la raíz del proyecto con el siguiente contenido**

    ```
    VITE_API_URL={URL de API mencionada anteriormente}

    ```

4. **Instalar dependencias**

    ```bash
    npm install
    ```

5. **Ejecturas proyecto**

    ```bash
    npm run dev
    ```


## Tecnologias utilizadas

- Esta página web fue creada utilizando HTML5, Javascript, CSS, Vite + React, junto con las librerías Axios, MaterialUI
