# Web App con Metered.ca y Flask

Este es un proyecto web que utiliza Flask para crear y validar salas de reunión a través de la API de Metered.ca.

## Requisitos

Tener instalado lo siguiente:

- Python 3.x
- Las bibliotecas listadas en `requirements.txt`

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Instala las dependencias necesarias utilizando `pip`:

    ```sh
    pip install -r requirements.txt
    ```

## Configuración

Antes de ejecutar la aplicación, asegúrate de configurar las siguientes variables de entorno:

- `METERED_SECRET_KEY`: Tu clave secreta de Metered.ca.
- `METERED_DOMAIN`: El dominio asociado a tu cuenta de Metered.ca.

Puedes configurar estas variables de entorno en un archivo `.env` en el directorio raíz del proyecto:

```env
METERED_SECRET_KEY=tu_clave_secreta
METERED_DOMAIN=tu_dominio_metered
