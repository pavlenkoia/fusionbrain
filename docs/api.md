# API

## Общее описание

Для взаимодействия с сервисом необходимо выполнить следующие шаги:

1. Отправить запрос на генерацию изображения, который возвращает уникальный идентификатор (UUID) для отслеживания процесса генерации.
2. Периодически опрашивать состояние генерации по этому идентификатору до тех пор, пока изображение не будет готово.

## Генерация изображения

### Метод: `POST`

**URL:** `/api/generate`

**Запрос:**

Тело запроса представляет собой JSON-объект с обязательными и необязательными полями:

```json
{
    "prompt": "Пушистый кот в очках",
    "width": 480,
    "height": 480
}
```

**Поля запроса:**

-   `prompt` (строка): Текстовый промпт для генерации изображения. Обязательное поле.
-   `width` (целое число): Ширина генерируемого изображения в пикселях. Необязательное поле; значение по умолчанию — 768.
-   `height` (целое число): Высота генерируемого изображения в пикселях. Необязательное поле; значение по умолчанию — 768.

**Ответ:**

В случае успешного приема запроса сервер вернет JSON-объект следующего формата:

```json
{
    "uuid": "fde4a7b9-ecbc-49df-8c98-52e82904394d",
    "status": "INITIAL"
}
```

**Поля ответа:**

-   `uuid` (строка): Уникальный идентификатор (UUID) процесса генерации изображения.
-   `status` (строка): Статус процесса генерации. Возможные значения: `"INITIAL"`, `"IN_PROGRESS"`, `"DONE"`, `"FAILED"`.

## Проверка статуса генерации изображения

### Метод: `GET`

**URL:** `/api/generate/{uuid}`

**Параметры запроса:**

-   `{uuid}` (строка): Уникальный идентификатор (UUID) процесса генерации изображения, полученный при отправке запроса на генерацию.

**Ответ:**

Сервер вернет JSON-объект, содержащий актуальный статус генерации:

```json
{
    "uuid": "fde4a7b9-ecbc-49df-8c98-52e82904394d",
    "image": "https://example.com/images/fde4a7b9-ecbc-49df-8c98-52e82904394d.jpg",
    "status": "DONE"
}
```

**Поля ответа:**

-   `uuid` (строка): Уникальный идентификатор (UUID) процесса генерации изображения.
-   `status` (строка): Актуальный статус процесса генерации. Возможные значения: `"INITIAL"`, `"IN_PROGRESS"`, `"DONE"`, `"FAILED"`.
-   `image` (строка): URL сгенерированного изображения. Поле доступно только при статусе `"DONE"`. В остальных случаях может быть отсутствовать или иметь значение `null`.

**Примечание:** При статусе `"FAILED"` может быть возвращено дополнительное поле `error_message` с описанием ошибки:

```json
{
    "uuid": "fde4a7b9-ecbc-49df-8c98-52e82904394d",
    "status": "FAILED",
    "error_message": "Ошибка генерации изображения"
}
```
