# Prueba técnica holdconet - Juan Pablo Sepúlveda


## Descripción
Esta página es el desarrollo de la prueba tecnica entregada por holdconet. La web consiste en una tabla que muestra datos de calles proporcionados por una API. Se utilizó Axios para realizar las llamadas a la API y obtener los datos, para su visualizacion se utilizaron componentes MUI.

La tabla permite ordenar cada una de las columnas mediante un método de ordenación. Además, presenta una opción de filtrado de datos y de creacion de calle.

La tabla también está configurada para permitir la paginación desde el cliente.

Finalmente, se implementó un diseño responsivo y se agregó la funcionalidad de modo claro y oscuro para mejorar la experiencia de visualización y accesibilidad en toda la web junto con alertas por medio de snackbars.


Para poder iniciarlizar la pagina web de manera correcta es necesario tener montado el server segun las indicaciones en :

    ```
    https://github.com/JuanPabloSQ/tech-interview-holdconet-server

    ``` 

## Instrucciones de depliegue

1. **Clonar el repositorio**
    ```bash
    git clone https://github.com/JuanPabloSQ/tech-interview-holdconet
    ```

2. **Generar un archivo `.env` en la raíz del proyecto con el siguiente contenido**

    ```
    VITE_API_URL={URL de API mencionada anteriormente}

    ```

3. **Instalar dependencias**

    ```bash
    npm install
    ```
4. **Ejecturas proyecto**

    ```bash
    npm run dev
    ```


## Tecnologias utilizadas

- Esta página web fue creada utilizando HTML5, Javascript, CSS, Vite + React, junto con las librerías Axios, MaterialUI
