# Установка

Перед использования необходимо:

-   зарегистрироваться на [сайте](https://fusionbrain.ai/)
-   создать API [ключ](https://fusionbrain.ai/keys/)

## Docker compose

Создать файл `docker-compose.yml` со следующим содержимым:

<<< ../docker/docker-compose.yml

Создайте файл `.env` с содержимым:

<<< ../docker/docker-compose.env

Укажите следующие в нём переменные окружения:

-   `API_KEY` - ключ fusionbrain
-   `SECRET_KEY` - закрытый ключ fusionbrain
-   `IMAGES_HOST` - URL загрузки картинок по http, например https://example.com
-   `CF_TUNNELL_KEY` - ключ тунеля cloudflare
-   `WATCHTOWER_HTTP_API_TOKEN` - ключ для хука обновления докер образа
