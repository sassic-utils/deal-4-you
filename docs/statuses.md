# Labels

Каждое объявление — это GitHub Issue. `listingsService.ts` читает значения из
labels вида `<prefix>:<value>` (`getLabelValue`, регистр не важен).

## category:

Список открытый — фильтр в UI строится динамически из значений, встретившихся
в объявлениях. Примеры:

```
category:electronics
category:furniture
category:cars
category:services
```

## city:

Список открытый, аналогично `category:`. Примеры:

```
city:berlin
city:hamburg
city:frankfurt
```

## status:

`generate-listings.ts` выгружает только **открытые** issues, так что закрытые
объявления (`status:sold`, `status:expired`) не попадают в `listings.json`, пока
issue не переоткрыт.

```
status:active
status:sold
status:expired
```
