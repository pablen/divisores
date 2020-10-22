# Escobapp

![Node.js CI](https://github.com/pablen/escobapp/workflows/Node.js%20CI/badge.svg?branch=master)

Un juego de cartas similar a "Escoba del 15" para usar en ámbitos educativos de Matemática.

El juego es adaptable para distintos usos didácticos y permite configurar los siguientes parámetros.

- Tipo de carta: con figuras y números o sólo números.
- Valor a sumar: por defecto el valor a sumar es 10.
- Cantidad de cartas en la mesa al inicio de la partida.
- Cantidad de cartas por jugador al inicio de la partida.
- Cartas que conforman el mazo: Cuáles valores y qué cantidad de cada uno.
- Pausar cuando juega la máquina o no.
- Tiempo de espera antes de dar una pista de una posible jugada (o desactivar pistas por completo).

## Modo Offline

Una vez visitada la aplicación, la misma puede ser utilizada incluso sin conectividad a internet.

## Instalación y correr en modo desarrollo

```
$ npm i
$ npm start
```

## Correr tests unitarios

```
$ npm run test
```

## Correr tests end-to-end

1. Primero hay que tener corriendo la aplicación:

```
$ npm run start
```

2. Verificar que la URL en donde está disponible la aplicación coincida con el valor de `baseUrl` definido en el archivo `cypress.json`.
3. Ejecutar Cypress.

```
$ npm run cypress
```

4. Ejecutar los tests haciendo clic en el botón _Run all specs_.

## LICENCIA

[MIT](LICENSE)
