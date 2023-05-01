# Gerenciador de Objetos em Tempo Real com WebSockets e Node.js

Descriação
----------

1.  O Gerenciador de Objetos com WebSockets e Node.js é um aplicativo web que permite a criação, visualização, atualização e exclusão de objetos em tempo real. O aplicativo utiliza WebSockets para estabelecer uma comunicação bidirecional entre o cliente e o servidor, permitindo que as atualizações realizadas em um dispositivo sejam refletidas automaticamente em todos os outros dispositivos conectados.

2.  O aplicativo é construído usando JavaScript e suas APIs, Node.js, HTML e CSS. Os objetos são criados a partir de um formulário no navegador, e são armazenados em uma coleção no servidor. Cada objeto possui um ID único e um status que pode ser "Ativo" ou "Inativo". Os objetos criados são renderizados como DIVs na interface do usuário do navegador.

3.  O aplicativo permite que o usuário altere o status do objeto de "Ativo" para "Inativo" e vice-versa, bem como excluir o objeto completamente. Quando o status do objeto é alterado ou um objeto é excluído, o servidor envia uma mensagem atualizada para todos os clientes conectados via WebSockets, atualizando a lista de objetos na interface do usuário.

4.  O Gerenciador de Objetos com WebSockets e Node.js é uma aplicação útil para gerenciamento de dados em tempo real em ambientes colaborativos. Ele pode ser utilizado em diversos cenários, como controle de estoque, gerenciamento de tarefas, monitoramento de sistemas, entre outros.

Funcionalidades
---------------

1.  O aplicativo possui um botão "Criar" que, quando clicado, envia uma mensagem ao servidor via WebSocket para criar um novo objeto com status "Inativo".

2.  O servidor, ao receber a mensagem, insere o novo objeto em uma coleção de objetos e envia uma mensagem aos clientes conectados via WebSocket com os dados em JSON que representam a coleção de objetos atual.

3.  Cada objeto criado possui um ID, um status e botões "Alterar Status" e "Excluir".

4.  Os objetos são renderizados na página HTML como DIVs, com seu ID e status exibidos. O botão "Alterar Status" pode ter o valor "Ativar" ou "Desativar" dependendo do status atual do objeto.

5.  Quando o botão "Alterar Status" é clicado, o cliente envia uma mensagem ao servidor via WebSocket para alterar o status do objeto correspondente na coleção de objetos. 

6.  O servidor, ao receber a mensagem, altera o status do objeto e envia uma mensagem aos clientes conectados via WebSocket com os dados em JSON que representam a coleção de objetos atual.

7.  Quando o botão "Excluir" é clicado, o cliente envia uma mensagem ao servidor via WebSocket para excluir o objeto correspondente da coleção de objetos. 

8.  O servidor, ao receber a mensagem, exclui o objeto da coleção e envia uma mensagem aos clientes conectados via WebSocket com os dados em JSON que representam a coleção de objetos atual.


Tecnologias utilizadas
----------------------

*   HTML
*   CSS
*   JavaScript
*   Node.js
*   API express
*   API ws
*   API uuid

Como Executar
-------------

Para executar este projeto, siga os passos abaixo:

1.  Clone este repositório em sua máquina:


`git clone https://github.com/seu-usuario/calculadora-websocket.git`


2.  No terminal, navegue até o diretório do projeto


`cd <diretorio_aplicacao>'

3.  Certifique-se de ter o Node.js instalado em seu computador.

`node -v`

4.  Instale as dependências do projeto:

`npm install`

4.  Em seguida, execute o comando node server.js para iniciar o servidor.

5.  Abra o navegador e acesse a URL http://localhost:3000/ para acessar o aplicativo.

Como utilizar
-------------

1.  Abra o navegador e acesse http://localhost:3000.
2.  Na página do navegador, clique no botão "Criar" para criar um novo objeto com o status "Inativo".
3.  O objeto criado será exibido na página do navegador como uma DIV contendo o ID do objeto, o seu status e dois botões: "Ativar/Desativar" e "Excluir".
4.  Clique no botão "Ativar/Desativar" para alternar o status do objeto entre "Ativo" e "Inativo".
5.  Clique no botão "Excluir" para remover o objeto da lista.
6.  A página do navegador será atualizada automaticamente para exibir a lista atualizada de objetos.

Licença
-------

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---
