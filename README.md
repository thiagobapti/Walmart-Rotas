# Walmart Rotas

O Walmart esta desenvolvendo um novo sistema de logistica e sua ajuda é muito importante neste momento. Sua tarefa será desenvolver o novo sistema de entregas visando sempre o menor custo. Para popular sua base de dados o sistema precisa expor um Webservices que aceite o formato de malha logística (exemplo abaixo), nesta mesma requisição o requisitante deverá informar um nome para este mapa. É importante que os mapas sejam persistidos para evitar que a cada novo deploy todas as informações desapareçam. O formato de malha logística é bastante simples, cada linha mostra uma rota: ponto de origem, ponto de destino e distância entre os pontos em quilômetros.

```
A B 10
B D 15
A C 20
C D 30
B E 50
D E 30
```

Com os mapas carregados o requisitante irá procurar o menor valor de entrega e seu caminho, para isso ele passará o mapa, nome do ponto de origem, nome do ponto de destino, autonomia do caminhão (km/l) e o valor do litro do combustível, agora sua tarefa é criar este Webservices.

Um exemplo de entrada seria, mapa SP, origem A, destino D, autonomia 10, valor do litro 2,50 onde a resposta seria a rota A B D com custo de 6,25.

## Requisitos 

* NodeJS 4+
* MongoDB 2.6+

## Instruções

1 Download do repositório

```sh
git clone https://github.com/thiagosyncmob/Walmart-Rotas.git
```

2 Instalação das dependências("express": "~4.13.4", "mongoose": "~4.3.7", "node-dijkstra": "^2.2.1",)

```sh
npm install
```

3 Iniciar o servidor

```sh
node app.js [porta] # Padrão 80
```

